import api from './api';

/**
 * Serviços relacionados a leitura e criação das perguntas da pesquisa de Onboarding.
 */
export const QuestionService = {
  
  async createQuestion(data: Record<string, unknown>) {
    try {
      const response = await api.post('/v1/create-question', data);
      return response.data;
    } catch (error) {
      console.error("QuestionService: Erro ao criar pergunta", error);
      throw error;
    }
  },

  async getUserQuestionsWithAnswers() {
    try {
      const response = await api.get('/v1/user/answers-questions');
      return response.data;
    } catch (error) {
      console.error("QuestionService: Erro ao buscar questionário e respostas", error);
      throw error;
    }
  }

};
