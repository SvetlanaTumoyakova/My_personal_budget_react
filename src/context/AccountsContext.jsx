import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/index.js';
const AccountsContext = createContext();

function AccountsProvider({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = '/Account';
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api(`${apiUrl}`, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка загрузки аккаунтов');
            }
            const data = await response.json();
            // Берём только первые 5 аккаунтов
            const firstFiveAccounts = data.slice(0, 5);
            setAccounts(firstFiveAccounts);

            // Устанавливаем первый аккаунт как текущий, если его ещё нет
            if (!currentAccount && firstFiveAccounts.length > 0) {
                setCurrentAccount(firstFiveAccounts[0]);
            }
            if (currentAccount) {
                setCurrentAccount(data.find(acc => acc.id === currentAccount.id));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const changeCurrentAccount = (account) => {
        setCurrentAccount(account);
    };

    const refreshAccounts = () => {
        loadAccounts();

    };

    const value = {
        accounts,
        currentAccount,
        changeCurrentAccount,
        refreshAccounts,
        loading,
        error
    };
    return (
        <AccountsContext.Provider value={value}>
            {children}
        </AccountsContext.Provider>
    );
};

export { AccountsContext, AccountsProvider };