#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const directivePath = path.join(root, 'ULTIMATE_SYSTEM_DIRECTIVE.md');
const smokeProofPath = path.join(
  root,
  'platform/user-platforms/skye-account-executive-commandhub-s0l26-0s/source/AE-Central-Command-Pack-CredentialHub-Launcher/Branching Apps/AE-Brain-Command-Site-v8-Additive/docs/SMOKE_PROOF.md',
);

const validator = spawnSync(process.execPath, [path.join(root, 'scripts/validate-ultimate-directive.mjs')], {
  stdio: 'pipe',
  encoding: 'utf8',
});

const smokeExists = fs.existsSync(smokeProofPath);
const smokeStatusPass = smokeExists && /Status:\s*PASS/.test(fs.readFileSync(smokeProofPath, 'utf8'));

const directiveSha256 = fs.existsSync(directivePath)
  ? crypto.createHash('sha256').update(fs.readFileSync(directivePath)).digest('hex')
  : null;

const report = {
  directiveValidated: validator.status === 0,
  smokeProofPath: path.relative(root, smokeProofPath),
  smokeStatusPass,
  directiveSha256,
};

console.log(JSON.stringify(report, null, 2));

if (validator.status !== 0 || !smokeStatusPass) {
  if (validator.stdout) process.stderr.write(validator.stdout);
  if (validator.stderr) process.stderr.write(validator.stderr);
  process.exit(1);
}
