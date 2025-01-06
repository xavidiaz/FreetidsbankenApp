import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useItemsStore, useReviewsStore, useShopsStore, useCategoriesStore } from "@/store/useFreetidsbanken";
import DetailLayout from "@/Layouts/DetailLayout";
import ReviewFormComponent from "@/components/ReviewFormComponent";
import AddToCartButton from "@/components/AddToCartButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Img from "@/components/Img";

const ItemDetailPage = () => {
    const { id } = useParams();
    const itemsStore = useItemsStore();
    const reviewsStore = useReviewsStore();
    const shopsStore = useShopsStore();
    const categoriesStore = useCategoriesStore();

    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedItem = itemsStore.getById(Number(id));
            setItem(fetchedItem);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id, itemsStore]);

    if (isLoading || !item) {
        return <Skeleton className="h-40 w-full" />;
    }

    const shop = shopsStore.getById(item.shop_id);
    const category = categoriesStore.getById(item.category_id);
    const itemReviews = item.reviews.map((reviewId) => reviewsStore.getById(reviewId)).filter(Boolean);

    return (
        <DetailLayout title={item.name}>
            <div className="flex gap-6">
                <Img src={item.thumbnail} alt={item.name} className="w-48 h-48 object-cover rounded-lg" />
                <div className="flex flex-col space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2">
                        <Badge>{category ? category.name : "Unknown Category"}</Badge>
                        <Badge variant="secondary">{shop ? shop.name : "Unknown Shop"}</Badge>
                    </div>
                    <p><strong>Stock:</strong> {item.stock_quantity}</p>
                    <Separator />
                    <AddToCartButton item={item} />
                </div>
            </div>
            <Separator />

            {/* Gallery Section */}
            <div className="mt-4">
                <div className="flex gap-2 overflow-x-auto">
                    {item.gallery.map((image, index) => (
                        <Img key={index} src={image} alt={`Gallery ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <Card className="mt-4">
                <CardContent>
                    <h2 className="font-semibold">Reviews</h2>
                    {itemReviews.length > 0 ? (
                        <div className="space-y-4">
                            {itemReviews.map((review) => (
                                <div key={review.review_id} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm"><strong>Rating:</strong> {review.rating} ⭐</p>
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                    <Separator className="my-3" />
                    <ReviewFormComponent itemId={id} />
                </CardContent>
            </Card>


        </DetailLayout>
    );
};

export default ItemDetailPage;
