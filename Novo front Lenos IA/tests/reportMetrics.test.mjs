import test from 'node:test';
import assert from 'node:assert/strict';
import { toReportItem, getReportTotals, getCommentPercentage } from '../src/utils/reportMetrics.ts';

// Fixtures verify the documented API fields; production never uses these values.
const response = (counts = {}, status = 'done') => ({
  id: 'report-id', title: 'Video', url: 'https://youtu.be/abcdefghijk', report: 'API analysis', status,
  comments_processed: 100, comments_positive: 70, comments_negative: 20, comments_neutral: 10, ...counts,
});

test('maps the documented API response into video counts and percentages', () => {
  const item = toReportItem(response());
  assert.equal(item.comments_count, 100);
  assert.equal(item.comments_positive, 70);
  assert.equal(item.comments_negative, 20);
  assert.equal(item.sentiment_positive, 70);
  assert.equal(item.sentiment_negative, 20);
  assert.equal(item.report, 'API analysis');
});

test('sums all completed reports and excludes pending and failed reports', () => {
  const reports = [response(), response({comments_processed: 20, comments_positive: 5, comments_negative: 10}, 'completed'), response({}, 'pending'), response({}, 'failed')];
  assert.deepEqual(getReportTotals(reports.map(toReportItem)), { analyses: 2, comments: 120, positive: 75, negative: 30, neutral: 20 });
});

test('empty accounts and videos with zero comments never receive fallback values', () => {
  assert.deepEqual(getReportTotals([]), { analyses: 0, comments: 0, positive: 0, negative: 0, neutral: 0 });
  const item = toReportItem(response({comments_processed: 0, comments_positive: 0, comments_negative: 0}));
  assert.equal(item.comments_count, 0);
  assert.equal(item.sentiment_positive, undefined);
  assert.equal(item.sentiment_negative, undefined);
});

test('missing or invalid metrics stay unavailable instead of becoming invented totals', () => {
  for (const value of [undefined, null, -1, NaN, Infinity, 1.5]) {
    const item = toReportItem(response({comments_processed: value}));
    assert.equal(item.comments_count, undefined);
    assert.equal(getReportTotals([item]).comments, undefined);
  }
  assert.equal(toReportItem(response({comments_positive: 101})).sentiment_positive, undefined);
});


test('global percentage divides summed positives by summed comments instead of averaging video percentages', () => {
  const reports = [response({comments_processed: 100, comments_positive: 90}),
    response({comments_processed: 900, comments_positive: 90})];
  const totals = getReportTotals(reports.map(toReportItem));
  assert.equal(totals.comments, 1000);
  assert.equal(totals.positive, 180);
  assert.equal(getCommentPercentage(totals.positive, totals.comments), 18);
  assert.equal(getCommentPercentage(0, 100), 0);
  assert.equal(getCommentPercentage(0, 0), undefined);
  assert.equal(getCommentPercentage(undefined, 100), undefined);
});

test('preserves recurring theme descriptions, API relevance and recommendation justifications', () => {
  const recurring_themes = [{theme:'Qualidade do conteúdo',description:'O público destaca a clareza.',percentage_relevance:35}];
  const recommendations = [{recommendation:'Aprofundar os exemplos',justification:'O público pede aplicações práticas.'}];
  const item = toReportItem(response({recurring_themes,recommendations}));
  assert.deepEqual(item.recurring_themes,recurring_themes);
  assert.deepEqual(item.recommendations,recommendations);
  assert.equal(item.recurring_themes[0].count,undefined);
});
test('missing or empty new fields do not produce invented insights', () => {
  for (const fields of [{},{recurring_themes:[],recommendations:[]},{recurring_themes:null,recommendations:null}]) {
    const item=toReportItem(response(fields));
    assert.deepEqual(item.recurring_themes,[]);
    assert.deepEqual(item.recommendations,[]);
  }
});
