import api from "./api";

type AnswerQuestionsProps = {
    questions_id: string;
    answer: string;
}

type UpdateAnswerProps = {
    new_answer: string;
}

// Serviços relacionados às respostas dos questionários enviadas pelos usuários.

export const AnswerService = {

    async answerQuestions(data: AnswerQuestionsProps) {
        try {
            const response = await api.post('/v1/user/answer-question', data);
            return response.data;
        }
        catch (error) {
            console.error("AnswerService: Erro ao submeter resposta", error);
            throw error;
        }
    },

    async updateAnswer(data: UpdateAnswerProps) {
        try {
            const response = await api.put('/v1/user/update-answer', data);
            return response.data;
        }
        catch (error) {
            console.error("AnswerService: Erro ao atualizar resposta", error);
            throw error;
        }
    }
};