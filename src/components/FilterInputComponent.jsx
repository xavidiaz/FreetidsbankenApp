import React from "react";

const FilterInputComponent = ({ store, filterKey, placeholder }) => {
    const storeInstance = store(); // Get Zustand store instance


    if (!storeInstance.filterBy) {
        console.error(`The provided store does not have a 'filterBy' function.`);
        return null; // Prevent crash
    }

    const handleChange = (event) => {
        const value = event.target.value;
        storeInstance.filterBy(filterKey, value);
    };

    return (
        <input
            type="text"
            onChange={handleChange}
            placeholder={placeholder || "Search..."}
        />
    );
};

export default FilterInputComponent;
