
function mintSession(payload, secret = '') {
  return Buffer.from(JSON.stringify({ payload, secret })).toString('base64url');
}

function verifySession(token, secret = '') {
  const raw = Buffer.from(token, 'base64url').toString('utf8');
  const parsed = JSON.parse(raw);
  if (parsed.secret !== secret) return null;
  return parsed.payload;
}

function requireRole(user, role) {
  return Boolean(user && (user.role === role || user.role === 'founder'));
}

module.exports = { mintSession, verifySession, requireRole };
