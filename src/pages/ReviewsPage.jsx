import { useState, useEffect } from "react";
import { useReviewsStore, useItemsStore } from "@/store/useFreetidsbanken";
import { Link, useSearchParams } from "react-router-dom";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";

const ReviewsPage = () => {
    const reviewsStore = useReviewsStore();
    const itemsStore = useItemsStore();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get("item_id");

    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            let filteredReviews = reviewsStore.getFiltered();
            if (itemId) {
                filteredReviews = filteredReviews.filter(review => review.item_id === Number(itemId));
            }
            setReviews(filteredReviews);
            setIsLoading(false);
        }, 500); // Simulate loading delay

        return () => clearTimeout(timer);
    }, [itemId, reviewsStore]);

    // ✅ Group reviews by item
    const reviewsByItem = reviews.reduce((acc, review) => {
        if (!acc[review.item_id]) {
            acc[review.item_id] = [];
        }
        acc[review.item_id].push(review);
        return acc;
    }, {});

    return (
        <>
            <h1>Reviews</h1>

            {isLoading ? (
                <SkeletonPlaceholder.Review />
            ) : Object.keys(reviewsByItem).length === 0 ? (
                <p className="text-center text-lg mt-4">⚠️ No reviews found.</p>
            ) : (
                Object.keys(reviewsByItem).map((itemId) => {
                    const item = itemsStore.getById(Number(itemId));
                    return (
                        <div key={itemId} className="mb-6">
                            {/* ✅ Show item name & thumbnail only once per item */}
                            {item && (
                                <div className="flex items-center gap-4">
                                    <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-md" />
                                    <h2>
                                        <Link to={`/items/${itemId}`} className="font-semibold text-lg">
                                            {item.name}
                                        </Link>
                                    </h2>
                                </div>
                            )}

                            {/* 🔹 List all reviews for this item */}
                            <ul className="mt-2 space-y-2">
                                {reviewsByItem[itemId].map((review) => (
                                    <li key={review.review_id} className="border-b pb-2">
                                        <Link to={`/reviews/${review.review_id}`} className="font-medium">
                                            Review #{review.review_id}
                                        </Link>: {review.comment} (⭐ {review.rating})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </>
    );
};

export default ReviewsPage;
