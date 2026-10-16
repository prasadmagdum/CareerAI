import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    getAccessToken,
    login as loginUser,
    logout as logoutUser,
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] =
        useState(
            Boolean(getAccessToken())
        );


    async function login(
        username,
        password
    ) {

        const data = await loginUser(
            username,
            password
        );

        setIsAuthenticated(true);

        return data;
    }


    function logout() {

        logoutUser();

        setIsAuthenticated(false);
    }


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}