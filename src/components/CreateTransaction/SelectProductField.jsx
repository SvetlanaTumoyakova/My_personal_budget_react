import { useContext } from 'react';
import SelectField from './SelectField';
import { ProductsContext } from '../../context/ProductsContext';

const SelectProductField = ({ label, value, onChange, error }) => {
    const { products } = useContext(ProductsContext);

    const handleProductChange = (e) => {
        const id = e.target.value;
        const product = products.find(p => p.id === id);
        onChange(product);
    }

    return (
        <SelectField
            label={label}
            value={value}
            onChange={handleProductChange}
            options={products}
            error={error}
        />
    )
};
export default SelectProductField;