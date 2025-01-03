import { useParams } from 'react-router-dom';
import { useReviewsStore, useUsersStore, useItemsStore } from '@/store/useFreetidsbanken';

const ReviewDetailPage = () => {
    const { id } = useParams();
    const reviewsStore = useReviewsStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();

    const review = reviewsStore.getById(Number(id));
    if (!review) {
        return <h1>Review not found</h1>;
    }

    const user = usersStore.getById(review.user_id);
    const item = itemsStore.getById(review.item_id);

    return (
        <div>
            <h1>Review #{review.review_id}</h1>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Rating:</strong> {review.rating} / 5</p>
            <p><strong>Reviewed by:</strong> {user ? user.name : 'Unknown User'}</p>
            <p><strong>Item:</strong> {item ? item.name : 'Unknown Item'}</p>
            <p><strong>Date:</strong> {review.date}</p>
        </div>
    );
};

export default ReviewDetailPage;