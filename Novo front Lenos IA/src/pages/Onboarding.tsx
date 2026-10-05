import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionService } from '../api/questions';
import { useAuth } from '../hooks/useAuth';
import { useQuestionnaire } from '../hooks/useQuestionnaire';
import './style/Onboarding.css';

const Onboarding = () => {
  const { questions, loading, error: loadError, retry } = useQuestionnaire();
  const { reloadQuestionStatus } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const submitting = useRef(false);
  const question = questions[current];
  const validation = !answer.trim() ? 'Informe sua resposta para continuar.' : answer.trim().length > 50 ? 'A resposta deve ter no máximo 50 caracteres.' : '';

  const finish = async () => {
    setFinishing(true);
    try {
      if (!await reloadQuestionStatus()) {
        setError('As respostas enviadas estão salvas, mas ainda há perguntas pendentes. Recarregue as etapas para continuar.');
        return;
      }
      navigate('/dashboard', { replace: true, state: { showGoogleWelcome: true } });
    } catch {
      setError('Suas respostas foram salvas. Não foi possível verificar a conclusão do questionário. Clique em Concluir para tentar a verificação novamente.');
    } finally {
      setFinishing(false);
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    setTouched(true);
    if (question && validation) return;
    submitting.current = true;
    setSaving(true);
    setError('');
    try {
      if (question) {
        await QuestionService.saveAnswerForQuestion({ question_id: String(question.id), answer: answer.trim() });
        setAnswer('');
        setTouched(false);
        setCurrent((value) => value + 1);
        if (current + 1 < questions.length) return;
      }
      await finish();
    } catch (requestError: unknown) {
      const failure = requestError as { response?: { status?: number; data?: { message?: string; detail?: string } } };
      const response = failure.response?.data;
      const message = typeof response?.message === 'string' ? response.message : typeof response?.detail === 'string' ? response.detail : '';
      setError(failure.response?.status === 429
        ? 'O servidor limitou as requisições. Aguarde um momento antes de tentar novamente.'
        : failure.response?.status === 502
          ? 'O servidor retornou erro (502) e não foi possível confirmar a gravação desta resposta. O texto foi mantido no campo.'
          : message || 'Não foi possível confirmar a gravação desta resposta. O texto foi mantido no campo. Tente novamente.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return <div className="questionnaire-page">
    <header className="questionnaire-header"><img src="/logo.png" alt="Lenos IA" /></header>
    <main className="questionnaire-main">
    <div className="questionnaire-heading"><span>Vamos conhecer seu canal</span><h1>Uma experiência feita para você</h1><p>Antes de começar, conte-nos um pouco sobre seu canal.</p></div>
    <section className="questionnaire-step" aria-label="Perguntas sobre seu canal">
      {loading ? <p role="status">Carregando perguntas...</p> : loadError ? <div role="alert"><p>{loadError}</p><button className="questionnaire-submit" onClick={() => { setCurrent(0); void retry(); }}>Tentar novamente</button></div> : <form onSubmit={submit} noValidate>
        {question ? <>
          <div className="questionnaire-step-count" aria-live="polite">Etapa {current + 1} de {questions.length}</div>
          <h2><label htmlFor="channel-answer">{question.question}</label></h2>
          <input id="channel-answer" className="questionnaire-input" value={answer} disabled={saving} onChange={(event) => { setAnswer(event.target.value); setTouched(true); setError(''); }} aria-invalid={touched && Boolean(validation)} aria-describedby={`channel-answer-help${touched && validation ? ' channel-answer-error' : ''}`} placeholder="Digite sua resposta" />
          <p id="channel-answer-help">Responda em até 50 caracteres.</p>
          {touched && validation && <p id="channel-answer-error" className="questionnaire-error" role="alert">{validation}</p>}
        </> : <p>Suas respostas foram salvas. Continue para acessar a dashboard.</p>}
        {error && <p className="questionnaire-error" role="alert">{error}</p>}
        <button className="questionnaire-submit" disabled={saving} type="submit">{finishing ? 'Verificando conclusão...' : saving ? 'Salvando...' : !question || current + 1 === questions.length ? 'Concluir' : 'Continuar'}</button>
      </form>}
    </section>
    <p className="questionnaire-note">Suas respostas são salvas a cada etapa.</p>
  </main></div>;
};
export default Onboarding;
