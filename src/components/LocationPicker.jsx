import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useShopsStore } from "@/store/useFreetidsbanken";

const LocationPicker = () => {
    const shopsStore = useShopsStore();
    const cartStore = useCartStore();
    const [selectedShop, setSelectedShop] = useState(cartStore.selectedShop || "");

    const handleChange = (event) => {
        const shopId = Number(event.target.value);
        setSelectedShop(shopId);
        cartStore.setSelectedShop(shopId);
    };

    return (
        <div>
            <h3>Select Pickup Location</h3>
            <select value={selectedShop} onChange={handleChange}>
                <option value="">Choose a Shop</option>
                {shopsStore.getAll().map(shop => (
                    <option key={shop.shop_id} value={shop.shop_id}>
                        {shop.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocationPicker;
