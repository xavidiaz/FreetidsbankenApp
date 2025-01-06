import { useParams, Link } from "react-router-dom";
import { useUsersStore, useShopsStore, useLoansStore, useReviewsStore } from "@/store/useFreetidsbanken";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserProfileCard = ({ user, preferredShop }) => (
    <Card>
        <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20">
                <AvatarImage src={user.profile_image} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="text-muted-foreground">User Profile Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <div>
                <strong>Email:</strong> <span>{user.email}</span>
            </div>
            <div>
                <strong>Phone:</strong> <span>{user.phone || "Not provided"}</span>
            </div>

            <p>
                <strong>Preferred Shop:</strong>{" "}
                {preferredShop ? (
                    <Badge variant="outline">{preferredShop.name}</Badge>
                ) : (
                    <span className="text-muted-foreground">Not set</span>
                )}
            </p>
        </CardContent>
    </Card>
);

const LoansHistoryCard = ({ userLoans }) => (
    <Card>
        <CardHeader>
            <CardTitle>Loans History</CardTitle>
            <CardDescription>Previous loan records</CardDescription>
        </CardHeader>
        <CardContent>
            {userLoans.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Loan ID</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userLoans.map((loan) => (
                            <TableRow key={loan.loan_id}>
                                <TableCell>
                                    <Link to={`/loans/${loan.loan_id}`} className="underline text-primary">
                                        #{loan.loan_id}
                                    </Link>
                                </TableCell>
                                <TableCell>{loan.item_id || "Unknown"}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={loan.status === "Active" ? "default" : "outline"}
                                        className={loan.status === "Completed" ? "bg-green-500 text-white" : ""}
                                    >
                                        {loan.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-muted-foreground text-center py-4">No loan history available.</p>
            )}
        </CardContent>
    </Card>
);

const ReviewsCard = ({ userReviews }) => (
    <Card>
        <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>User feedback & ratings</CardDescription>
        </CardHeader>
        <CardContent>
            {userReviews.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Review ID</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userReviews.map((review) => (
                            <TableRow key={review.review_id}>
                                <TableCell>
                                    <Link to={`/reviews/${review.review_id}`} className="underline text-primary">
                                        #{review.review_id}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-yellow-500 text-black">
                                        {review.rating} ★
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {review.comment ? (
                                        <span className="line-clamp-2">{review.comment}</span>
                                    ) : (
                                        <span className="text-muted-foreground">No comment</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-muted-foreground text-center py-4">No reviews available.</p>
            )}
        </CardContent>
    </Card>
);

const UserDetailPage = () => {
    const { id } = useParams();
    const usersStore = useUsersStore();
    const shopsStore = useShopsStore();
    const loansStore = useLoansStore();
    const reviewsStore = useReviewsStore();

    const user = usersStore.getById(Number(id));
    if (!user) {
        return <h1 className="text-center text-red-500 text-xl">User not found</h1>;
    }

    const preferredShop = shopsStore.getById(user.preferred_shop);
    const userLoans = loansStore.getAll().filter((loan) => loan.user_id === user.user_id);
    const userReviews = reviewsStore.getAll().filter((review) => review.user_id === user.user_id);

    return (
        <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
            <UserProfileCard user={user} preferredShop={preferredShop} />
            <LoansHistoryCard userLoans={userLoans} />
            <ReviewsCard userReviews={userReviews} />
        </div>
    );
};

export default UserDetailPage;
