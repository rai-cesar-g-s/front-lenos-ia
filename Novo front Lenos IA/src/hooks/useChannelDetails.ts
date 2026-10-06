import { useEffect, useState } from 'react';
import api from '../api/api';

type ChannelAnswer = {
  question_id: string;
  question: string;
  answer_id: string;
  answer: string;
};

export const useChannelDetails = (enabled: boolean) => {
  const [answers, setAnswers] = useState<ChannelAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    // A API retorna a pergunta junto da resposta do usuário autenticado.
    void api.get<ChannelAnswer[]>('/v1/user/answers').then(({ data }) => {
      if (active) setAnswers(data);
    }).catch(() => {
      if (active) setError('Não foi possível carregar os detalhes do canal. Tente novamente.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [enabled, attempt]);

  const retry = () => {
    setError('');
    setLoading(true);
    setAttempt((current) => current + 1);
  };

  const updateAnswer = async (id: string, answer: string) => {
    const trimmed = answer.trim();
    if (!trimmed || trimmed.length > 50) throw new Error('A resposta deve ter entre 1 e 50 caracteres.');
    await api.put('/v1/user/answer/' + encodeURIComponent(id), { new_answer: trimmed });
    setAnswers(current => current.map(item => item.answer_id === id ? { ...item, answer: trimmed } : item));
  };

  return { answers, loading, error, retry, updateAnswer };
};
