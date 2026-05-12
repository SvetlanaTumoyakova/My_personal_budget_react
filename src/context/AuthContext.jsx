import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();
    const apiUrl = "https://localhost:7017/api/Auth";

    const isAuthenticated = Boolean(currentUser);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUser();
        }
    }, []);

    const register = async ({
        userName,
        email,
        password,
        lastName,
        firstName,
        patronymic,
        address,
        phone
    }) => {
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName,
                    email,
                    password,
                    lastName,
                    firstName,
                    patronymic,
                    address,
                    phone
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка регистрации");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            // await getUser();
        } catch (error) {
            console.error(error); // для отладки
            throw error;
        }
    };

    const login = async ({ loginInput, password }) => {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Login: loginInput,
                    Password: password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка входа");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            // await getUser();
        } catch (error) {
            console.error(error); // для отладки
            throw error;
        }
    };

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiUrl}/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    throw new Error("Требуется авторизация");
                }
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка получения данных пользователя");
            }

            const userData = await response.json();
            setCurrentUser(userData);

            navigate("/");
        } catch (error) {
            console.error(error); // для отладки
            throw error;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{ currentUser, isAuthenticated, register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };