const { addRecord, listRecords } = require('./_shared/ae_runtime_db');

function json(statusCode, payload) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }; }
function body(event = {}) { try { return JSON.parse(event.body || '{}'); } catch { return {}; } }

module.exports.handler = async (event = {}) => {
  const method = String(event.httpMethod || 'GET').toUpperCase();
  if (method === 'GET') {
    const threadId = event.queryStringParameters?.threadId;
    const messages = listRecords('messages', (item) => !threadId || item.threadId === threadId);
    return json(200, { ok: true, messages });
  }
  if (method === 'POST') {
    const input = body(event);
    if (!input.threadId || !input.content) return json(400, { ok: false, error: 'threadId_and_content_required' });
    const message = addRecord('messages', { threadId: String(input.threadId), author: String(input.author || 'system'), content: String(input.content) });
    return json(201, { ok: true, message });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
};
