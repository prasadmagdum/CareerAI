import api from "./api";

export async function generateAIAnalysis(matchResultId) {
    const response = await api.post(
        "/ai/analyze/",
        {
            match_result_id: matchResultId,
        }
    );

    return response.data;
}

export async function getMyAIAnalyses() {
    const response = await api.get(
        "/ai/my/"
    );

    return response.data;
}

export async function generateInterviewQuestions(
    matchResultId
) {
    const response = await api.post(
        "/ai/interview/",
        {
            match_result_id: matchResultId,
        }
    );

    return response.data;
}

export async function getMyInterviewPreparations() {
    const response = await api.get(
        "/ai/my-interviews/"
    );

    return response.data;
}