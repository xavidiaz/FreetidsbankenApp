import { useParams, Link } from 'react-router-dom';
import { useUsersStore, useShopsStore, useLoansStore, useReviewsStore } from '@/store/useFreetidsbanken';

const UserDetailPage = () => {
    const { id } = useParams();
    const usersStore = useUsersStore();
    const shopsStore = useShopsStore();
    const loansStore = useLoansStore();
    const reviewsStore = useReviewsStore();

    // ✅ Fetch fresh data every time the component renders
    const user = usersStore.getById(Number(id));
    if (!user) {
        return <h1>User not found</h1>;
    }

    const preferredShop = shopsStore.getById(user.preferred_shop);
    const userLoans = loansStore.getAll().filter(loan => loan.user_id === user.user_id);
    const userReviews = reviewsStore.getAll().filter(review => review.user_id === user.user_id);

    return (
        <div>
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <img src={user.profile_image} alt="Profile" width={100} height={100} />
            <p>Preferred Shop: {preferredShop ? preferredShop.name : 'Not set'}</p>

            <h2>Loans History</h2>
            {userLoans.length > 0 ? (
                <ul>
                    {userLoans.map((loan) => (
                        <li key={loan.loan_id}>
                            <Link to={`/loans/${loan.loan_id}`}>
                                Loan #{loan.loan_id} - Item ID: {loan.item_id} - Status: {loan.status}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No loan history available.</p>
            )}

            <h2>Reviews</h2>
            {userReviews.length > 0 ? (
                <ul>
                    {userReviews.map((review) => (
                        <li key={review.review_id}>
                            <Link to={`/reviews/${review.review_id}`}>
                                Review #{review.review_id} - Rating: {review.rating}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
};

export default UserDetailPage;
