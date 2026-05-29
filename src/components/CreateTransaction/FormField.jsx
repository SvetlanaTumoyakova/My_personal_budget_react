const FormField = ({ label, type = 'text', value, onChange, error, ...props }) => (
    <div className="form-group">
        <label className="text-muted small">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={error ? 'error' : ''}
            {...props}
        />
        {error && <span className="error-message">{error}</span>}
    </div>
);
export default FormField;