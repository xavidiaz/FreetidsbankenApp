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
import { useToast } from "@/hooks/use-toast";

const LocationPicker = () => {
    const shopsStore = useShopsStore();
    const cartStore = useCartStore();
    const { toast } = useToast();

    const handleShopSelect = (value) => {
        const shopId = Number(value);
        cartStore.setSelectedShop(shopId); // ✅ Update store state

        const selectedShop = shopsStore.getById(shopId); // ✅ Get the shop object

        if (selectedShop) {
            toast({
                title: "🏪 Store Selected",
                description: `You have selected ${selectedShop.name}.`,
                duration: 3000,
            });
        }
    };


    return (
        <div className="">
            <Select
                value={cartStore.selectedShop?.toString() || ""}
                onValueChange={handleShopSelect}
            >
                <SelectTrigger className="h-12 min-w-fit">
                    <SelectValue placeholder="Select Shop" />
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
