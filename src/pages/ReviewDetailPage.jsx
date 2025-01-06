import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReviewsStore, useUsersStore, useItemsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";

import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AlertCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Img from "@/components/Img";

const ReviewDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const reviewsStore = useReviewsStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();
    const authUser = useAuthStore((state) => state.authUser);

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
        }, 500);

        return () => clearTimeout(timer);
    }, [id, reviewsStore]);

    if (isLoading) return <SkeletonPlaceholder.Review />;
    if (!review) {
        return (
            <Card className="max-w-lg mx-auto text-center">
                <CardHeader>
                    <AlertCircle className="text-destructive w-8 h-8 mx-auto" />
                    <CardTitle>⚠️ Review Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The requested review could not be found.</p>
                    <Button className="mt-4 w-full" onClick={() => navigate("/reviews")}>Go Back</Button>
                </CardContent>
            </Card>
        );
    }

    const user = usersStore.getById(review.user_id);
    const item = itemsStore.getById(review.item_id);
    const isOwner = authUser && review.user_id === authUser.user_id;

    const handleUpdate = () => {
        if (!isOwner) {
            toast({
                title: "Permission Denied",
                description: "You can only update your own reviews.",
                variant: "destructive",
            });
            return;
        }
        reviewsStore.update(review.review_id, {
            comment: updatedComment,
            rating: Number(updatedRating),
        });
        setEditing(false);
        toast({
            title: "Review Updated",
            description: "Your review has been successfully updated.",
            variant: "success",
        });
    };

    const handleDelete = () => {
        if (!isOwner) {
            toast({
                title: "Permission Denied",
                description: "You can only delete your own reviews.",
                variant: "destructive",
            });
            return;
        }

        if (window.confirm("Are you sure you want to delete this review?")) {
            reviewsStore.delete(review.review_id);
            toast({
                title: "Review Deleted",
                description: "Your review has been successfully removed.",
                variant: "destructive",
            });
            navigate("/reviews");
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    Review #{review.review_id}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {editing ? (
                    <div className="space-y-4">
                        {/* ⭐ Rating Selection */}
                        <div>
                            <label className="block text-sm font-medium">Rating</label>
                            <Select value={updatedRating.toString()} onValueChange={(value) => setUpdatedRating(Number(value))}>
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

                        {/* ✏️ Comment Box */}
                        <div>
                            <label className="block text-sm font-medium">Comment</label>
                            <Textarea
                                value={updatedComment}
                                onChange={(e) => setUpdatedComment(e.target.value)}
                                required
                                placeholder="Update your review..."
                                className="resize-none"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <strong>Comment:</strong> <span>{review.comment}</span>
                        </div>
                        <div>
                            <strong>Rating:</strong> <span>{review.rating} / 5</span>
                        </div>
                        <div>
                            <strong>Reviewed by:</strong> <span>{user ? user.name : "Unknown User"}</span>
                        </div>
                        <div>
                            <strong>Date:</strong> <span>{review.date}</span>
                        </div>

                        {item && (
                            <div className="flex items-center gap-4 mt-4">
                                <Img src={item.thumbnail} alt={item.name} className="w-16 h-16 rounded-md" />
                                <p className="font-semibold">Item: {item.name}</p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>

            {isOwner && (
                <CardFooter className="flex gap-2">
                    {editing ? (
                        <>
                            <Button onClick={handleUpdate}>Save</Button>
                            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setEditing(true)}>Edit</Button>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
};

export default ReviewDetailPage;
