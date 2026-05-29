import React, { useState } from 'react';


function CreateAccountModal({ isOpen, onClose, onCreate }) {

    console.log(onCreate)
    // Массив типов аккаунтов
    const transactionTypes = [
        {
            id: 'fa76e2d9-63a2-49f4-8bf8-ca6011e69203',
            name: 'Наличные'
        },
        {
            id: 'a3eb2441-3d98-4ba1-8955-b051cf8fd94c',
            name: 'Карта'
        }
    ];

    const [formData, setFormData] = useState({
        name: '',
        accountTypeId: ''
    });

    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting form:', formData);
        if (!formData.name.trim()) {
            setError('Название аккаунта обязательно');
            return;
        }

        try {
            setIsCreating(true);
            setError('');
            await onCreate(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Ошибка создания аккаунта');
        } finally {
            setIsCreating(false);
        }
    };

    // Если модальное окно закрыто, не рендерим ничего
    if (!isOpen) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Создать новый аккаунт</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger">
                                    <use xlinkHref="#exclamation-circle-fill" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        )}
                        <form id='createAccountForm' onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="accountName" className="form-label">Название аккаунта</label>
                                <input
                                    type="text"
                                    id="accountName"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Введите название"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accountType" className="form-label">Тип аккаунта</label>
                                <select
                                    id="accountType"
                                    name="accountTypeId"
                                    className="form-select"
                                    value={formData.accountTypeId}
                                    onChange={handleChange}
                                >
                                    <option value="">Выберите тип</option>
                                    {transactionTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isCreating}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            form="createAccountForm"
                            className="btn btn-primary"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Создание...' : 'Создать'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountModal;
