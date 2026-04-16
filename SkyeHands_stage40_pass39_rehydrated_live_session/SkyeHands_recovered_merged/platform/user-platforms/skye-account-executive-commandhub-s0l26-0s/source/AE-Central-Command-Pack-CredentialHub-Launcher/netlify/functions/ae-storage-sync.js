const { writeSnapshot, latestSnapshot } = require('./_shared/ae_runtime_db');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') return json(200, { ok: true, snapshot: latestSnapshot() });
  if (method === 'POST') {
    const snapshot = writeSnapshot(body(event));
    return json(201, { ok: true, snapshot });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
