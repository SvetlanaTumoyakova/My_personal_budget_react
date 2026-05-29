const SelectField = ({ label, value, onChange, options, error }) => (
    <div className="form-group">
        <label>{label}</label>
        <select
            value={value}
            onChange={onChange}
            className={error ? 'error' : ''}
        >
            <option value="">Выберите вариант</option>
            {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
        </select>
        {error && <span className="error-message">{error}</span>}
    </div>
);
export default SelectField;