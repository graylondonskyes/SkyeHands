#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const directivePath = path.join(root, 'ULTIMATE_SYSTEM_DIRECTIVE.md');

if (!fs.existsSync(directivePath)) {
  console.error('Directive not found:', directivePath);
  process.exit(1);
}

const content = fs.readFileSync(directivePath, 'utf8');
const lines = content.split('\n');

const taskRegex = /^(✅|⬜)\s+P(\d{3})\s+\|\s+(Easy|Medium|Complex)\s+\|\s+(.+)$/;
const tasks = lines
  .map((line, index) => ({ line, index: index + 1, match: line.match(taskRegex) }))
  .filter((row) => row.match)
  .map((row) => ({
    line: row.line,
    lineNumber: row.index,
    status: row.match[1],
    patchNumber: Number(row.match[2]),
    complexity: row.match[3],
    body: row.match[4],
  }));

const checked = tasks.filter((task) => task.status === '✅');
const unchecked = tasks.filter((task) => task.status === '⬜');
const missingSmoke = checked.filter((task) => !task.line.includes('SMOKE:'));

const total = tasks.length;
const done = checked.length;
const pct = total ? Math.round((done / total) * 100) : 0;

const completionLine = lines.find((line) => line.startsWith('**Completion Status:**')) || '';
const expectedCompletion = `**Completion Status:** **${pct}%** (**${done}/${total} items complete)**`;

let ok = true;

if (missingSmoke.length) {
  ok = false;
  console.error('Checked items missing SMOKE evidence:');
  missingSmoke.forEach((task) => console.error(`  - L${task.lineNumber}: ${task.line}`));
}

if (completionLine && completionLine.trim() !== expectedCompletion.trim()) {
  ok = false;
  console.error('Completion line mismatch.');
  console.error('  Found:   ', completionLine.trim());
  console.error('  Expected:', expectedCompletion.trim());
}

const patchNumbers = tasks.map((task) => task.patchNumber);
for (let i = 0; i < patchNumbers.length; i += 1) {
  if (patchNumbers[i] !== i + 1) {
    ok = false;
    console.error(`Patch numbering mismatch at task index ${i + 1}: expected P${String(i + 1).padStart(3, '0')} got P${String(patchNumbers[i]).padStart(3, '0')}`);
    break;
  }
}

const rank = { Easy: 1, Medium: 2, Complex: 3 };
for (let i = 1; i < tasks.length; i += 1) {
  const prev = rank[tasks[i - 1].complexity];
  const curr = rank[tasks[i].complexity];
  if (curr < prev) {
    ok = false;
    console.error(`Complexity ordering regression between L${tasks[i - 1].lineNumber} and L${tasks[i].lineNumber}.`);
    break;
  }
}

console.log(JSON.stringify({
  directivePath: path.relative(root, directivePath),
  totalItems: total,
  checkedItems: done,
  uncheckedItems: unchecked.length,
  completionPercent: pct,
  checkedWithSmokeEvidence: checked.length - missingSmoke.length,
  statusVocabulary: ['✅', '⬜'],
  patchNumbering: 'contiguous',
  complexityOrder: 'Easy->Medium->Complex',
}, null, 2));

if (!ok) process.exit(1);
