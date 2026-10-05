const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadModule(file, imports, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => imports[name] || { logSafeError() {} }, console: { error() {} }, ...globals });
  return exports;
}
function service(answers, questions = [{ id: 'q1', description: 'Qual seu nicho?' }, { id: 'q2', description: 'Qual seu objetivo?' }]) {
  const calls = [];
  const api = {
    async get(path) {
      calls.push(path);
      if (answers instanceof Error) throw answers;
      return { data: path === '/v1/user/answers' ? answers : questions };
    },
    async post(path, data) { calls.push({ path, data }); return { data }; },
  };
  return { calls, questions: loadModule('src/api/questions.ts', { './api': api }).QuestionService };
}

test('usuário sem respostas recebe todas as perguntas pelas rotas documentadas', async () => {
  const { questions, calls } = service([]);
  const pending = await questions.getPendingQuestions();
  assert.deepEqual(Array.from(pending, (item) => item.id), ['q1', 'q2']);
  assert.deepEqual(calls, ['/v1/user/answers', '/v1/questions']);
});
test('retoma somente perguntas pendentes após respostas parciais', async () => {
  const { questions } = service([{ question_id: 'q1', question: 'Qual seu nicho?', answer_id: 'a1', answer: 'Tecnologia' }]);
  assert.deepEqual(Array.from(await questions.getPendingQuestions(), (item) => item.id), ['q2']);
});
test('questionário completo libera o fluxo; resposta em branco permanece pendente', async () => {
  const answers = [
    { question_id: 'q1', question: 'Qual seu nicho?', answer: 'Tecnologia' },
    { question_id: 'q2', question: 'Qual seu objetivo?', answer: 'Crescer' },
  ];
  assert.equal((await service(answers).questions.getPendingQuestions()).length, 0);
  answers[1].answer = '   ';
  assert.equal((await service(answers).questions.getPendingQuestions()).length, 1);
});
test('falha da API e ausência de perguntas não são consideradas conclusão', async () => {
  await assert.rejects(service(new Error('API offline')).questions.getPendingQuestions(), /API offline/);
  await assert.rejects(service([], []).questions.getPendingQuestions(), /perguntas/);
});
test('envia a resposta ao endpoint documentado', async () => {
  const { questions, calls } = service([]);
  await questions.answerQuestion({ question_id: 'q1', answer: 'Tecnologia' });
  assert.equal(calls[0].path, '/v1/user/answer');
  assert.equal(calls[0].data.question_id, 'q1');
  assert.equal(calls[0].data.answer, 'Tecnologia');
});
test('conexão Google navega para OAuth do backend', async () => {
  let destination;
  const { triggerGoogleAuth } = loadModule('src/utils/googleAuth.ts', {
    '../api/user': { UserService: { getOAuth2LoginUrl: () => 'https://api.lenos-ia.com.br/v1/oauth2/login' } },
  }, { window: { location: { assign(url) { destination = url; } } } });
  assert.equal((await triggerGoogleAuth()).success, true);
  assert.equal(destination, 'https://api.lenos-ia.com.br/v1/oauth2/login');
});

test('respostas consecutivas permanecem vinculadas a perguntas distintas', async () => {
  const { questions, calls } = service([]);
  await questions.saveAnswerForQuestion({ question_id: 'q1', answer: 'Tecnologia' });
  await questions.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' });
  const posts = calls.filter((call) => typeof call === 'object');
  assert.deepEqual(posts.map((call) => call.data.question_id), ['q1', 'q2']);
  assert.deepEqual(posts.map((call) => call.data.answer), ['Tecnologia', '1000']);
});
test('resposta de outra pergunta não é reutilizada para enviar a próxima', async () => {
  const { questions, calls } = service([{ question_id: 'q1', answer_id: 'a1', question: 'Nicho?', answer: 'Tecnologia' }]);
  await questions.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' });
  const post = calls.find((call) => typeof call === 'object');
  assert.equal(post.path, '/v1/user/answer');
  assert.equal(post.data.question_id, 'q2');
});
test('reenvio atualiza exclusivamente a resposta da mesma pergunta', async () => {
  let update;
  const api = {
    async get() { return { data: [{ question_id: 'q1', answer_id: 'a1' }, { question_id: 'q2', answer_id: 'a2' }] }; },
    async put(path, data) { update = { path, data }; return { data }; },
    async post() { throw new Error('Não deve criar outra resposta'); },
  };
  const { QuestionService } = loadModule('src/api/questions.ts', { './api': api });
  await QuestionService.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' });
  assert.equal(update.path, '/v1/user/answer/a2');
  assert.equal(update.data.new_answer, '1000');
});
test('pergunta sem ID não usa o índice da lista como identificador', () => {
  assert.throws(() => service([]).questions.normalizeQuestions([{ description: 'Qual seu nicho?' }]), /identificador/);
});

test('consultas simultâneas e repetidas reutilizam a lista de perguntas', async () => {
  const { questions, calls } = service([]);
  await Promise.all([questions.getAllQuestions(), questions.getAllQuestions()]);
  await questions.getAllQuestions();
  assert.equal(calls.filter((path) => path === '/v1/questions').length, 1);
});

test('erro após gravar é confirmado por pergunta e conteúdo exatos', async () => {
  let stored = [];
  const api = {
    async get() { return { data: stored }; },
    async post(path, data) {
      stored = [{ question_id: data.question_id, answer: data.answer }];
      throw new Error('502 após commit');
    },
  };
  const { QuestionService } = loadModule('src/api/questions.ts', { './api': api });
  const saved = await QuestionService.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' });
  assert.equal(saved.question_id, 'q2');
  assert.equal(saved.answer, '1000');
});
test('resposta de outra pergunta ou conteúdo diferente não confirma gravação', async () => {
  for (const persisted of [{ question_id: 'q1', answer: '1000' }, { question_id: 'q2', answer: '999' }]) {
    let reads = 0;
    const api = {
      async get() { return { data: reads++ ? [persisted] : [] }; },
      async post() { throw new Error('Falha no envio'); },
    };
    const { QuestionService } = loadModule('src/api/questions.ts', { './api': api });
    await assert.rejects(QuestionService.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' }), /Falha no envio/);
  }
});
test('resposta já confirmada não é reenviada', async () => {
  const api = {
    async get() { return { data: [{ question_id: 'q2', answer_id: 'a2', answer: '1000' }] }; },
    async post() { throw new Error('Reenvio indevido'); },
    async put() { throw new Error('Atualização indevida'); },
  };
  const { QuestionService } = loadModule('src/api/questions.ts', { './api': api });
  assert.equal((await QuestionService.saveAnswerForQuestion({ question_id: 'q2', answer: '1000' })).answer, '1000');
});

test('YouTube conectado exige confirmação explícita do backend', async () => {
  const api = { async get(path, options) {
    assert.equal(path, '/v1/oauth2/login');
    assert.equal(options.fetchOptions.redirect, 'manual');
    throw { response: { status: 400, data: { message: 'Conta Youtube já conectada' } } };
  } };
  const { YouTubeService } = loadModule('src/api/youtube.ts', { './api': api });
  assert.equal(await YouTubeService.checkConnection(), 'connected');
});
test('redirecionamento opaco não é tratado como conexão confirmada', async () => {
  const api = { async get() { throw { response: { status: 0 } }; } };
  const { YouTubeService } = loadModule('src/api/youtube.ts', { './api': api });
  assert.equal(await YouTubeService.checkConnection(), 'unconfirmed');
});
test('falha de permissão não confirma conexão YouTube', async () => {
  const api = { async get() { throw { response: { status: 403, data: { message: 'Sem permissão' } } }; } };
  const { YouTubeService } = loadModule('src/api/youtube.ts', { './api': api });
  await assert.rejects(YouTubeService.checkConnection());
});
test('requisições paralelas de conexão compartilham uma consulta', async () => {
  let calls = 0;
  const api = { async get() { calls++; return { data: {} }; } };
  const { YouTubeService } = loadModule('src/api/youtube.ts', { './api': api });
  await Promise.all([YouTubeService.checkConnection(), YouTubeService.checkConnection()]);
  assert.equal(calls, 1);
});
test('401 renova a sessão uma única vez para requisições paralelas', async () => {
  let rejection;
  let refreshes = 0;
  let retries = 0;
  const api = {
    interceptors: { response: { use(ok, fail) { rejection = fail; } } },
    async post(path) { assert.equal(path, '/v1/user/refresh'); refreshes++; },
    async request(config) { assert.equal(config.sessionRetried, true); retries++; return { status: 200 }; },
  };
  const source = fs.readFileSync('src/api/api.ts', 'utf8').replaceAll('import.meta.env', '({})');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports: {}, require: (name) => name === './config' ? { API_BASE_URL: 'https://api.example.test' } : { create: () => api }, localStorage: { removeItem() {} }, window: { dispatchEvent() {} }, Event: class {} });
  await Promise.all([
    rejection({ response: { status: 401 }, config: { url: '/v1/user/reports' } }),
    rejection({ response: { status: 401 }, config: { url: '/v1/user/answers' } }),
  ]);
  assert.equal(refreshes, 1);
  assert.equal(retries, 2);
});


test('logs não incluem senhas, tokens ou dados do erro Axios', () => {
  let logged;
  const { logSafeError } = loadModule('src/utils/safeLogger.ts', {}, { console: { error(...args) { logged = args; } } });
  logSafeError('Falha no login', { response: { status: 401, data: { token: 'secret-token' } }, config: { data: '{"password":"secret-password"}' } });
  const output = JSON.stringify(logged);
  assert.equal(output.includes('secret-token'), false);
  assert.equal(output.includes('secret-password'), false);
  assert.equal(output.includes('401'), true);
});
test('configuração exige env, HTTPS e URL sem credenciais', () => {
  const source = fs.readFileSync('src/api/config.ts', 'utf8');
  const evaluate = (url) => {
    const code = ts.transpileModule(source.replaceAll('import.meta.env', 'frontendEnv'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    vm.runInNewContext(code, { exports, URL, frontendEnv: { VITE_API_URL: url } });
    return exports.API_BASE_URL;
  };
  assert.throws(() => evaluate(undefined), /VITE_API_URL/);
  assert.throws(() => evaluate('http://api.example.test'), /HTTPS/);
  assert.throws(() => evaluate('https://user:password@api.example.test'), /credenciais/);
  assert.equal(evaluate('http://localhost:8000/'), 'http://localhost:8000');
  assert.equal(evaluate('https://api.example.test/'), 'https://api.example.test');
});

function renderQuestionnaire(pending, overrides = {}) {
  let hookIndex = 0;
  const values = [0, '1000', false, '', false];
  const updates = [];
  const navigations = [];
  const completions = [];
  const saves = [];
  const React = {
    useState(initial) {
      const index = hookIndex++;
      return [values[index] ?? initial, (value) => updates.push({ index, value })];
    },
    useRef: (value) => ({ current: value }),
  };
  const jsx = (type, props) => ({ type, props });
  const source = fs.readFileSync('src/pages/Onboarding.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const imports = {
    react: React,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'react-router-dom': { useNavigate: () => (...args) => navigations.push(args) },
    '../api/questions': { QuestionService: { saveAnswerForQuestion: async (data) => { saves.push(data); if (overrides.failSave) throw new Error('Save failed'); } } },
    '../hooks/useAuth': { useAuth: () => ({ setHasAnsweredQuestions: (value) => completions.push(value), reloadQuestionStatus() { throw new Error('Extra verification must not run'); } }) },
    '../hooks/useQuestionnaire': { useQuestionnaire: () => ({ questions: pending, loading: false, error: '', retry() {} }) },
    './style/Onboarding.css': {},
  };
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => imports[name] });
  const tree = exports.default();
  const find = (element, type) => {
    if (!element || typeof element !== 'object') return undefined;
    if (element.type === type) return element;
    for (const child of [element.props?.children].flat(Infinity)) {
      const result = find(child, type);
      if (result) return result;
    }
  };
  return { tree, form: find(tree, 'form'), updates, saves, navigations, completions };
}
test('última resposta salva exibe conclusão sem verificar nem navegar automaticamente', async () => {
  const view = renderQuestionnaire([{ id: 'q3', question: 'Quantos inscritos?' }]);
  await view.form.props.onSubmit({ preventDefault() {} });
  assert.equal(view.saves[0].question_id, 'q3');
  assert.equal(view.navigations.length, 0);
  assert.equal(view.completions.length, 0);
  assert.equal(view.updates.find((update) => update.index === 0).value(0), 1);
  assert.equal(view.updates.some((update) => update.index === 3 && update.value), false);
});
test('todas as perguntas confirmadas mostram sucesso; Concluir libera dashboard sem outra consulta', async () => {
  const view = renderQuestionnaire([]);
  assert.equal(JSON.stringify(view.tree).includes('Todas as perguntas foram respondidas'), true);
  assert.equal(JSON.stringify(view.tree).includes('questionnaire-error'), false);
  assert.equal(view.navigations.length, 0);
  await view.form.props.onSubmit({ preventDefault() {} });
  assert.deepEqual(view.completions, [true]);
  assert.equal(view.navigations[0][0], '/dashboard');
  assert.equal(view.saves.length, 0);
});
test('falha real ao salvar não avança nem libera a dashboard', async () => {
  const view = renderQuestionnaire([{ id: 'q3', question: 'Quantos inscritos?' }], { failSave: true });
  await view.form.props.onSubmit({ preventDefault() {} });
  assert.equal(view.updates.some((update) => update.index === 0), false);
  assert.equal(view.completions.length, 0);
  assert.equal(view.navigations.length, 0);
});
