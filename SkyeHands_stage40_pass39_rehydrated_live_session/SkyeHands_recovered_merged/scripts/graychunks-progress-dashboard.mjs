#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const findingsPath = path.join(root, 'skydexia', 'alerts', 'graychunks-findings.json');
const queuePath = path.join(root, 'skydexia', 'alerts', 'graychunks-priority-queue.json');
const dashboardJson = path.join(root, 'skydexia', 'alerts', 'graychunks-progress.json');
const dashboardMd = path.join(root, 'GRAYCHUNKS_PROGRESS.md');

const completion = spawnSync(process.execPath, [path.join(root, 'scripts', 'directive-completion.mjs')], { cwd: root, encoding: 'utf8' });
const completionPayload = JSON.parse(completion.stdout || '{}');
const findings = fs.existsSync(findingsPath) ? JSON.parse(fs.readFileSync(findingsPath, 'utf8')) : null;
const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, 'utf8')) : null;
const previous = fs.existsSync(dashboardJson) ? JSON.parse(fs.readFileSync(dashboardJson, 'utf8')) : null;

function delta(current, prior) {
  if (typeof current !== 'number' || typeof prior !== 'number') return null;
  return current - prior;
}

const issueDeltas = {};
for (const [type, count] of Object.entries(findings?.issuesByType || {})) {
  issueDeltas[type] = delta(count, previous?.graychunks?.issuesByType?.[type]);
}

const payload = {
  generatedAt: new Date().toISOString(),
  directiveCompletion: {
    percent: completionPayload.completionPercent || null,
    checkedItems: completionPayload.checkedItems || null,
    totalItems: completionPayload.totalItems || null,
    uncheckedItems: completionPayload.uncheckedItems || null
  },
  graychunks: {
    scannedFiles: findings?.scannedFiles ?? null,
    issueCount: findings?.issueCount ?? null,
    issuesByType: findings?.issuesByType || {},
    queuedIssues: queue?.queuedIssues ?? null,
    summaryBySeverity: queue?.summaryBySeverity || {}
  },
  trend: {
    previousGeneratedAt: previous?.generatedAt || null,
    issueCountDelta: delta(findings?.issueCount, previous?.graychunks?.issueCount),
    queuedIssuesDelta: delta(queue?.queuedIssues, previous?.graychunks?.queuedIssues),
    issuesByTypeDelta: issueDeltas
  }
};

fs.mkdirSync(path.dirname(dashboardJson), { recursive: true });
fs.writeFileSync(dashboardJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const mdLines = [
  '# GrayChunks Progress Dashboard',
  '',
  `GeneratedAt: ${payload.generatedAt}`,
  `Directive completion: ${payload.directiveCompletion.percent}% (${payload.directiveCompletion.checkedItems}/${payload.directiveCompletion.totalItems})`,
  `Unchecked items: ${payload.directiveCompletion.uncheckedItems}`,
  '',
  `GrayChunks scanned files: ${payload.graychunks.scannedFiles}`,
  `GrayChunks issue count: ${payload.graychunks.issueCount}`,
  `GrayChunks queued issues: ${payload.graychunks.queuedIssues}`,
  `GrayChunks issue delta: ${payload.trend.issueCountDelta ?? 'n/a'}`,
  `GrayChunks queue delta: ${payload.trend.queuedIssuesDelta ?? 'n/a'}`,
  '',
  '## GrayChunks issue types',
  ...Object.entries(payload.graychunks.issuesByType).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## GrayChunks issue type deltas',
  ...Object.entries(payload.trend.issuesByTypeDelta).map(([k, v]) => `- ${k}: ${v ?? 'n/a'}`),
  '',
  '## Queue severity summary',
  ...Object.entries(payload.graychunks.summaryBySeverity).map(([k, v]) => `- ${k}: ${v}`)
];

fs.writeFileSync(dashboardMd, `${mdLines.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: 'PASS', json: path.relative(root, dashboardJson), markdown: path.relative(root, dashboardMd) }, null, 2));
