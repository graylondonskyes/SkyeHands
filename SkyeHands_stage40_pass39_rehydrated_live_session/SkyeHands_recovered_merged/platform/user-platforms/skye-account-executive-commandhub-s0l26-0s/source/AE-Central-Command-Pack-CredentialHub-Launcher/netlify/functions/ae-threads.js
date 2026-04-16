const { addRecord, listRecords } = require('./_shared/ae_runtime_db');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') return json(200, { ok: true, threads: listRecords('threads') });
  if (method === 'POST') {
    const input = body(event);
    if (!input.clientId || !input.subject) return json(400, { ok: false, error: 'clientId_and_subject_required' });
    const thread = addRecord('threads', { clientId: String(input.clientId), subject: String(input.subject), status: 'open' });
    return json(201, { ok: true, thread });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
