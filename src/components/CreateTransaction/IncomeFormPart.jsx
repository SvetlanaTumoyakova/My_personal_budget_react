const IncomeFormPart = ({ amount, handleChange, errors }) => {
    return (
        <>
            <div className="mb-3">
                <label htmlFor="amount" className="form-label">Сумма</label>
                <input
                    type="text"
                    id="amount"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    value={amount}
                    onChange={handleChange}
                    name="amount"
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>
        </>
    )
};

export default IncomeFormPart;