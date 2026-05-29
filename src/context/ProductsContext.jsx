import { createContext, useEffect, useState } from "react";
import api from '../api/index.js';

const ProductsContext = createContext();

function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = '/Product';
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка загрузки продуктов');
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (createProductDto) => {
        try {
            const response = await api(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createProductDto)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка создания продукта');
            }

            const newProduct = await response.json();
            setProducts(prev => [...prev, newProduct]);
            return newProduct;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getProductById = async (id) => {
        try {
            const response = await api(`${apiUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Продукт не найден');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка загрузки продукта');
            }

            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateProduct = async (id, updateProductDto) => {
        try {
            const response = await api(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateProductDto)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 404) {
                    throw new Error('Продукт не найден');
                }
                throw new Error(errorData.message || 'Ошибка обновления продукта');
            }

            const updatedProduct = await response.json();
            setProducts(prev =>
                prev.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            return updatedProduct;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const refreshProducts = () => {
        loadProducts();
    };

    const value = {
        products,
        loading,
        error,
        createProduct,
        getProductById,
        updateProduct,
        refreshProducts
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}

export { ProductsContext, ProductsProvider };
