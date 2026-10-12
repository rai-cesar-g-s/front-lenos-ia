import { logSafeError } from '../utils/safeLogger';
import api from './api';

/**
 * Serviços relacionados a leitura e criação das perguntas da pesquisa de Onboarding.
 */
export const QuestionService = {
  
  async createQuestion(data: { description: string }) {
    try {
      const response = await api.post('/v1/question', data);
      return response.data;
    } catch (error) {
      logSafeError("QuestionService: Erro ao criar pergunta", error);
      throw error;
    }
  },

  async getUserQuestionsWithAnswers() {
    try {
      const response = await api.get('/v1/user/answers');
      return response.data;
    } catch (error) {
      logSafeError("QuestionService: Erro ao buscar questionário e respostas", error);
      throw error;
    }
  }

};
