import ProductList from "./ProductList";
const ExpenseFormPart = ({ amount, products, handleProductChange, addProduct, removeProduct, errors }) => {
    return (
        <>
            <div className="mb-3">
                <label htmlFor="amount" className="form-label">Сумма</label>
                <p>{amount}</p>
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>

            <ProductList
                products={products}
                onProductChange={handleProductChange}
                onAddProduct={addProduct}
                onRemoveProduct={removeProduct}
            />
        </>
    )
};

export default ExpenseFormPart;