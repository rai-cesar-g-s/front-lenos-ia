import { useEffect, useState } from 'react';
import { QuestionService } from '../api/questions';

type Question = { id: string | number; question: string };
export const useQuestionnaire = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void QuestionService.getPendingQuestions().then((pending) => {
      if (active) setQuestions(pending);
    }).catch(() => {
      if (active) setError('Não foi possível carregar as perguntas e suas respostas. Tente novamente.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);
  const retry = () => {
    setLoading(true);
    setError('');
    setAttempt((value) => value + 1);
  };
  return { questions, loading, error, retry };
};
