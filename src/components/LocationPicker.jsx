import { useCartStore } from "@/store/useCartStore";
import { useShopsStore } from "@/store/useFreetidsbanken";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LocationPicker = () => {
    const shopsStore = useShopsStore();
    const cartStore = useCartStore();

    return (
        <div className="space-y-2">
            <Select
                value={cartStore.selectedShop?.toString() || ""}
                onValueChange={(value) => cartStore.setSelectedShop(Number(value))}
            >
                <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Choose a Shop" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {shopsStore.getAll().map((shop) => (
                            <SelectItem key={shop.shop_id} value={shop.shop_id.toString()}>
                                {shop.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default LocationPicker;
