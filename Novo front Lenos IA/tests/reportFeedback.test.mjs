import test from 'node:test';
import assert from 'node:assert/strict';
import { getReportErrorMessage, quotaReachedMessage } from '../src/utils/reportFeedback.ts';
const error = (status, detail) => ({ response: { status, data: { detail } } });
const quota = remaining => ({ used: 5 - remaining, limit: 5, remaining, comments_processed: 100 });

test('explains ownership and duplicate errors without exposing video identifiers', () => {
  const ownership = getReportErrorMessage(error(403, 'Vídeo ID rdmTD03M-VQ não pertence ao seu canal'));
  assert.match(ownership, /canal conectado/);
  assert.doesNotMatch(ownership, /rdmTD03M-VQ|ID/);
  const duplicate = getReportErrorMessage(error(400, 'Relatório do vídeo ID: atfv94Sw6LM já gerado'));
  assert.match(duplicate, /Histórico/);
  assert.doesNotMatch(duplicate, /atfv94Sw6LM|ID/);
});
test('only confirms exhausted quota when the fresh quota response agrees', () => {
  const failure = error(400, 'Limite de 5 relatórios mensais atingido');
  assert.equal(getReportErrorMessage(failure, quota(0)), quotaReachedMessage);
  for (const value of [quota(2), null]) {
    assert.notEqual(getReportErrorMessage(failure, value), quotaReachedMessage);
    assert.doesNotMatch(getReportErrorMessage(failure, value), /5|atingid|utilizou todas/);
  }
  assert.notEqual(getReportErrorMessage(error(429, 'Limite de requisição'), quota(0)), quotaReachedMessage);
});
test('unknown and structured errors never leak technical response contents', () => {
  for (const detail of ['SQL error: user_id=abc code 123', [{loc: ['body', 'video_url'], msg: 'invalid'}], null]) {
    assert.doesNotMatch(getReportErrorMessage(error(400, detail)), /SQL|user_id|abc|123|video_url|loc/);
  }
  assert.match(getReportErrorMessage(null), /conexão/);
  assert.match(getReportErrorMessage(error(500, 'Traceback: secret')), /alguns instantes/);
});
test('provides recovery instructions for other documented failures', () => {
  assert.match(getReportErrorMessage(error(400, 'Conta Youtube não conectada')), /reconecte/);
  assert.match(getReportErrorMessage(error(400, 'URL vídeo inválida')), /endereço do vídeo/);
  assert.match(getReportErrorMessage(error(404, 'Vídeo não encontrado')), /encontrar esse vídeo/);
  assert.match(getReportErrorMessage(error(401, 'token expired')), /Entre novamente/);
});
