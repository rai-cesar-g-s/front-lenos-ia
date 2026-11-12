import test from 'node:test';
import assert from 'node:assert/strict';
import { getSentimentStats, formatPercent } from '../src/utils/reportStats.ts';
import { toReportItem } from '../src/utils/reportMetrics.ts';

test('uses the backend neutral count even when it differs from the remainder', () => {
  const item = toReportItem({ comments_processed: 100, comments_positive: 60, comments_negative: 20, comments_neutral: 12 });
  assert.equal(item.comments_neutral, 12);
  assert.equal(item.sentiment_neutral, 12);
  const stats = getSentimentStats(item);
  assert.equal(stats.neutral, 12);
  assert.equal(stats.percent(stats.neutral), 12);
});

test('preserves zero neutral comments and leaves missing counts unavailable', () => {
  assert.equal(getSentimentStats({ comments_count: 10, comments_neutral: 0 }).neutral, 0);
  const stats = getSentimentStats({ comments_count: 10, comments_positive: 6, comments_negative: 2 });
  assert.equal(stats.neutral, undefined);
  assert.equal(formatPercent(stats.percent(stats.neutral)), '—');
  assert.equal(formatPercent(getSentimentStats({ comments_count: 0, comments_neutral: 0 }).percent(0)), '—');
});
