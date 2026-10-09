const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, imports) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, require: name => imports[name] || {}, Intl, Date, URL });
  return exports;
}
test('report list sends required dates and preserves server statistics', async () => {
  const calls = [];
  const result = { result: [], stats: { count: 3, comments_processed: 60, comments_positive: 40, comments_negative: 10 } };
  const api = { async get(url, config) { calls.push({ url, config }); return { data: result }; } };
  const { ReportService } = load('src/api/report.ts', { './api': api });
  assert.equal(await ReportService.getReports({ start_date: '2026-09-01', end_date: '2026-09-30' }), result);
  assert.equal(calls[0].url, '/v1/user/reports');
  assert.equal(calls[0].config.params.start_date, '2026-09-01');
  assert.equal(calls[0].config.params.end_date, '2026-09-30');
  await ReportService.getReports();
  assert.match(calls[1].config.params.start_date, /^\d{4}-\d{2}-01$/);
  assert.match(calls[1].config.params.end_date, /^\d{4}-\d{2}-\d{2}$/);
});
test('report mapping reads the current API comment field names', () => {
  const { toReportItem } = load('src/utils/reportMetrics.ts', {});
  const report = toReportItem({ id: 'r1', comments_processed: 20, comments_positive: 10, comments_negative: 5 });
  assert.equal(report.comments_count, 20);
  assert.equal(report.sentiment_positive, 50);
  assert.equal(report.sentiment_negative, 25);
});
test('OAuth status uses the dedicated route and preserves expiration details', async () => {
  const calls = [];
  const status = { connected: true, expired: false, expires_at: '2026-10-10T12:00:00Z' };
  const api = { async get(url) { calls.push(url); return { data: status }; } };
  const { YouTubeService } = load('src/api/youtube.ts', { './api': api });
  const [first, second] = await Promise.all([YouTubeService.checkConnection(), YouTubeService.checkConnection()]);
  assert.deepEqual(calls, ['/v1/oauth2/status']);
  assert.equal(first, status);
  assert.equal(second.expires_at, status.expires_at);
});
