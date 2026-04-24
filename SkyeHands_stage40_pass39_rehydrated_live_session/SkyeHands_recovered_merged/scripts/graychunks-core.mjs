import fs from 'node:fs';
import path from 'node:path';

const CODE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.json']);
const DEFAULT_CONFIG = {
  ignoreSegments: [
    'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
    '.media-center-storage', '.ae-runtime', 'snapshots', 'proof', 'generated-projects'
  ],
  ignorePathPrefixes: ['workspace/volumes', 'dist/production-release', 'dist/ship-candidate'],
  jsxExtensions: ['.jsx', '.tsx'],
  severityByType: {
    duplicate_import: 'medium',
    duplicate_object_key: 'high',
    repeated_config_key: 'medium',
    broken_jsx_structure: 'critical',
    repeated_chunk: 'low'
  },
  ownershipRules: {
    'platform/user-platforms/': 'ae-platform-team',
    'platform/ide-core/': 'ide-core-team',
    'apps/': 'runtime-team'
  },
  repeatedChunkOptions: {
    windowSize: 5,
    minLineLength: 20,
    maxIssuesPerFile: 5,
    minSemanticLines: 3
  }
};

const TYPE_ONLY_TAG_NAMES = new Set([
  'Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Record', 'Pick', 'Omit', 'Partial', 'Required',
  'Readonly', 'ReadonlyArray', 'ReturnType', 'Parameters', 'ConstructorParameters', 'Promise',
  'Iterable', 'IterableIterator', 'Iterator', 'Generator', 'NodeJS', 'React', 'ReactNode',
  'HTMLElement', 'HTMLDivElement', 'HTMLSpanElement', 'HTMLInputElement', 'HTMLButtonElement',
  'HTMLSelectElement', 'HTMLTextAreaElement', 'HTMLAnchorElement', 'HTMLHeadingElement',
  'HTMLUListElement', 'HTMLLIElement', 'HTMLFormElement', 'HTMLCanvasElement',
  'URI', 'Disposable', 'Widget', 'TreeNode', 'CompositeTreeNode', 'TreeElement',
  'DebugProtocol', 'Interfaces', 'DebugRequestTypes', 'Mutable'
]);

function readString(value) {
  return String(value ?? '').trim();
}

export function loadGrayChunksConfig(rootDir) {
  const configPath = path.join(rootDir, 'graychunks.config.json');
  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG, configPath: null };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return {
      configPath,
      ignoreSegments: Array.isArray(parsed.ignoreSegments) && parsed.ignoreSegments.length ? parsed.ignoreSegments : DEFAULT_CONFIG.ignoreSegments,
      ignorePathPrefixes: Array.isArray(parsed.ignorePathPrefixes) ? parsed.ignorePathPrefixes : DEFAULT_CONFIG.ignorePathPrefixes,
      jsxExtensions: Array.isArray(parsed.jsxExtensions) && parsed.jsxExtensions.length ? parsed.jsxExtensions : DEFAULT_CONFIG.jsxExtensions,
      severityByType: { ...DEFAULT_CONFIG.severityByType, ...(parsed.severityByType || {}) },
      ownershipRules: { ...DEFAULT_CONFIG.ownershipRules, ...(parsed.ownershipRules || {}) },
      repeatedChunkOptions: { ...DEFAULT_CONFIG.repeatedChunkOptions, ...(parsed.repeatedChunkOptions || {}) }
    };
  } catch {
    return { ...DEFAULT_CONFIG, configPath };
  }
}

function shouldSkipPath(relativePath, ignoreSegments, ignorePathPrefixes) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (ignorePathPrefixes.some((prefix) => normalized.startsWith(prefix.replace(/\\/g, '/')))) return true;
  const parts = normalized.split('/');
  return parts.some((part) => ignoreSegments.includes(part));
}

function listFiles(rootDir, config) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const relative = path.relative(rootDir, current) || '';
    if (relative && shouldSkipPath(relative, config.ignoreSegments, config.ignorePathPrefixes || [])) continue;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        stack.push(path.join(current, entry.name));
      }
      continue;
    }
    if (!CODE_EXTENSIONS.has(path.extname(current))) continue;
    out.push(current);
  }
  return out;
}

function stripLineComment(line) {
  const marker = line.indexOf('//');
  if (marker === -1) return line;
  return line.slice(0, marker);
}

function isImportContinuation(line) {
  const trimmed = readString(line);
  return Boolean(trimmed && !trimmed.startsWith('import ') && !trimmed.includes(' from ') && !trimmed.endsWith(';'));
}

function detectDuplicateImports(lines, relativePath) {
  const issues = [];
  const seenImports = new Map();
  let activeImportStart = -1;
  let activeImport = [];

  function flushImport(endLine) {
    if (!activeImport.length) return;
    const normalized = activeImport.join(' ').replace(/\s+/g, ' ').trim().replace(/;$/, '');
    if (seenImports.has(normalized)) {
      issues.push({
        type: 'duplicate_import',
        file: relativePath,
        line: activeImportStart + 1,
        message: `Duplicate import statement repeated from line ${seenImports.get(normalized)}.`
      });
    } else {
      seenImports.set(normalized, activeImportStart + 1);
    }
    activeImportStart = -1;
    activeImport = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = readString(stripLineComment(lines[index]));
    if (!line) continue;

    if (activeImport.length) {
      activeImport.push(line);
      if (line.endsWith(';') || line.includes(' from ')) flushImport(index);
      continue;
    }

    if (!line.startsWith('import ')) continue;
    activeImportStart = index;
    activeImport = [line];
    if (line.endsWith(';') || line.includes(' from ') || !isImportContinuation(line)) flushImport(index);
  }
  flushImport(lines.length - 1);
  return issues;
}

function lineLooksLikeObjectKey(line) {
  const trimmed = stripLineComment(line).trim();
  if (!trimmed) return false;
  if (/^(case|default|export|import|return|throw|if|for|while|switch|catch|class|interface|type|enum|namespace)\b/.test(trimmed)) return false;
  if (/^[A-Za-z_$][\w$-]*\s*:\s*(public|private|protected|readonly|abstract|static)\b/.test(trimmed)) return false;
  return /^([A-Za-z_$][\w$-]*|['"][^'"]+['"])\s*:/.test(trimmed);
}

function countStructuralChar(line, char) {
  let count = 0;
  let quote = null;
  let escaped = false;
  for (const ch of line) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === char) count += 1;
  }
  return count;
}

function detectDuplicateObjectKeys(lines, relativePath) {
  if (path.extname(relativePath).toLowerCase() === '.json') return [];
  const issues = [];
  const keyRegex = /^\s*([A-Za-z_$][\w$-]*|['"]([^'"]+)['"])\s*:/;
  const keyStack = [];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const opens = countStructuralChar(rawLine, '{');
    for (let n = 0; n < opens; n += 1) keyStack.push(new Map());

    const match = rawLine.match(keyRegex);
    if (match && keyStack.length && lineLooksLikeObjectKey(rawLine)) {
      const key = match[2] || match[1];
      const keys = keyStack[keyStack.length - 1];
      if (keys.has(key)) {
        issues.push({ type: 'duplicate_object_key', file: relativePath, line: index + 1, message: `Object key '${key}' repeats key first seen on line ${keys.get(key)}.` });
      } else {
        keys.set(key, index + 1);
      }
    }

    const closes = countStructuralChar(rawLine, '}');
    for (let n = 0; n < closes; n += 1) keyStack.pop();
  }

  return issues;
}

function previousNonWhitespaceChar(text, index) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const ch = text[cursor];
    if (!/\s/.test(ch)) return ch;
  }
  return '';
}

function nextNonWhitespaceChar(text, index) {
  for (let cursor = index; cursor < text.length; cursor += 1) {
    const ch = text[cursor];
    if (!/\s/.test(ch)) return ch;
  }
  return '';
}

function isLikelyTypeGeneric(joined, match) {
  const tag = match[1];
  const index = match.index || 0;
  const prev = previousNonWhitespaceChar(joined, index);
  const afterTagIndex = index + match[0].length;
  const next = nextNonWhitespaceChar(joined, afterTagIndex);
  if (TYPE_ONLY_TAG_NAMES.has(tag)) return true;
  if (/[A-Za-z0-9_$.)\]]/.test(prev)) return true;
  if (next === ';' || next === ':' || next === ',' || next === ')' || next === ']' || next === '|') return true;
  const lineStart = joined.lastIndexOf('\n', index) + 1;
  const lineEnd = joined.indexOf('\n', index);
  const line = joined.slice(lineStart, lineEnd === -1 ? joined.length : lineEnd).trim();
  if (/^(type|interface|declare|export\s+type|export\s+interface|const\s+\w+\s*:|let\s+\w+\s*:|var\s+\w+\s*:)/.test(line)) return true;
  return false;
}

function detectBrokenJsx(lines, relativePath, jsxExtensions) {
  const ext = path.extname(relativePath).toLowerCase();
  if (!jsxExtensions.includes(ext)) return [];

  const joined = lines.join('\n');
  const issues = [];
  const openCount = new Map();
  const closeCount = new Map();
  const openRegex = /<([A-Z][A-Za-z0-9]{2,})\b(?![^>]*\/>)((?:(?!=>)[^\n])*?)>/g;
  const closeRegex = /<\/([A-Z][A-Za-z0-9]{2,})>/g;

  for (const match of joined.matchAll(openRegex)) {
    if (isLikelyTypeGeneric(joined, match)) continue;
    const tag = match[1];
    openCount.set(tag, (openCount.get(tag) || 0) + 1);
  }

  for (const match of joined.matchAll(closeRegex)) {
    const tag = match[1];
    if (TYPE_ONLY_TAG_NAMES.has(tag)) continue;
    closeCount.set(tag, (closeCount.get(tag) || 0) + 1);
  }

  for (const [tag, count] of openCount.entries()) {
    if ((closeCount.get(tag) || 0) !== count) {
      issues.push({ type: 'broken_jsx_structure', file: relativePath, line: 1, message: `JSX tag '${tag}' has ${count} openings but ${closeCount.get(tag) || 0} closings.` });
    }
  }

  return issues;
}

function detectRepeatedConfigKeys(lines, relativePath) {
  if (path.extname(relativePath).toLowerCase() !== '.json') return [];
  const keyRegex = /^\s*"([^"\\]+)"\s*:/;
  const keyStack = [];
  const issues = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const _ of line.match(/\{/g) || []) keyStack.push(new Map());

    const match = line.match(keyRegex);
    if (match && keyStack.length) {
      const key = match[1];
      const keys = keyStack[keyStack.length - 1];
      if (keys.has(key)) {
        issues.push({ type: 'repeated_config_key', file: relativePath, line: index + 1, message: `JSON key '${key}' repeats key first seen on line ${keys.get(key)}.` });
      } else {
        keys.set(key, index + 1);
      }
    }

    for (const _ of line.match(/\}/g) || []) keyStack.pop();
  }

  return issues;
}

function detectRepeatedChunks(lines, relativePath, options = DEFAULT_CONFIG.repeatedChunkOptions) {
  const windowSize = Math.max(3, Number.parseInt(options.windowSize || DEFAULT_CONFIG.repeatedChunkOptions.windowSize, 10));
  const minLineLength = Math.max(10, Number.parseInt(options.minLineLength || DEFAULT_CONFIG.repeatedChunkOptions.minLineLength, 10));
  const maxIssuesPerFile = Math.max(1, Number.parseInt(options.maxIssuesPerFile || DEFAULT_CONFIG.repeatedChunkOptions.maxIssuesPerFile, 10));
  const minSemanticLines = Math.max(2, Number.parseInt(options.minSemanticLines || DEFAULT_CONFIG.repeatedChunkOptions.minSemanticLines, 10));
  const issues = [];
  const seen = new Map();

  for (let index = 0; index <= lines.length - windowSize; index += 1) {
    const block = lines.slice(index, index + windowSize).map((line) => readString(line));
    if (block.some((line) => !line || line.startsWith('//') || line.length < minLineLength)) continue;
    if (block.some((line) => /^[{}()[\];,]+$/.test(line.replace(/\s+/g, '')))) continue;
    if (block.some((line) => /^(import|export|function|if|for|while|switch|catch)\b/.test(line))) continue;
    if (block.filter((line) => /(=|return\b|await\b|\.[A-Za-z_$][\w$]*\(|\bnew\b)/.test(line)).length < minSemanticLines) continue;
    if (new Set(block).size !== block.length) continue;
    const key = block.join('\n');
    if (seen.has(key)) {
      const originalLine = seen.get(key);
      if ((index + 1) - originalLine < windowSize) continue;
      issues.push({
        type: 'repeated_chunk',
        file: relativePath,
        line: index + 1,
        message: `Repeated ${windowSize}-line chunk first seen on line ${originalLine}.`
      });
      if (issues.length >= maxIssuesPerFile) break;
      continue;
    }
    seen.set(key, index + 1);
  }

  return issues;
}

export function scanGrayChunks({ rootDir, targetDir = rootDir, config = loadGrayChunksConfig(rootDir) } = {}) {
  const files = listFiles(targetDir, config);
  const issues = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const relative = path.relative(rootDir, filePath).replace(/\\/g, '/');

    issues.push(...detectDuplicateImports(lines, relative));
    issues.push(...detectDuplicateObjectKeys(lines, relative));
    issues.push(...detectBrokenJsx(lines, relative, config.jsxExtensions || DEFAULT_CONFIG.jsxExtensions));
    issues.push(...detectRepeatedConfigKeys(lines, relative));
    issues.push(...detectRepeatedChunks(lines, relative, config.repeatedChunkOptions || DEFAULT_CONFIG.repeatedChunkOptions));
  }

  const byType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    configPath: config.configPath ? path.relative(rootDir, config.configPath).replace(/\\/g, '/') : null,
    scannedFiles: files.length,
    issueCount: issues.length,
    issuesByType: byType,
    issues
  };
}

export function writeGrayChunkReports({ rootDir, report }) {
  const outDir = path.join(rootDir, 'skydexia', 'alerts');
  const jsonPath = path.join(outDir, 'graychunks-findings.json');
  const mdPath = path.join(rootDir, 'GRAYCHUNKS_REPORT.md');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const lines = [
    '# GrayChunks Scan Report',
    '',
    `GeneratedAt: ${report.generatedAt}`,
    `ConfigPath: ${report.configPath || 'default'}`,
    `Scanned files: ${report.scannedFiles}`,
    `Issue count: ${report.issueCount}`,
    '',
    '## Issue Types',
    ...Object.entries(report.issuesByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => `- ${type}: ${count}`),
    '',
    '## Top Findings',
    ...report.issues.slice(0, 50).map((issue) => `- ${issue.type} | ${issue.file}:${issue.line} | ${issue.message}`)
  ];

  fs.writeFileSync(mdPath, `${lines.join('\n')}\n`, 'utf8');
  return { jsonPath, mdPath };
}

export function makeRelative(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).replace(/\\/g, '/');
}

export function resolveSafeTargetDir(rootDir, targetValue, { enforceWithinRoot = true } = {}) {
  const value = readString(targetValue);
  if (!value) return rootDir;
  const resolved = path.resolve(rootDir, value);
  if (!enforceWithinRoot) return resolved;
  const relative = path.relative(rootDir, resolved);
  if (relative && (relative.startsWith('..') || path.isAbsolute(relative))) {
    throw new Error(`Target directory must remain within repository root: ${value}`);
  }
  return resolved;
}

export function resolveOwner(filePath, ownershipRules = DEFAULT_CONFIG.ownershipRules) {
  const entries = Object.entries(ownershipRules || {});
  for (const [prefix, owner] of entries) {
    if (filePath.startsWith(prefix)) return owner;
  }
  return 'core-platform-team';
}
