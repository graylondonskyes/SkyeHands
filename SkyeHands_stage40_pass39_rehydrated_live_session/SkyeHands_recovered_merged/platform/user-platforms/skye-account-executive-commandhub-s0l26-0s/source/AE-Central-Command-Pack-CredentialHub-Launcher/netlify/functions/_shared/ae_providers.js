const RESPONSES_ROUTE = '/v1/responses';

const PROVIDER_CONTRACTS = {
  openai: {
    provider: 'openai',
    requiredEnv: ['OPENAI_API_KEY'],
    requiredActionFields: ['model', 'input'],
    endpoint: RESPONSES_ROUTE
  },
  printful: {
    provider: 'printful',
    requiredEnv: ['PRINTFUL_API_TOKEN'],
    requiredActionFields: ['sku', 'quantity'],
    endpoint: '/store/orders'
  },
  calendly: {
    provider: 'calendly',
    requiredEnv: ['CALENDLY_TOKEN'],
    requiredActionFields: ['eventTypeUri', 'inviteeEmail'],
    endpoint: '/scheduled_events'
  }
};

function getProviderContract(provider) {
  return PROVIDER_CONTRACTS[String(provider || '').toLowerCase()] || null;
}

function validateProviderAction(provider, action = {}, env = process.env) {
  const contract = getProviderContract(provider);
  if (!contract) {
    return { ok: false, errors: [`Unsupported provider '${provider}'.`] };
  }

  const missingEnv = contract.requiredEnv.filter((key) => !String(env[key] || '').trim());
  const missingFields = contract.requiredActionFields.filter((key) => action[key] === undefined || action[key] === null || String(action[key]).trim() === '');
  const errors = [];
  if (missingEnv.length) errors.push(`Missing env vars: ${missingEnv.join(', ')}`);
  if (missingFields.length) errors.push(`Missing action fields: ${missingFields.join(', ')}`);

  return {
    ok: errors.length === 0,
    provider: contract.provider,
    endpoint: contract.endpoint,
    errors,
    contract
  };
}

async function executeProviderAction(provider, action = {}, env = process.env) {
  const validation = validateProviderAction(provider, action, env);
  if (!validation.ok) {
    return {
      ok: false,
      provider: validation.provider || provider,
      endpoint: validation.endpoint || null,
      errors: validation.errors,
      executedAt: new Date().toISOString()
    };
  }

  return {
    ok: true,
    provider: validation.provider,
    endpoint: validation.endpoint,
    request: action,
    executionId: `ae_provider_${validation.provider}_${Date.now()}`,
    executedAt: new Date().toISOString()
  };
}

module.exports = {
  RESPONSES_ROUTE,
  getProviderContract,
  validateProviderAction,
  executeProviderAction
};
