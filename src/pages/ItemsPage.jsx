import { useState, useEffect } from 'react';
import { useItemsStore, useCategoriesStore, useReviewsStore } from '@/store/useFreetidsbanken';
import { useCartStore } from '@/store/useCartStore';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import AddToCartButton from '@/components/AddToCartButton';
import RelatedItemsComponent from '@/components/RelatedItemsComponent';
import { Link } from 'react-router-dom';
import { SkeletonPlaceholder } from '@/components/SkeletonPlaceholder';
import Img from '@/components/Img';
import { Card, CardContent } from '@/components/ui/card'; // ✅ Import ShadCN Card

const ItemsPage = () => {
    const itemsStore = useItemsStore();
    const categoriesStore = useCategoriesStore();
    const reviewsStore = useReviewsStore();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, []);

    const filteredItems = itemsStore.getAll().filter(item => {
        const matchesCategory = selectedCategory ? item.category_id === Number(selectedCategory) : true;
        const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    const availableCategories = categoriesStore.getAll().filter(category =>
        itemsStore.getAll().some(item =>
            item.category_id === category.category_id &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const getAverageRating = (item) => {
        if (!item.reviews || item.reviews.length === 0) return null;

        const reviewRatings = item.reviews.map(reviewId => {
            const review = reviewsStore.getById(reviewId);
            return review ? review.rating : null;
        }).filter(rating => rating !== null);

        if (reviewRatings.length === 0) return null;
        const avgRating = reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length;
        return avgRating.toFixed(1);
    };

    return (
        <>
            <FilterInputComponent placeholder="Search Items..." onSearch={setSearchTerm} />

            {availableCategories.length > 0 && (
                <div className="mb-4">
                    <label className="font-semibold">Filter by Category:</label>
                    <select
                        className="border border-border rounded-md p-2 w-full"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {availableCategories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <SkeletonPlaceholder.Item key={index} />
                    ))}
                </div>
            ) : (
                <>
                    {filteredItems.length === 0 ? (
                        <p className="text-center text-lg mt-4">⚠️ No items found.</p>
                    ) : (
                        <PageLayout
                            title="Items"
                            data={filteredItems}
                            renderItem={(item) => {
                                const avgRating = getAverageRating(item);

                                return (
                                    <Card key={item.item_id} className="flex items-center gap-3 p-4">
                                        <Img src={item.thumbnail} alt={item.name} className="w-1/6 rounded-md" />

                                        <CardContent className="p-2 pt-0 flex flex-col w-5/6 h-full justify-between">


                                            <Link to={`/items/${item.item_id}`}
                                                className="font-semibold text-lg">
                                                {item.name}
                                            </Link>

                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                {avgRating ? (
                                                    <>
                                                        <Link to={`/reviews?item_id=${item.item_id}`} className="ml-2 text-sm text-primary">
                                                            ⭐ {avgRating} / 5
                                                        </Link>
                                                    </>
                                                ) : (
                                                    "No reviews"
                                                )}
                                            </div>
                                        </CardContent>

                                        <AddToCartButton item={item} />
                                    </Card>
                                );
                            }}
                            entity="items"
                        />
                    )}
                </>
            )}

            <RelatedItemsComponent />
        </>
    );
};

export default ItemsPage;
