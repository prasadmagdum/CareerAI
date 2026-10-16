import api from "./api";

export async function getProfile() {
    const response = await api.get("/accounts/profile/");
    return response.data;
}

export async function updateProfile(profileData) {
    const response = await api.put(
        "/accounts/profile/",
        profileData
    );

    return response.data;
}