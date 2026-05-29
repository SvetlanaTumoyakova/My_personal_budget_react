import React, { useState, useEffect, useContext } from 'react';
import '../assets/RecentTransactions.css';
import { AccountsContext } from '../context/AccountsContext.jsx';
import TransactionDetailsModal from './TransactionDetailsModal.jsx'
import TransactionCreateModal from './CreateTransaction/TransactionCreateModal.jsx'
import api from '../api/index';

const RecentTransactions = ({ currentAccountId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { refreshAccounts } = useContext(AccountsContext);

    const apiUrl = "/Transaction";

    // Функция загрузки транзакций с сервера
    const fetchTransactions = async (page = currentPage, itemsPerPage = perPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api(
                `${apiUrl}?accountId=${currentAccountId}&page=${page}&perPage=${itemsPerPage}`
            );

            if (!response.ok) {
                throw new Error('Ошибка загрузки транзакций');
            }

            const data = await response.json();

            setTransactions(data.data);
            setTotalPages(data.meta.lastPage);
            setCurrentPage(data.meta.currentPage);

            if (data.warning) {
                alert(data.warning);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка транзакций
    useEffect(() => {
        if (currentAccountId) {
            fetchTransactions(1, perPage);
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
        fetchTransactions(1, parseInt(newPerPage, 10));
    };

    // обработчик открытия модального окна с деталями транзакции
    const handleViewDetails = (transactionId) => {
        setSelectedTransactionId(transactionId);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransactionId(null);
    };

    // обработчик открытия модального окна для создания новой транзакции
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // Обработчик создания транзакции
    const handleCreateTransactionSubmit = async (formData) => {
        try {
            setLoading(true);

            const submitData = {
                name: formData.name.trim(),
                transactionTypeId: formData.transactionTypeId,
                date: new Date(formData.date).toISOString(),
                accountId: formData.accountId,
                description: formData.description?.trim() || null,
                amount: parseFloat(formData.amount),
                products: formData.products.map(product => ({
                    productId: product.id,
                    quantity: parseInt(product.quantity, 10)
                }))
            };

            // Отправляем запрос на создание транзакции
            const response = await api('/Transaction', {
                method: "POST",
                body: JSON.stringify(submitData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Не удалось создать транзакцию');
            }

            setIsCreateModalOpen(false);

            refreshAccounts();

            fetchTransactions(1, perPage);

            alert('Транзакция успешно создана!');

        } catch (error) {
            console.error('Ошибка создания транзакции:', error);
            if (error.message.includes('network') || error.message.includes('fetch')) {
                alert('Ошибка сети: проверьте подключение к интернету');
            } else if (error.response?.status === 400) {
                alert('Неверные данные: проверьте правильность заполнения формы');
            } else if (error.response?.status === 403) {
                alert('У вас нет прав для создания транзакции');
            } else {
                alert(`Ошибка: ${error.message || 'Неизвестная ошибка при создании транзакции'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    console.log("cur", currentPage, totalPages);

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
                        onClick={handleOpenCreateModal}
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

                        <div
                            key={transaction.id}
                            className={`transaction-item ${transaction.transactionType === 'Доход' ? 'income' : 'expense'}`}
                            onClick={() => handleViewDetails(transaction.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="transaction-date">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="transaction-name">{transaction.name}</div>
                            <div className="transaction-amount">
                                {transaction.transactionType === 'Доход'
                                    ? ` +${transaction.amount.toFixed(2)} ₽`
                                    : ` -${transaction.amount.toFixed(2)} ₽`}
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

            {/* Рендеринг модального окна создания транзакции */}
            <TransactionCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreateTransactionSubmit}
            />

            {/* рендеринг модального окна */}
            <TransactionDetailsModal
                transactionId={selectedTransactionId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default RecentTransactions;

