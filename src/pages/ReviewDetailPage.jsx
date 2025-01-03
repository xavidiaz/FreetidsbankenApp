import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReviewsStore, useUsersStore, useItemsStore } from '@/store/useFreetidsbanken';
import { useAuthStore } from '@/store/useAuthStore';

const ReviewDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const reviewsStore = useReviewsStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();
    const authUser = useAuthStore(state => state.authUser);

    const review = reviewsStore.getById(Number(id));
    if (!review) {
        return <h1>Review not found</h1>;
    }

    const user = usersStore.getById(review.user_id);
    const item = itemsStore.getById(review.item_id);

    // 🔹 Only allow review owner to edit/delete
    const isOwner = authUser && review.user_id === authUser.user_id;

    // 🔹 Manage Edit State
    const [editing, setEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(review.comment);
    const [updatedRating, setUpdatedRating] = useState(review.rating);

    // ✅ Update Review Handler
    const handleUpdate = () => {
        if (!isOwner) {
            alert("You can only update your own reviews.");
            return;
        }

        reviewsStore.update(review.review_id, {
            comment: updatedComment,
            rating: Number(updatedRating),
        });

        setEditing(false);
        alert("Review updated successfully!");
    };

    // ❌ Delete Review Handler
    const handleDelete = () => {
        if (!isOwner) {
            alert("You can only delete your own reviews.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (confirmDelete) {
            reviewsStore.delete(review.review_id);
            alert("Review deleted successfully!");
            navigate('/reviews'); // Redirect to reviews list
        }
    };

    return (
        <div>
            <h1>Review #{review.review_id}</h1>
            {editing ? (
                <div>
                    <label>
                        <strong>Rating:</strong>
                        <select value={updatedRating} onChange={(e) => setUpdatedRating(e.target.value)}>
                            {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                    </label>
                    <br />
                    <label>
                        <strong>Comment:</strong>
                        <textarea
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                        />
                    </label>
                    <br />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <p><strong>Comment:</strong> {review.comment}</p>
                    <p><strong>Rating:</strong> {review.rating} / 5</p>
                    <p><strong>Reviewed by:</strong> {user ? user.name : 'Unknown User'}</p>
                    <p><strong>Item:</strong> {item ? item.name : 'Unknown Item'}</p>
                    <p><strong>Date:</strong> {review.date}</p>

                    {/* Show Edit/Delete buttons only for review owner */}
                    {isOwner && (
                        <>
                            <button onClick={() => setEditing(true)}>Edit</button>
                            <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewDetailPage;
