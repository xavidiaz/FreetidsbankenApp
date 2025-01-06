import { Input } from "@/components/ui/input";

const FilterInputComponent = ({ store, filterKey, placeholder, onSearch }) => {
    const storeInstance = store ? store() : null; // Zustand store instance (if provided)

    const handleChange = (event) => {
        const value = event.target.value;

        if (storeInstance?.filterBy) {
            storeInstance.filterBy(filterKey, value); // ✅ Use Zustand filtering when available
        } else if (onSearch) {
            onSearch(value); // ✅ Use local state filtering when needed
        } else {
            console.error("FilterInputComponent: No valid filtering method found.");
        }
    };

    return (
        <Input
            type="text"
            onChange={handleChange}
            placeholder={placeholder || "Search..."}
        />
    );
};

export default FilterInputComponent;
