import { useReviewsStore, useItemsStore } from '@/store/useFreetidsbanken';
import PageLayout from '@/Layouts/PageLayout';
import { Link, useSearchParams } from 'react-router-dom';

const ReviewsPage = () => {
    const reviewsStore = useReviewsStore();
    const itemsStore = useItemsStore();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get("item_id");

    // ✅ Filter reviews based on query param
    let reviews = reviewsStore.getFiltered();
    if (itemId) {
        reviews = reviews.filter(review => review.item_id === Number(itemId));
    }

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

            {Object.keys(reviewsByItem).map((itemId) => {
                const item = itemsStore.getById(Number(itemId));
                return (
                    <div key={itemId} style={{ marginBottom: "20px" }}>
                        {/* ✅ Show item name & thumbnail only once per item */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {item && (
                                <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                            )}
                            <h2>
                                <Link to={`/items/${itemId}`} style={{ textDecoration: 'none' }}>
                                    {item ? item.name : "Unknown Item"}
                                </Link>
                            </h2>
                        </div>

                        {/* 🔹 List all reviews for this item */}
                        <ul>
                            {reviewsByItem[itemId].map((review) => (
                                <li key={review.review_id}>
                                    <Link to={`/reviews/${review.review_id}`} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                        Review #{review.review_id}
                                    </Link>: {review.comment} (⭐ {review.rating})
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </>
    );
};

export default ReviewsPage;
