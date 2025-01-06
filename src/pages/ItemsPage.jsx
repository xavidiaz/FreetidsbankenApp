import { useState, useEffect, useMemo } from "react";
import { useItemsStore, useCategoriesStore, useReviewsStore } from "@/store/useFreetidsbanken";
import { useCartStore } from "@/store/useCartStore";
import FilterInputComponent from "@/components/FilterInputComponent";
import PageLayout from "@/Layouts/PageLayout";
import AddToCartButton from "@/components/AddToCartButton";
import RelatedItems from "@/components/RelatedItems";
import { Link } from "react-router-dom";
import { SkeletonPlaceholder } from "@/components/SkeletonPlaceholder";
import Img from "@/components/Img";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // ✅ ShadCN Select

const ItemsPage = () => {
    const itemsStore = useItemsStore();
    const categoriesStore = useCategoriesStore();
    const reviewsStore = useReviewsStore();
    const cartStore = useCartStore();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const cartItems = cartStore.cart;

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    const filteredItems = useMemo(() => {
        return itemsStore.getAll().filter(item => {
            const matchesCategory = selectedCategory ? item.category_id === Number(selectedCategory) : true;
            const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [itemsStore, selectedCategory, searchTerm]);

    const availableCategories = useMemo(() => {
        return categoriesStore.getAll().filter(category =>
            itemsStore.getAll().some(item =>
                item.category_id === category.category_id &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [categoriesStore, itemsStore, searchTerm]);

    const getAverageRating = (item) => {
        if (!item.reviews || item.reviews.length === 0) return null;

        const reviewRatings = item.reviews.map(reviewId => {
            const review = reviewsStore.getById(reviewId);
            return review ? review.rating : null;
        }).filter(rating => rating !== null);

        if (reviewRatings.length === 0) return null;
        return (reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length).toFixed(1);
    };

    const relatedItems = useMemo(() => {
        if (cartItems.length === 0) return [];
        const cartCategories = [...new Set(cartItems.map(item => item.category_id))];

        return itemsStore.getAll().filter(
            item => cartCategories.includes(item.category_id) &&
                !cartItems.some(cartItem => cartItem.item_id === item.item_id)
        );
    }, [cartItems, itemsStore]);

    return (
        <div className="p-4 mt-0">
            <div className="sticky top-16 flex flex-row gap-4 p-3 bg-secondary z-10">
                <FilterInputComponent
                    className="w-3/5"
                    placeholder="Search Items..."
                    onSearch={setSearchTerm}
                />

                {availableCategories.length > 0 && (
                    <div className="mb-4 w-2/5">
                        <Select onValueChange={(value) => setSelectedCategory(value !== "none" ? value : "")} value={selectedCategory || undefined}>
                            <SelectTrigger className="border border-border rounded-md p-2 w-full">
                                <SelectValue placeholder="Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">All Categories</SelectItem>
                                {availableCategories.map((category) => (
                                    <SelectItem key={category.category_id} value={String(category.category_id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <SkeletonPlaceholder.Item key={index} />
                    ))}
                </div>
            ) : (
                <>
                    {filteredItems.length === 0 ? (
                        <>
                            <h3 className="text-center pt-4">⚠️ No items found.</h3>
                            {[...Array(5)].map((_, index) => (
                                <SkeletonPlaceholder.Item key={index} />
                            ))}
                        </>
                    ) : (
                        <PageLayout
                            title="Items"
                            data={filteredItems}
                            renderItem={(item) => {
                                const avgRating = getAverageRating(item);

                                return (
                                    <Card key={item.item_id} className="box-border flex flex-row items-center justify-between gap-1 p-2">
                                        {/* 🖼 Square Image Wrapper */}
                                        <div className="flex w-1/4 shrink-0 p-0 m-0.5">
                                            <Img src={item.thumbnail} alt={item.name} className="size-24 rounded-md object-cover" />
                                        </div>

                                        {/* 📌 Content - Shrink Title */}
                                        <div className="flex w-auto m-0 p-0">
                                            <CardContent className="p-0 flex flex-col h-full space-y-1">
                                                <Link to={`/items/${item.item_id}`} className="font-semibold text-left text-sm truncate-ellipsis">
                                                    {item.name}
                                                </Link>

                                                <div className="text-xs text-muted-foreground flex items-center justify-self-start w-full gap-1">
                                                    {avgRating ? (
                                                        <Link to={`/reviews?item_id=${item.item_id}`} className="text-xs text-primary">
                                                            ⭐ {avgRating} / 5
                                                        </Link>
                                                    ) : (
                                                        "No reviews"
                                                    )}
                                                </div>
                                            </CardContent>
                                        </div>
                                        <div className="flex w-auto m-0 p-0 box-border">

                                            {/* 🛒 Button - Same padding as image border */}
                                            <AddToCartButton item={item} className="" />
                                        </div>

                                    </Card>


                                );
                            }}
                            entity="items"
                        />
                    )}
                </>
            )}

            {/* Only Show Related Items if Available */}
            {relatedItems.length > 0 && (
                <RelatedItems relatedItems={relatedItems} useCarousel={true} showAddToCart={true} />
            )}
        </div>
    );
};

export default ItemsPage;
