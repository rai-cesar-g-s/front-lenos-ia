import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import axios from 'axios';

function client() {
  const code = ts.transpileModule(fs.readFileSync(new URL('../src/api/api.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const events = [], removed = [];
  const module = { exports: {} };
  new Function('require', 'module', 'exports', 'localStorage', 'window', code)(
    name => name === 'axios' ? axios : { API_BASE_URL: 'https://example.test' }, module, module.exports,
    { removeItem: key => removed.push(key) }, { dispatchEvent: event => events.push(event.type) }
  );
  return { api: module.exports.default, events, removed };
}
test('incorrect current password is rejected once without refreshing or logging out', async () => {
  const { api, events, removed } = client();
  const calls = [];
  api.defaults.adapter = async config => {
    calls.push(config.url);
    throw new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, { status: 401, data: {detail:'Invalid credentials'}, config });
  };
  await assert.rejects(api.put('/v1/user/password', {current_password:'incorrect', new_password:'new-password'}));
  assert.deepEqual(calls, ['/v1/user/password']);
  assert.deepEqual(events, []);
  assert.deepEqual(removed, []);
});
test('successful password update does not clear local authentication', async () => {
  const { api, events, removed } = client();
  api.defaults.adapter = async config => ({status:204, data:undefined, config, headers:{}});
  assert.equal((await api.put('/v1/user/password', {current_password:'current',new_password:'new-password'})).status, 204);
  assert.deepEqual(events, []);
  assert.deepEqual(removed, []);
});
