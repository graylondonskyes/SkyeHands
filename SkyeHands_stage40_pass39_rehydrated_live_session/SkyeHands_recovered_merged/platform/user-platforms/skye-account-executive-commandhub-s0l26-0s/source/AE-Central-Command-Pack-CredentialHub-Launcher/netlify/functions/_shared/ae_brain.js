
const { AE_ROSTER } = require('./ae_roster');

async function callAeBrain({ aeId, message }) {
  const ae = AE_ROSTER.find(item => item.id === aeId) || AE_ROSTER[0];
  return {
    text: `Simulated reply from ${ae?.name || 'AE'}: ${String(message || '')}`,
    provider: 'openai',
    failoverProviders: ['anthropic', 'gemini'],
    keySlot: ae?.keySlot,
  };
}

function getMergedAeProfile(ae) {
  return ae;
}

module.exports = { callAeBrain, getMergedAeProfile, FALLBACK: ['anthropic', 'gemini'] };
