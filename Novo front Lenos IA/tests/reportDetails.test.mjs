import test from 'node:test';
import assert from 'node:assert/strict';
import { completeReportDetails } from '../src/utils/reportDetails.ts';
import { toReportItem } from '../src/utils/reportMetrics.ts';
const report = { id: 'id', title: 'Video', status: 'done', comments_processed: 13, comments_positive: 9, comments_negative: 1 };
const timestamp = '2026-10-06T00:54:51.712806+00:00';
test('fetches missing creation date even when all comment counts are present and preserves it in the modal model', async () => {
  let calls = 0;
  const result = await completeReportDetails(report, async id => { assert.equal(id, report.id); calls++; return { ...report, created_at: timestamp }; });
  assert.equal(calls, 1);
  assert.equal(toReportItem(result).created_at, timestamp);
  assert.equal(new Date(result.created_at).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}), '05/10/2026, 21:54');
});
test('does not request details when list already provides date and counts', async () => {
  const full = { ...report, created_at: timestamp };
  assert.equal(await completeReportDetails(full, async () => { throw Error('Unexpected request'); }), full);
});
test('refreshes invalid timestamps from report details', async () => {
  const result = await completeReportDetails({ ...report, created_at: 'invalid' }, async () => ({ ...report, created_at: timestamp }));
  assert.equal(result.created_at, timestamp);
});
