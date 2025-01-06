import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import Img from "@/components/Img";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const RelatedItems = ({ relatedItems, useCarousel = false, showAddToCart = false }) => {
    const cartStore = useCartStore();

    if (!relatedItems || relatedItems.length === 0) return null; // Hide if no related items

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">Related Items</h2>

            {useCarousel ? (
                <Carousel className="w-full max-w-xl">
                    <CarouselContent className="-ml-1">
                        {relatedItems.map((item) => (
                            <CarouselItem key={item.item_id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="p-4 flex flex-col items-center">
                                        <CardContent className="flex flex-col items-center justify-center">
                                            <Img src={item.thumbnail} alt={item.name} className="size-16 rounded-md" />
                                            <Link to={`/items/${item.item_id}`} className="mt-2 font-medium hover:underline">
                                                {item.name}
                                            </Link>
                                            {showAddToCart && (
                                                <button
                                                    className="mt-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/80"
                                                    onClick={() => cartStore.addToCart(item)}
                                                >
                                                    + Add to Cart
                                                </button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {relatedItems.map((item) => (
                        <Link
                            key={item.item_id}
                            to={`/items/${item.item_id}`}
                            className="flex items-center gap-3 border p-2 rounded-md hover:bg-accent"
                        >
                            <Img src={item.thumbnail} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedItems;
