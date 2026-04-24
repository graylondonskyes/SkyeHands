#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 4799;
const token = 'smoke-server-token';

const server = spawn(process.execPath, [path.join(root, 'scripts', 'graychunks-platform-server.mjs')], {
  cwd: root,
  env: { ...process.env, GRAYCHUNKS_PORT: String(port), GRAYCHUNKS_API_TOKEN: token, GRAYCHUNKS_ALERT_DRY_RUN: '1' },
  stdio: ['ignore', 'pipe', 'pipe']
});

function waitForReady() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('server_start_timeout')), 7000);
    server.stdout.on('data', (chunk) => {
      const line = String(chunk);
      if (line.includes('LISTENING')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.on('exit', (code) => reject(new Error(`server_exited_${code}`)));
  });
}

await waitForReady();

const statusRes = await fetch(`http://127.0.0.1:${port}/status`);
const queueRes = await fetch(`http://127.0.0.1:${port}/queue`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-graychunks-token': token },
  body: JSON.stringify({ action: 'queue' })
});
const alertRes = await fetch(`http://127.0.0.1:${port}/alert`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-graychunks-token': token },
  body: JSON.stringify({ action: 'alert', dryRun: true })
});
const invalidTargetRes = await fetch(`http://127.0.0.1:${port}/scan`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-graychunks-token': token },
  body: JSON.stringify({ action: 'scan', target: '../../' })
});

const statusBody = await statusRes.json();
const queueBody = await queueRes.json();
const alertBody = await alertRes.json();
const invalidTargetBody = await invalidTargetRes.json();

const pass = statusRes.ok && queueRes.ok && alertRes.ok && invalidTargetRes.status === 400
  && Boolean(statusBody.findings)
  && Boolean(queueBody.queue)
  && Boolean(alertBody.dispatch)
  && invalidTargetBody.error === 'invalid_target';

const artifact = path.join(root, 'SMOKE_P087_GRAYCHUNKS_PLATFORM_SERVER.md');
fs.writeFileSync(artifact, [
  '# P087 Smoke Proof — GrayChunks Platform Server',
  '',
  `Status: ${pass ? 'PASS' : 'FAIL'}`,
  `Status endpoint HTTP: ${statusRes.status}`,
  `Queue endpoint HTTP: ${queueRes.status}`,
  `Alert endpoint HTTP: ${alertRes.status}`,
  `Invalid target HTTP: ${invalidTargetRes.status}`,
  `Status has findings: ${Boolean(statusBody.findings)}`,
  `Queue has queue payload: ${Boolean(queueBody.queue)}`,
  `Alert has dispatch payload: ${Boolean(alertBody.dispatch)}`,
  `Invalid target blocked: ${invalidTargetBody.error === 'invalid_target'}`
].join('\n') + '\n', 'utf8');

server.kill('SIGTERM');

console.log(JSON.stringify({ pass, artifact: path.relative(root, artifact) }, null, 2));
if (!pass) process.exit(1);
