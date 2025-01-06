import { useState } from "react";
import { useReviewsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ReviewFormComponent = ({ itemId }) => {
    const authUser = useAuthStore((state) => state.authUser);
    const addReview = useReviewsStore((state) => state.add);
    const { toast } = useToast();
    const navigate = useNavigate();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!authUser) {
            showToast("Login Required", "You must be logged in to leave a review.", "destructive");
            return;
        }

        if (comment.trim() === "") {
            showToast("Empty Comment", "Your review must include a comment.", "destructive");
            return;
        }

        const newReview = createReview(authUser.user_id, itemId, rating, comment);
        addReview(newReview);
        resetForm();

        showToast("Review Submitted 🎉", "Your review has been successfully posted.", "success");

        // ✅ Redirect to the posted review page
        navigate(`/reviews/${newReview.review_id}`);
    };

    const showToast = (title, description, variant = "default") => {
        toast({
            title,
            description,
            variant,
            className: "custom-toast", // ✅ Apply HSL background
        });
    };


    const createReview = (userId, itemId, rating, comment) => ({
        review_id: Date.now(),
        user_id: userId,
        item_id: Number(itemId),
        rating: Number(rating),
        comment: comment.trim(),
        date: new Date().toISOString().split("T")[0],
    });

    const resetForm = () => {
        setRating(5);
        setComment("");
    };

    return authUser ? (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    Leave a Review
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <RatingSelect rating={rating} setRating={setRating} />
                    <CommentBox comment={comment} setComment={setComment} />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit">Submit Review</Button>
                </CardFooter>
            </form>
        </Card>
    ) : (
        <Alert variant="destructive" className="w-full max-w-lg mx-auto">
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>You must be logged in to leave a review.</AlertDescription>
        </Alert>
    );
};

const RatingSelect = ({ rating, setRating }) => (
    <div>
        <label className="block text-sm font-medium">Rating</label>
        <Select value={rating} onValueChange={(value) => setRating(Number(value))}>
            <SelectTrigger>
                <SelectValue placeholder="Select a rating" />
            </SelectTrigger>
            <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                        {num} ⭐
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const CommentBox = ({ comment, setComment }) => (
    <div>
        <label className="block text-sm font-medium">Comment</label>
        <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Write your thoughts..."
            className="resize-none"
        />
    </div>
);

export default ReviewFormComponent;
