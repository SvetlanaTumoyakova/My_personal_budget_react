import FormField from "./FormField";

const ProductRow = ({ product, index, onProductChange, onRemove }) => {
    const totalPrice = product.price * product.quantity;
    return (
        <div className="row g-3 align-items-center">
            <div className="col-md-3">
                <span className="text-muted small">Название продукта:</span>
                <div className="fw-bold">{product.name}</div>
            </div>

            <div className="col-md-3">
                <span className="text-muted small">Цена за 1 шт:</span>
                <div className="fw-bold">{product.price}</div>
            </div>

            <div className="col-md-2">
                <FormField
                    label="Количество *"
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => onProductChange(index, 'quantity', e.target.value)}
                    error={product.error?.quantity}
                    className="form-control form-control-sm"
                />
            </div>

            <div className="col-md-3">
                <span className="text-muted small">Итоговая цена:</span>
                <div className="fw-bold text-success">{totalPrice}</div>
            </div>

            <div className="col-md-1 d-flex justify-content-center">
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="btn btn-danger btn-sm"
                    aria-label="Удалить продукт"
                >
                    ×
                </button>
            </div>
        </div>
    )
};

export default ProductRow;
