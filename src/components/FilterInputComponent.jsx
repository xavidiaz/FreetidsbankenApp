import React from 'react';

const FilterInputComponent = ({ store, filterKey, placeholder }) => {
    const filterStore = store();

    const handleChange = (event) => {
        const value = event.target.value;
        filterStore.filterBy(filterKey, value);
    };

    return (
        <input
            type="text"
            onChange={handleChange}
            placeholder={placeholder || 'Search...'}
        />
    );
};

export default FilterInputComponent;
