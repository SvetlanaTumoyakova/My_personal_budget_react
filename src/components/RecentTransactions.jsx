import React, { useState, useEffect } from 'react';
import '../assets/RecentTransactions.css';
import api from '../api/index';

const RecentTransactions = ({ currentAccountId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5); // Количество элементов на странице (задаётся на фронтенде)
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = "/Transaction";

    // Функция загрузки транзакций с сервера
    const fetchTransactions = async (page = currentPage, itemsPerPage = perPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api(
                `${apiUrl}?accountId=${currentAccountId}&page=${page}&per_page=${itemsPerPage}`
            );

            if (!response.ok) {
                throw new Error('Ошибка загрузки транзакций');
            }

            const data = await response.json();

            setTransactions(data.data);
            setTotalPages(data.meta.last_page);
            setCurrentPage(data.meta.current_page);

            // Если сервер вернул предупреждение, показываем его пользователю
            if (data.warning) {
                alert(data.warning);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка транзакций при монтировании компонента и при смене accountId или perPage
    useEffect(() => {
        if (currentAccountId) {
            fetchTransactions(1, perPage); // Загружаем первую страницу с текущим количеством элементов
        }
    }, [currentAccountId, perPage]);

    // Обработчики пагинации
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchTransactions(page, perPage);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    // Обработчик изменения количества элементов на странице
    const handlePerPageChange = (newPerPage) => {
        setPerPage(parseInt(newPerPage, 10));
        // При изменении количества элементов загружаем первую страницу
        fetchTransactions(1, parseInt(newPerPage, 10));
    };

    // Обработчик кнопки «Новая транзакция»
    const handleAddTransaction = () => {
        alert('Переход на форму создания транзакции');
    };

    // Отображение состояния загрузки
    if (loading) {
        return (
            <div className="recent-transactions-container">
                <h2 className="section-title">Последние транзакции</h2>
                <div className="loading">Загрузка транзакций...</div>
            </div>
        );
    }

    // Отображение ошибки
    if (error) {
        return (
            <div className="recent-transactions-container">
                <h2 className="section-title">Последние транзакции</h2>
                <div className="error">Ошибка: {error}</div>
            </div>
        );
    }

    return (
        <div className="recent-transactions-container">
            {/* Заголовок */}
            <h2 className="section-title">Последние транзакции</h2>

            {/* Блок выбора количества элементов на странице */}
            <div className="per-page-selector">
                <label htmlFor="perPage">Показать:</label>
                <select
                    id="perPage"
                    value={perPage}
                    onChange={(e) => handlePerPageChange(e.target.value)}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Блок новой транзакции */}
            <div className="new-transaction-section">
                <div className="section-header">
                    <h3 className="subsection-title">Новая транзакция</h3>
                    <button
                        className="add-transaction-btn"
                        onClick={handleAddTransaction}
                        aria-label="Добавить новую транзакцию"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Список транзакций */}
            <div className="transactions-list">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className={`transaction-item ${transaction.transactionType === 'Income' ? 'income' : 'expense'}`}>
                            <div className="transaction-date">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="transaction-description">{transaction.description}</div>
                            <div className="transaction-amount">
                                {transaction.transactionType === 'Income'
                                    ? `+${transaction.amount.toFixed(2)} ₽`
                                    : `-${transaction.amount.toFixed(2)} ₽`}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-transactions">Транзакций пока нет</div>
                )}
            </div>

            {/* Пагинация */}
            <div className="pagination">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >
                    Назад
                </button>

                <span className="page-info">
                    Страница {currentPage} из {totalPages}
                </span>

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                >
                    Вперёд
                </button>
            </div>
        </div>
    );
};

export default RecentTransactions;
