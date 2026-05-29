import { useState } from 'react';
import ProductRow from './ProductRow';
import SelectProductField from './SelectProductField';
const ProductList = ({ products, onProductChange, onAddProduct, onRemoveProduct }) => {
    const [product, setProduct] = useState();

    const handleProductChange = (newProduct) => {
        setProduct(newProduct);
        onAddProduct(newProduct);
        console.log('newProduct', newProduct);
    }

    return (
        <div className="border rounded p-4 mb-4">
            <h3 className="mb-0 text-secondary">
                Список продуктов
            </h3>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <SelectProductField
                    label="Выберите продукт из списка"
                    value={product}
                    onChange={handleProductChange}
                />
                <button
                    type="button"
                    onClick={onAddProduct}
                    className="btn btn-outline-primary btn-sm"
                >
                    + Добавить продукт
                </button>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-info text-center">
                    Продукты не добавлены. Нажмите «Добавить продукт», чтобы начать.
                </div>
            ) : (
                products.map((product, index) => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        index={index}
                        onProductChange={onProductChange}
                        onRemove={onRemoveProduct}
                    />
                ))
            )}
        </div>
    )
};

export default ProductList;
