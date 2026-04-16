const { addRecord, listRecords } = require('./_shared/ae_runtime_db');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') return json(200, { ok: true, assignments: listRecords('assignments') });
  if (method === 'POST') {
    const input = body(event);
    if (!input.taskId || !input.aeId) return json(400, { ok: false, error: 'taskId_and_aeId_required' });
    const assignment = addRecord('assignments', { taskId: String(input.taskId), aeId: String(input.aeId), status: 'active' });
    return json(201, { ok: true, assignment });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
