import api from "./api";


export async function getMyJobs() {

    const response =
        await api.get("/jobs/my/");

    return response.data;
}


export async function createJob(jobData) {

    const response =
        await api.post(
            "/jobs/",
            jobData
        );

    return response.data;
}


export async function matchResumeWithJob(
    resumeId,
    jobId
) {

    const response =
        await api.post(
            "/matching/",
            {
                resume_id: resumeId,
                job_id: jobId,
            }
        );

    return response.data;
}


export async function getMyMatches() {

    const response =
        await api.get(
            "/matching/my/"
        );

    return response.data;
}