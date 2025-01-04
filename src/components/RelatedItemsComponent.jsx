import { useItemsStore, useCategoriesStore } from "@/store/useFreetidsbanken";
import { useCartStore } from "@/store/useCartStore";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Img from "@/components/Img"; // ✅ Use Img with Fallback
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";


const RelatedItemsComponent = () => {
    const itemsStore = useItemsStore();
    const cartStore = useCartStore();
    const categoriesStore = useCategoriesStore();

    const cartItems = cartStore.cart;

    if (cartItems.length === 0) return null; // If cart is empty, hide related items

    // 🔹 Get unique category IDs from cart items
    const cartCategories = [...new Set(cartItems.map(item => item.category_id))];

    // 🔹 Find all items related to those categories, but exclude those already in the cart
    const relatedItems = itemsStore.getAll().filter(
        item => cartCategories.includes(item.category_id) &&
            !cartItems.some(cartItem => cartItem.item_id === item.item_id) // Exclude cart items
    );

    // 🔹 Group related items by category
    const relatedItemsByCategory = cartCategories.reduce((acc, categoryId) => {
        const categoryItems = relatedItems.filter(item => item.category_id === categoryId);
        if (categoryItems.length > 0) {
            acc[categoryId] = categoryItems;
        }
        return acc;
    }, {});

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Related Items</h2>

            {Object.keys(relatedItemsByCategory).length > 0 ? (
                Object.keys(relatedItemsByCategory).map(categoryId => {
                    const category = categoriesStore.getById(Number(categoryId));

                    return (
                        <div key={categoryId} className="mt-4">
                            <h3 className="text-lg font-medium">{category ? category.name : "Unknown Category"}</h3>

                            <Carousel className="w-full max-w-xl">
                                <CarouselContent className="-ml-1">
                                    {relatedItemsByCategory[categoryId].map((item) => (
                                        <CarouselItem key={item.item_id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <Card className="p-4 flex flex-col items-center">
                                                    <CardContent className="flex flex-col items-center justify-center">
                                                        <Img src={item.thumbnail} alt={item.name} className="size-16 rounded-md" />
                                                        <Link to={`/items/${item.item_id}`} className="mt-2 font-medium hover:underline">
                                                            {item.name}
                                                        </Link>
                                                        <button
                                                            className="mt-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/80"
                                                            onClick={() => cartStore.addToCart(item)}
                                                        >
                                                            + Add to Cart
                                                        </button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    );
                })
            ) : (
                <p className="text-muted-foreground">No related items available.</p>
            )}
        </div>
    );
};

export default RelatedItemsComponent;
