import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { QuestionService } from '../api/questions';

const Onboarding = () => {
    const [questions, setQuestions] = useState<Array<{ id: string | number; question: string }>>([]);
    const [current, setCurrent] = useState(0);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => { QuestionService.getAllQuestions().then((data) => setQuestions(QuestionService.normalizeQuestions(data))).catch(() => setError('Não foi possível carregar a pesquisa.')).finally(() => setLoading(false)); }, []);
    const question = questions[current];
    const next = async () => { if (!question || !answer.trim()) return; try { await QuestionService.answerQuestion({ question_id: String(question.id), answer }); setAnswer(''); setCurrent((index) => index + 1); } catch { setError('Não foi possível salvar sua resposta.'); } };
    return <AppShell><div className="onboarding-wrap"><div className="page-heading"><h1>Personalize sua experiência</h1><p>Conte-nos um pouco sobre você para receber insights mais relevantes.</p></div><section className="panel onboarding-card">{loading ? <div className="empty-state"><p>Carregando perguntas...</p></div> : error ? <div className="empty-state"><p>{error}</p></div> : !question ? <div className="empty-state"><p>Pesquisa concluída. Obrigado por responder.</p></div> : <><div className="onboarding-meta"><span>Etapa {current + 1} de {questions.length}</span><span>{Math.round(((current + 1) / questions.length) * 100)}%</span></div><div className="progress-line"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div><h2>{question.question}</h2><p>Isso nos ajuda a personalizar sua experiência.</p><input className="onboarding-input" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Digite sua resposta" /><button className="primary-action" onClick={next}>Continuar</button></>}</section></div></AppShell>;
};


export default Onboarding;