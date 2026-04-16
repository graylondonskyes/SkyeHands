#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const providers = require(path.join(root, 'platform', 'user-platforms', 'skye-account-executive-commandhub-s0l26-0s', 'source', 'AE-Central-Command-Pack-CredentialHub-Launcher', 'netlify', 'functions', '_shared', 'ae_providers.js'));
const artifact = path.join(root, 'SMOKE_P023_PROVIDER_OUTAGE_FAILOVER.md');
const original = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'anthropic-failover-key';

const result = await providers.executeWithFailover('openai', ['anthropic', 'gemini'], { model: 'gpt-4.1-mini', input: 'outage failover check' });
if (original) process.env.OPENAI_API_KEY = original;
const pass = Boolean(result.ok && result.selectedProvider === 'anthropic' && result.attempts[0].ok === false);
fs.writeFileSync(artifact, `# P023 Smoke Proof — Provider Outage Failover\n\nStatus: ${pass ? 'PASS' : 'FAIL'}\n- selectedProvider: ${result.selectedProvider}\n`, 'utf8');
console.log(JSON.stringify({ pass, artifact: path.relative(root, artifact) }, null, 2));
if (!pass) process.exit(1);
