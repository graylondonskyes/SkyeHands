const { listRecords } = require('./_shared/ae_runtime_db');
const { listSmokeReports, writeUsageEvent } = require('./_shared/ae_state');

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

module.exports.handler = async () => {
  const tasks = listRecords('tasks');
  const clients = listRecords('clients');
  const smokeReports = await listSmokeReports(10);
  const latestSmoke = smokeReports[0] || null;

  const health = {
    ok: true,
    service: 'ae-brain-health',
    checkedAt: new Date().toISOString(),
    dataShape: {
      clientCount: clients.length,
      taskCount: tasks.length,
      latestSmokeStatus: latestSmoke?.status || 'unknown'
    }
  };

  await writeUsageEvent({ route: 'ae-brain-health', action: 'health_check', detail: health.dataShape });
  return json(200, health);
};
