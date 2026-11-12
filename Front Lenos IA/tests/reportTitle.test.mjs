import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReportTitle } from '../src/utils/reportTitle.ts';

test('accepts API title boundaries and rejects values outside them after trimming', () => {
  for (const value of ['', '  ', ' a ', 'a'.repeat(101)]) {
    assert.notEqual(validateReportTitle(value), '');
  }
  for (const value of ['ab', ' ab ', 'a'.repeat(100), '😀'.repeat(100)]) {
    assert.equal(validateReportTitle(value), '');
  }
});
