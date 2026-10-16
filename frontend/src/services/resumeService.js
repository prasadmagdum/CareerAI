import api from "./api";

export async function getMyResumes() {
    const response = await api.get("/resumes/my/");
    return response.data;
}

export async function uploadResume(title, file) {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("file", file);

    const response = await api.post(
        "/resumes/upload/",
        formData
    );

    return response.data;
}