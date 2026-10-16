import api from "./api";

export async function getDashboardData() {
    const [
        profileResponse,
        resumesResponse,
        matchesResponse,
        analysesResponse,
        interviewsResponse,
    ] = await Promise.all([
        api.get("/accounts/profile/"),
        api.get("/resumes/my/"),
        api.get("/matching/my/"),
        api.get("/ai/my/"),
        api.get("/ai/my-interviews/"),
    ]);

    return {
        profile:
            profileResponse.data?.data ||
            profileResponse.data,

        resumes:
            resumesResponse.data?.results ||
            resumesResponse.data?.data ||
            resumesResponse.data ||
            [],

        matches:
            matchesResponse.data?.results ||
            matchesResponse.data?.data ||
            matchesResponse.data ||
            [],

        analyses:
            analysesResponse.data?.results ||
            analysesResponse.data?.data ||
            analysesResponse.data ||
            [],

        interviews:
            interviewsResponse.data?.results ||
            interviewsResponse.data?.data ||
            interviewsResponse.data ||
            [],
    };
}