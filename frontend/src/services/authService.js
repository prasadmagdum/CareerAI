import api from "./api";


export async function login(username, password) {

    const response = await api.post(
        "/auth/token/",
        {
            username,
            password,
        }
    );

    const { access, refresh } = response.data;

    localStorage.setItem(
        "access_token",
        access
    );

    localStorage.setItem(
        "refresh_token",
        refresh
    );

    return response.data;
}

export async function registerUser({
    username,
    email,
    password,
    password2,
}) {
    const response = await api.post(
        "/accounts/register/",
        {
            username,
            email,
            password,
            password2,
        }
    );

    return response.data;
}


export function logout() {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );
}


export function getAccessToken() {

    return localStorage.getItem(
        "access_token"
    );
}

