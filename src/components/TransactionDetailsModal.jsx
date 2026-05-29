import React, { useState, useEffect } from 'react';
import api from '../api/index';

const TransactionDetailsModal = ({ transactionId, isOpen, onClose }) => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = "/Transaction";

    useEffect(() => {
        if (isOpen && transactionId) {
            fetchTransactionDetails();
        }
    }, [isOpen, transactionId]);

    const fetchTransactionDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api(`${apiUrl}/${transactionId}`);

            if (!response.ok) {
                throw new Error('Ошибка загрузки деталей транзакции');
            }

            const data = await response.json();
            setTransaction(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Отображение состояния загрузки
    if (loading) {
        return (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Детали транзакции</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p>Загрузка деталей...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Отображение ошибки
    if (error) {
        return (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Детали транзакции</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-danger">
                                Ошибка: {error}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={fetchTransactionDetails}>Повторить</button>
                            <button className="btn btn-secondary" onClick={onClose}>Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return null;
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Детали транзакции</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        {/* Основная информация */}
                        <div className="row mb-3">
                            <div className="col-4 text-muted">Название:</div>
                            <div className="col-8">{transaction.name}</div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-4 text-muted">Сумма:</div>
                            <div className={`col-8 ${transaction.transactionType?.type === 'Доход' ? 'text-success' : 'text-danger'}`}>
                                {transaction.transactionType?.type === 'Доход'
                                    ? `+${transaction.amount.toFixed(2)} ₽`
                                    : `-${transaction.amount.toFixed(2)} ₽`}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-4 text-muted">Дата:</div>
                            <div className="col-8">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-4 text-muted">Тип:</div>
                            <div className="col-8">{transaction.transactionType?.type}</div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-4 text-muted">Счёт:</div>
                            <div className="col-8">{transaction.accountId}</div>
                        </div>

                        {transaction.description && (
                            <div className="row mb-3">
                                <div className="col-4 text-muted">Описание:</div>
                                <div className="col-8">{transaction.description}</div>
                            </div>
                        )}

                        {/* Список продуктов */}
                        {transaction.products && transaction.products.length > 0 && (
                            <>
                                <h6 className="mt-4 mb-3 border-top pt-3">Состав транзакции</h6>
                                <div className="list-group">
                                    {transaction.products.map((product, index) => (
                                        <div key={product.productId || index} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>{product.productName}</strong>
                                                    {product.categoryName && (
                                                        <small className="text-muted d-block">Категория: {product.categoryName}</small>
                                                    )}
                                                </div>
                                                <div className="text-end">
                                                    <div>{product.quantity} × {product.price.toFixed(2)} ₽</div>
                                                    <small className="text-success">= {(product.quantity * product.price).toFixed(2)} ₽</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
