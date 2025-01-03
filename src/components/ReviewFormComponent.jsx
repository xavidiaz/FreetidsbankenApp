import { useState } from "react";
import { useReviewsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";

const ReviewFormComponent = ({ itemId }) => {
    const authUser = useAuthStore((state) => state.authUser);
    const addReview = useReviewsStore((state) => state.add); // ✅ Use the generic `add` function

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!authUser) {
            alert("You must be logged in to leave a review.");
            return;
        }

        if (comment.trim() === "") {
            alert("Comment cannot be empty.");
            return;
        }

        const newReview = {
            review_id: Date.now(),
            user_id: authUser.user_id,
            item_id: Number(itemId),
            rating: Number(rating),
            comment: comment.trim(),
            date: new Date().toISOString().split("T")[0],
        };

        addReview(newReview); // ✅ Call `add` from `useReviewsStore`
        setRating(5);
        setComment("");
        alert("Review submitted successfully!");
    };

    return authUser ? (
        <div>
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Comment:
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    ) : (
        <p><strong>Login to leave a review.</strong></p>
    );
};

export default ReviewFormComponent;
