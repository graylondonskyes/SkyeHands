const { addRecord, listRecords } = require('./_shared/ae_runtime_db');
const { appendAuditEvent, writeUsageEvent } = require('./_shared/ae_state');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') return json(200, { ok: true, clients: listRecords('clients') });
  if (method === 'POST') {
    const input = body(event);
    if (!input.name || !input.email) return json(400, { ok: false, error: 'name_and_email_required' });
    const client = addRecord('clients', { name: String(input.name), email: String(input.email).toLowerCase(), status: String(input.status || 'prospect') });
    await writeUsageEvent({ route: 'ae-clients', action: 'create_client', actorId: 'ae-system', detail: { clientId: client.id } });
    await appendAuditEvent({ action: 'ae_client_created', actorId: 'ae-system', actorType: 'system', resource: client.id, outcome: 'ok' });
    return json(201, { ok: true, client });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
