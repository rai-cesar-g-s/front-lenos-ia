import api from './api';

type AnswerQuestionProps = {
  question_id: string;
  answer: string;
};

type UpdateQuestionProps = {
  new_answer: string;
};

type QuestionItem = {
  id?: string | number;
  questionId?: string | number;
  question_id?: string | number;
  idQuestion?: string | number;
  questionText?: string;
  question_text?: string;
  question?: string | Record<string, unknown>;
  pergunta?: string;
  answer?: string;
  resposta?: string;
  response?: string;
  [key: string]: unknown;
};

type NormalizedQuestion = {
  id: string | number;
  question: string;
  answer: string;
  hasAnswer: boolean;
};

export const QuestionService = {
  // Puxa as perguntas do backend para o usuario preencher e as respostas já existentes se houver
  async getUserQuestions() {
    try {
      const response = await api.get('/v1/user/answers_questions');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perguntas do usuário", error);
      throw error;
    }
  },

  // Busca todas as perguntas cadastradas no sistema (vazias)
  async getAllQuestions() {
    try {
      const response = await api.get('/v1/questions');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perguntas gerais", error);
      throw error;
    }
  },

  // Responde uma pergunta
  async answerQuestion(data:AnswerQuestionProps) {
    try {
      const response = await api.post('/v1/user/answer_question', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao responder a pergunta", error);
      throw error;
    }
  },

  // Atualiza uma resposta que já foi dada
  async updateAnswer(data:UpdateQuestionProps) {
    try {
      const response = await api.put('/v1/user/update_answer', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar a resposta", error);
      throw error;
    }
  },

  normalizeQuestions(data: unknown): NormalizedQuestion[] {
    const source: unknown[] = Array.isArray(data)
      ? data as unknown[]
      : Array.isArray((data as { questions?: unknown[] } | undefined)?.questions)
        ? (data as { questions: unknown[] }).questions
        : Array.isArray((data as { data?: unknown[] } | undefined)?.data)
          ? (data as { data: unknown[] }).data
          : [];

    return source
      .map((item, index) => {
        const typedItem = item as QuestionItem | null;
        if (!typedItem) return null;

        const questionObject = typedItem.question && typeof typedItem.question === 'object'
          ? typedItem.question as Record<string, unknown>
          : null;

        const hasAnswerField =
          Object.prototype.hasOwnProperty.call(typedItem, 'answer') ||
          Object.prototype.hasOwnProperty.call(typedItem, 'resposta') ||
          Object.prototype.hasOwnProperty.call(typedItem, 'response');

        const rawAnswer = typedItem.answer ?? typedItem.resposta ?? typedItem.response;
        const prompt =
          typedItem.questionText ||
          typedItem.question_text ||
          (typeof typedItem.question === 'string' ? typedItem.question : '') ||
          typedItem.pergunta ||
          (typeof questionObject?.text === 'string' ? questionObject.text : '') ||
          (typeof questionObject?.question === 'string' ? questionObject.question : '') ||
          (typeof questionObject?.pergunta === 'string' ? questionObject.pergunta : '') ||
          '';

        if (!prompt) {
          return null;
        }

        const resolvedId =
          typedItem.id ??
          typedItem.questionId ??
          typedItem.question_id ??
          typedItem.idQuestion ??
          (typeof questionObject?.id === 'string' || typeof questionObject?.id === 'number'
            ? questionObject.id
            : index);

        return {
          id: typeof resolvedId === 'string' || typeof resolvedId === 'number' ? resolvedId : index,
          question: prompt,
          answer: typeof rawAnswer === 'string' ? rawAnswer : '',
          hasAnswer: hasAnswerField && rawAnswer !== null && rawAnswer !== undefined,
        } satisfies NormalizedQuestion;
      })
      .filter((item): item is NormalizedQuestion => item !== null);
  }
};
