import { logSafeError } from '../utils/safeLogger';
import api from "./api";

type AnswerQuestionsProps = {
    question_id: string;
    answer: string;
}

type UpdateAnswerProps = {
    answer_id: string;
    new_answer: string;
}

// Serviços relacionados às respostas dos questionários enviadas pelos usuários.

export const AnswerService = {

    async answerQuestions(data: AnswerQuestionsProps) {
        try {
            const response = await api.post('/v1/user/answer', data);
            return response.data;
        }
        catch (error) {
            logSafeError("AnswerService: Erro ao submeter resposta", error);
            throw error;
        }
    },

    async updateAnswer(data: UpdateAnswerProps) {
        try {
            const response = await api.put(`/v1/user/answer/${encodeURIComponent(data.answer_id)}`, { new_answer: data.new_answer });
            return response.data;
        }
        catch (error) {
            logSafeError("AnswerService: Erro ao atualizar resposta", error);
            throw error;
        }
    }
};
