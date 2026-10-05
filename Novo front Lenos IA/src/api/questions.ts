import api from './api';

type AnswerQuestionProps = {
  question_id: string;
  answer: string;
};

type UpdateQuestionProps = {
  answer_id: string;
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

let questionsRequest: Promise<unknown> | null = null;
let questionsCache: { data: unknown; expiresAt: number } | null = null;

export const QuestionService = {
  async saveAnswerForQuestion(data: AnswerQuestionProps) {
    const answers = await this.getUserQuestions() as Array<{ question_id: string; answer_id: string; answer: string }>;
    const existing = answers.find((item) => item.question_id === data.question_id);
    if (existing?.answer === data.answer) return existing;
    // Uma resposta existente só pode ser atualizada para a mesma pergunta.
    try {
      if (existing) {
        if (!existing.answer_id) throw new Error('Não foi possível identificar a resposta desta pergunta.');
        return await this.updateAnswer({ answer_id: existing.answer_id, new_answer: data.answer });
      }
      return await this.answerQuestion(data);
    } catch (writeError) {
      // O servidor pode gravar e falhar ao devolver a resposta; confirme o conteúdo antes de reenviar.
      try {
        const persisted = await this.getUserQuestions() as Array<{ question_id: string; answer: string }>;
        const confirmed = persisted.find((item) => item.question_id === data.question_id && item.answer === data.answer);
        if (confirmed) return confirmed;
      } catch {
        // Sem confirmação, preserve o erro e o texto preenchido pelo usuário.
      }
      throw writeError;
    }
  },
  async getPendingQuestions() {
    const answers = this.normalizeQuestions(await this.getUserQuestions());
    const questions = this.normalizeQuestions(await this.getAllQuestions());
    if (!questions.length) throw new Error('Não há perguntas disponíveis.');
    return questions.filter((question) => !answers.some((answer) =>
      String(answer.id) === String(question.id) && answer.answer.trim().length > 0,
    ));
  },
  // Puxa as perguntas do backend para o usuario preencher e as respostas já existentes se houver
  async getUserQuestions() {
    try {
      const response = await api.get('/v1/user/answers');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perguntas do usuário", error);
      throw error;
    }
  },

  // Busca todas as perguntas cadastradas no sistema (vazias)
  async getAllQuestions() {
    if (questionsCache && questionsCache.expiresAt > Date.now()) return questionsCache.data;
    if (!questionsRequest) {
      questionsRequest = api.get('/v1/questions').then((response) => {
        questionsCache = { data: response.data, expiresAt: Date.now() + 60_000 };
        return response.data;
      }).finally(() => { questionsRequest = null; });
    }
    return questionsRequest;
  },

  // Responde uma pergunta
  async answerQuestion(data:AnswerQuestionProps) {
    try {
      const response = await api.post('/v1/user/answer', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao responder a pergunta", error);
      throw error;
    }
  },

  // Atualiza uma resposta que já foi dada
  async updateAnswer(data:UpdateQuestionProps) {
    try {
      const response = await api.put(`/v1/user/answer/${encodeURIComponent(data.answer_id)}`, { new_answer: data.new_answer });
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
      .map((item) => {
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
          (typeof typedItem.description === 'string' ? typedItem.description : '') ||
          typedItem.questionText ||
          typedItem.question_text ||
          (typeof typedItem.question === 'string' ? typedItem.question : '') ||
          typedItem.pergunta ||
          (typeof questionObject?.text === 'string' ? questionObject.text : '') ||
          (typeof questionObject?.description === 'string' ? questionObject.description : '') ||
          (typeof questionObject?.question === 'string' ? questionObject.question : '') ||
          (typeof questionObject?.pergunta === 'string' ? questionObject.pergunta : '') ||
          '';

        if (!prompt) {
          return null;
        }

        const resolvedId =
          typedItem.question_id ??
          typedItem.questionId ??
          typedItem.idQuestion ??
          (typeof questionObject?.id === 'string' || typeof questionObject?.id === 'number'
            ? questionObject.id
            : typedItem.id);

        if (typeof resolvedId !== 'string' && typeof resolvedId !== 'number') {
          throw new Error('Pergunta sem identificador retornada pela API.');
        }

        return {
          id: resolvedId,
          question: prompt,
          answer: typeof rawAnswer === 'string' ? rawAnswer : '',
          hasAnswer: hasAnswerField && rawAnswer !== null && rawAnswer !== undefined,
        } satisfies NormalizedQuestion;
      })
      .filter((item): item is NormalizedQuestion => item !== null);
  }
};
