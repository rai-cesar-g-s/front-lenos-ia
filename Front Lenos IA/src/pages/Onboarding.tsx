import ThemeToggle from '../components/ThemeToggle';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionService } from '../api/questions';
import { useAuth } from '../hooks/useAuth';
import { useQuestionnaire } from '../hooks/useQuestionnaire';
import './style/Onboarding.css';

const Onboarding = () => {
  const { questions, loading, error: loadError, retry } = useQuestionnaire();
  const { setHasAnsweredQuestions } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const submitting = useRef(false);
  const question = questions[current];
  // A lista contém apenas IDs sem resposta; cada avanço exige confirmação do backend.
  const complete = !loading && !loadError && current === questions.length;
  const validation = !answer.trim() || answer.trim().length > 20 ? 'A resposta deve ter entre 1 e 20 caracteres.' : '';

  const finish = () => {
    if (!complete) return;
    setHasAnsweredQuestions(true);
    navigate('/dashboard', { replace: true, state: { showGoogleWelcome: true } });
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting.current) return;
    if (complete) {
      finish();
      return;
    }
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
      }
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
    <header className="questionnaire-header"><img src="/logo.png" alt="Lenos IA" /><ThemeToggle /></header>
    <main className="questionnaire-main">
    <div className="questionnaire-heading"><span>Vamos conhecer seu canal</span><h1>Uma experiência feita para você</h1><p>Antes de começar, conte-nos um pouco sobre seu canal.</p></div>
    <section className="questionnaire-step" aria-label="Perguntas sobre seu canal">
      {loading ? <p role="status">Carregando perguntas...</p> : loadError ? <div role="alert"><p>{loadError}</p><button className="questionnaire-submit" onClick={() => { setCurrent(0); void retry(); }}>Tentar novamente</button></div> : <form onSubmit={submit} noValidate>
        {question ? <>
          <div className="questionnaire-step-count" aria-live="polite">Etapa {current + 1} de {questions.length}</div>
          <h2><label htmlFor="channel-answer">{question.question}</label></h2>
          <input id="channel-answer" type="text" minLength={1} maxLength={20} required className="questionnaire-input" value={answer} disabled={saving} onChange={(event) => { setAnswer(event.target.value); setTouched(true); setError(''); }} aria-invalid={touched && Boolean(validation)} aria-describedby={`channel-answer-help${touched && validation ? ' channel-answer-error' : ''}`} placeholder="Digite sua resposta" />
          <p id="channel-answer-help">Responda com entre 1 e 20 caracteres.</p>
          {touched && validation && <p id="channel-answer-error" className="questionnaire-error" role="alert">{validation}</p>}
        </> : complete && <p role="status">Todas as perguntas foram respondidas e suas respostas estão salvas. Clique em Concluir para acessar a dashboard.</p>}
        {!complete && error && <p className="questionnaire-error" role="alert">{error}</p>}
        <button className="questionnaire-submit" disabled={saving} type="submit">{saving ? 'Salvando...' : complete ? 'Concluir' : current + 1 === questions.length ? 'Salvar resposta' : 'Continuar'}</button>
      </form>}
    </section>
    <p className="questionnaire-note">Suas respostas são salvas a cada etapa.</p>
  </main></div>;
};
export default Onboarding;
