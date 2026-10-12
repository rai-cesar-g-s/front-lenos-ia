import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { getReportStatus, reportFilterOptions } from '../src/utils/reportStatus.ts';
test('fixed Portuguese options send only enum values documented by the API', () => {
  assert.deepEqual(reportFilterOptions.map(option => option.value), ['done', 'pending', 'failed']);
  assert.deepEqual(reportFilterOptions.map(option => option.label), ['Concluídas', 'Pendentes', 'Falhas']);
});
test('list request sends status to the backend together with the date range; all omits status', async () => {
  const calls = [];
  const api = { get: async (...args) => { calls.push(args); return {data:{result:[],stats:{count:0}}}; } };
  const code = ts.transpileModule(fs.readFileSync(new URL('../src/api/report.ts', import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const module = {exports:{}};
  new Function('require','module','exports',code)(name => name === './api' ? {__esModule:true,default:api} : {},module,module.exports);
  const range={start_date:'2026-10-01',end_date:'2026-10-11'};
  for (const option of reportFilterOptions) await module.exports.ReportService.getReports(range,option.value);
  await module.exports.ReportService.getReports(range);
  assert.deepEqual(calls.map(call => call[1].params), [...reportFilterOptions.map(option=>({...range,status:option.value})),range]);
  assert.ok(calls.every(call => call[0] === '/v1/user/reports'));
});
test('known statuses have readable labels', () => {
  assert.equal(getReportStatus('done')[0], 'Concluído');
});
