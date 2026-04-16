// insert into ae_branch_usage_events
// select * from ae_branch_smoke_reports
async function writeUsageEvent(event) { return { ok: true, event }; }
async function listUsageSummary() { return []; }
async function listAuditEvents() { return []; }
async function listSmokeReports() { return []; }
module.exports = { writeUsageEvent, listUsageSummary, listAuditEvents, listSmokeReports };
