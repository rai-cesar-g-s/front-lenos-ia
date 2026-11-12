import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword, validatePasswordConfirmation } from '../src/utils/passwordValidation.ts';
test('shared password validation accepts only lengths from 8 through 20', () => {
  for (const length of [0, 1, 7, 21, 30]) assert.notEqual(validatePassword('a'.repeat(length)), '');
  for (const length of [8, 12, 20]) assert.equal(validatePassword('a'.repeat(length)), '');
});
test('password confirmation must be present and match exactly', () => {
  assert.notEqual(validatePasswordConfirmation('password123', ''), '');
  assert.notEqual(validatePasswordConfirmation('password123', 'Password123'), '');
  assert.equal(validatePasswordConfirmation('password123', 'password123'), '');
});
