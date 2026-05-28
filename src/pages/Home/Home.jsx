import { useState, useEffect, useContext } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { AccountsContext } from '../../context/AccountsContext';
import RecentTransactions from '../../components/RecentTransactions';


function Home() {
    const {
        accounts,
        currentAccount,
        changeCurrentAccount,
        refreshAccounts,
        loading,
        error
    } = useContext(AccountsContext);

    const formatAmount = (amount) => {
        if (!amount) return '0 ₽';

        const cleanNumber = amount.toString().replace(/\s/g, '');

        // Преобразуем в число и форматируем с пробелами между разрядами
        const formattedNumber = Number(cleanNumber).toLocaleString('ru-RU');

        return `${formattedNumber} ₽`;
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-2 text-muted">Загрузка аккаунтов...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">
                    Ошибка: {error}
                    <button
                        className="btn btn-outline-danger ms-3"
                        onClick={refreshAccounts}
                    >
                        Повторить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12 col-md-6">
                    <header className="row mb-4">
                        {/* Текущий аккаунт */}
                        <div className="col-12 col-md-6 mb-3">
                            <div className="card bg-gradient-accent shadow-lg border-0">
                                <div className="card-body p-4">
                                    <h2 className="card-title h4 text-accent mb-3 finance-font">
                                        Текущий аккаунт
                                    </h2>
                                    <h3 className="card-subtitle h3 mb-3 text-mint-green finance-font fw-bold">
                                        {currentAccount?.name || 'Выберите аккаунт'}
                                    </h3>
                                    <div className="d-flex align-items-end justify-content-between">
                                        <p className="card-text fs-2 fw-bold text-accent m-0 finance-font balance-amount">
                                            {formatAmount(currentAccount?.balance)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Выпадающий список аккаунтов */}
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header bg-accent text-white">
                                    <h4 className="card-title h5 mb-0 finance-font">Выберите аккаунт</h4>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {accounts.map(account => (
                                        <li
                                            key={account.id}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${currentAccount?.id === account.id
                                                ? 'bg-gradient-accent text-dark'
                                                : ''
                                                }`}
                                            onClick={() => changeCurrentAccount(account)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className={`fw-medium ${currentAccount?.id === account.id ? 'text-dark' : 'text-dark'}`}>
                                                {account.name}
                                            </span>
                                            <span className={`fw-bold ${currentAccount?.id === account.id ? 'text-accent' : 'text-success'}`}>
                                                {formatAmount(account.balance)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </header>
                    {/* Компонент с транзакциями */}
                    <section className="row">
                        <div className="col-12">
                            <RecentTransactions currentAccountId={currentAccount?.id} />
                        </div>
                    </section>
                </div>
                <div className="col-12 col-md-6">
                    {/* Графики*/}
                    <div className="placeholder-section">
                        <h3>Здесь будут другие элементы</h3>
                        <p>Например: график расходов, статистика и т. д.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;