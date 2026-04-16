const { listSmokeReports } = require('./_shared/ae_state');

module.exports.handler = async () => ({
  statusCode: 200,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ ok: true, reports: await listSmokeReports() })
});
