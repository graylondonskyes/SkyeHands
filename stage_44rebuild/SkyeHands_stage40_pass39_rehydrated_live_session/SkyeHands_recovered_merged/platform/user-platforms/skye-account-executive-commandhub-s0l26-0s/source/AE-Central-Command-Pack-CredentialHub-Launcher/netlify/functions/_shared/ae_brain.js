const crypto = require('node:crypto');
const { AE_ROSTER } = require('./ae_roster');

function resolveProvider() {
  return String(process.env.AE_PRIMARY_MODEL_PROVIDER || 'openai').toLowerCase();
}

function resolveFallbackProviders() {
  const raw = String(process.env.AE_FALLBACK_MODEL_PROVIDERS || 'anthropic,gemini');
  return raw.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
}

async function callAeBrain({ aeId, message, model = 'gpt-4.1-mini', context = {} } = {}) {
  const trimmedMessage = String(message || '').trim();
  if (!trimmedMessage) {
    throw new Error('AE brain request requires a non-empty message.');
  }

  const ae = AE_ROSTER.find((item) => item.id === aeId) || AE_ROSTER[0] || { id: 'ae-default', name: 'AE Default', keySlot: 'default' };
  return {
    responseId: `ae_resp_${crypto.randomUUID()}`,
    aeId: ae.id,
    aeName: ae.name,
    provider: resolveProvider(),
    model,
    keySlot: ae.keySlot,
    generatedAt: new Date().toISOString(),
    content: {
      type: 'execution_acknowledgement',
      message: trimmedMessage,
      context
    },
    failoverProviders: resolveFallbackProviders()
  };
}

function getMergedAeProfile(ae) {
  return ae;
}

module.exports = { callAeBrain, getMergedAeProfile, FALLBACK: resolveFallbackProviders() };
