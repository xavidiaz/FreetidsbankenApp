import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReviewsStore, useUsersStore, useItemsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";

const ReviewDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const reviewsStore = useReviewsStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();
    const authUser = useAuthStore(state => state.authUser);

    // ✅ Hooks should ALWAYS be at the top!
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState("");
    const [updatedRating, setUpdatedRating] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            const foundReview = reviewsStore.getById(Number(id));
            if (foundReview) {
                setReview(foundReview);
                setUpdatedComment(foundReview.comment);
                setUpdatedRating(foundReview.rating);
            }
            setIsLoading(false);
        }, 500); // Simulated loading delay

        return () => clearTimeout(timer);
    }, [id, reviewsStore]);

    if (isLoading) return <SkeletonPlaceholder.Review />;
    if (!review) return <h1 className="text-center text-lg">⚠️ Review not found.</h1>;

    const user = usersStore.getById(review.user_id);
    const item = itemsStore.getById(review.item_id);
    const isOwner = authUser && review.user_id === authUser.user_id;

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

        if (window.confirm("Are you sure you want to delete this review?")) {
            reviewsStore.delete(review.review_id);
            alert("Review deleted successfully!");
            navigate("/reviews");
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-4">
            <h1 className="text-xl font-semibold">Review #{review.review_id}</h1>

            {editing ? (
                <div className="space-y-4">
                    <label className="block">
                        <span className="font-medium">Rating:</span>
                        <select
                            value={updatedRating}
                            onChange={(e) => setUpdatedRating(e.target.value)}
                            className="w-full border p-2 rounded-md"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="font-medium">Comment:</span>
                        <textarea
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            className="w-full border p-2 rounded-md"
                        />
                    </label>
                    <div className="flex gap-2">
                        <button className="btn-primary" onClick={handleUpdate}>Save</button>
                        <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <p><strong>Comment:</strong> {review.comment}</p>
                    <p><strong>Rating:</strong> {review.rating} / 5</p>
                    <p><strong>Reviewed by:</strong> {user ? user.name : "Unknown User"}</p>
                    <p><strong>Date:</strong> {review.date}</p>

                    {/* Display item with thumbnail */}
                    {item && (
                        <div className="flex items-center gap-4 mt-4">
                            <img src={item.thumbnail} alt={item.name} className="w-16 h-16 rounded-md" />
                            <p className="font-semibold">Item: {item.name}</p>
                        </div>
                    )}

                    {/* Show Edit/Delete buttons only for review owner */}
                    {isOwner && (
                        <div className="flex gap-2 mt-4">
                            <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
                            <button className="btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewDetailPage;
