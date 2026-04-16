const { listRecords, addRecord, updateRecord } = require('./_shared/ae_runtime_db');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') return json(200, { ok: true, users: listRecords('clients').map((client) => ({ id: client.id, email: client.email, status: client.status })) });
  if (method === 'POST') {
    const input = body(event);
    if (!input.email) return json(400, { ok: false, error: 'email_required' });
    const user = addRecord('clients', { name: input.name || input.email, email: String(input.email).toLowerCase(), status: 'active' });
    return json(201, { ok: true, user });
  }
  if (method === 'PATCH') {
    const input = body(event);
    const updated = updateRecord('clients', input.id, { status: String(input.status || 'active') });
    if (!updated) return json(404, { ok: false, error: 'user_not_found' });
    return json(200, { ok: true, user: updated });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
