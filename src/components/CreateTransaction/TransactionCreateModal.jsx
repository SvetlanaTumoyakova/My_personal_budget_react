import React, { useState, useEffect, useContext } from 'react';
import { AccountsContext } from '../../context/AccountsContext';
import Modal from './Modal';
import FormField from './FormField';
import SelectField from './SelectField';
import ProductList from './ProductList';
import ExpenseFormPart from './ExpenseFormPart';
import IncomeFormPart from './IncomeFormPart';

const transactionTypes = [{
    id: '0219dfdb-fdae-4a26-b5d4-bdc74441e266',
    type: 'Расход'
},
{
    id: 'b2bc0dea-11a3-4810-b45f-d0fce65b9004',
    type: 'Доход'
}]

const TransactionCreateModal = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const { currentAccount } = useContext(AccountsContext);
    const [formData, setFormData] = useState({
        name: '',
        transactionTypeId: '',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
        amount: 0,
        description: '',
        products: []
    });

    const recalculateAmount = (products) => {
        const amount = products.reduce((sum, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;

            return sum + (price * quantity);
        }, 0);

        return amount;
    };

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                transactionTypeId: '',
                date: new Date().toISOString().split('T')[0],
                accountId: '',
                amount: 0,
                description: '',
                products: []
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index][field] = value;

        setFormData(prev => ({
            ...prev,
            products: updatedProducts,
            amount: recalculateAmount(updatedProducts)
        }));
    };

    const handleAmountChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            amount: value
        }));
    };

    const handleTransactionTypeChange = (e) => {
        const { value } = e.target;
        const updatedProducts = value !== transactionTypes[1].id ? [...formData.products] : [];
        setFormData(prev => ({
            ...prev,
            products: updatedProducts,
            transactionTypeId: value,
            amount: 0
        }));
    };


    const addProduct = (newProduct) => {
        const updatedProducts = [
            ...formData.products,
            newProduct
        ];
        setFormData(prev => ({
            ...prev,
            products: updatedProducts,
            amount: recalculateAmount(updatedProducts)
        }));
    };

    const removeProduct = (index) => {
        const updatedProducts = formData.products.filter((_, i) => i !== index);

        setFormData(prev => ({
            ...prev,
            products: updatedProducts,
            amount: recalculateAmount(updatedProducts)
        }));
    };

    const validateForm = () => {
        console.log('validate', formData);
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Название транзакции обязательно';
        }

        if (!formData.transactionTypeId) {
            newErrors.transactionTypeId = 'Тип транзакции обязателен';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Сумма должна быть больше 0';
        }

        formData.products.forEach((product, index) => {
            if (!product.quantity || parseInt(product.quantity) <= 0) {
                newErrors[`product_${index}_quantity`] = 'Количество должно быть больше 0';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                ...formData,
                accountId: currentAccount.id
            });
            onClose();
        }

        console.log('submit', errors);

    };
    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Создание новой транзакции</h3>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Поля формы */}
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Название транзакции *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            name="name"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="transactionTypeId" className="form-label">Тип транзакции *</label>
                                        <select
                                            id="transactionTypeId"
                                            className={`form-select ${errors.transactionTypeId ? 'is-invalid' : ''}`}
                                            value={formData.transactionTypeId}
                                            onChange={handleTransactionTypeChange}
                                            name="transactionTypeId"
                                        >
                                            <option value="">Выберите тип</option>
                                            {transactionTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.type}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.transactionTypeId && <div className="invalid-feedback">{errors.transactionTypeId}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">Дата</label>
                                        <input
                                            type="date"
                                            id="date"
                                            className="form-control"
                                            value={formData.date}
                                            onChange={handleChange}
                                            name="date"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Описание</label>
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            value={formData.description}
                                            onChange={handleChange}
                                            name="description"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    {formData.transactionTypeId === transactionTypes[0].id ?
                                        (<ExpenseFormPart
                                            amount={formData.amount}
                                            products={formData.products}
                                            handleProductChange={handleProductChange}
                                            errors={errors}
                                            addProduct={addProduct}
                                            removeProduct={removeProduct}
                                        />) : (
                                            <IncomeFormPart
                                                amount={formData.amount}
                                                handleChange={handleAmountChange}
                                                errors={errors}
                                            />
                                        )}

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                                            Отмена
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Создать транзакцию
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionCreateModal;