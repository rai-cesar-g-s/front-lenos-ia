import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { validateNewEmail, emailChangeError } from '../src/utils/emailChange.ts';

function service() {
  const calls = [];
  const api = { post: async (...args) => { calls.push(args); return { data: { message: 'OK' } }; } };
  const code = ts.transpileModule(fs.readFileSync(new URL('../src/api/user.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => name === './api' ? { __esModule: true, default: api } : {}, module, module.exports);
  return { service: module.exports.UserService, calls };
}
test('email change uses the documented payload and confirmation query', async () => {
  const { service: user, calls } = service();
  await user.requestEmailChange('  novo@example.com  ');
  await user.confirmEmailChange('token+with&characters');
  assert.deepEqual(calls, [
    ['/v1/user/email', { new_email: 'novo@example.com' }],
    ['/v1/user/confirm-email', null, { params: { token: 'token+with&characters' } }],
  ]);
});
test('rejects empty, invalid and unchanged email addresses', () => {
  for (const email of ['', 'sem-arroba', 'atual@example.com', ' ATUAL@example.com ']) assert.notEqual(validateNewEmail(email, 'atual@example.com'), '');
  assert.equal(validateNewEmail('novo@example.com', 'atual@example.com'), '');
});
test('email change enforces the same 200-character limit as registration', () => {
  const atLimit = 'a'.repeat(188) + '@example.com';
  assert.equal(atLimit.length, 200);
  assert.equal(validateNewEmail(atLimit, 'atual@example.com'), '');
  assert.match(validateNewEmail('a' + atLimit, 'atual@example.com'), /200 caracteres/);
});
test('confirmation errors are actionable and never expose server details', () => {
  assert.match(emailChangeError({ response: { status: 400 } }, true), /inválido ou expirou/);
  assert.match(emailChangeError({ response: { status: 403 } }, true), /conta que solicitou/);
  assert.match(emailChangeError({ response: { status: 429 } }), /Aguarde/);
  assert.doesNotMatch(emailChangeError({ response: { status: 502, data: { detail: 'token abc SQL 123' } } }, true), /abc|SQL|123/);
});
