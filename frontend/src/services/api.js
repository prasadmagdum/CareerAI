import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.DEV
            ? "http://127.0.0.1:8000/api"
            : "/api"),
});


api.interceptors.request.use(
    (config) => {

        const authToken = localStorage.getItem("access_token");

        if (authToken) {
            config.headers.Authorization =
                String.fromCharCode(66, 101, 97, 114, 101, 114, 32) + authToken;
        }

        return config;
    },

    (error) =>
        Promise.reject(error)
);


api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            window.location.href =
                "/login";
        }

        return Promise.reject(error);
    }
);


export default api;
