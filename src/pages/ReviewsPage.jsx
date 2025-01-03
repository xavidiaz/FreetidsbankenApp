import { useReviewsStore } from '@/store/useFreetidsbanken';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import { Link } from 'react-router-dom';

const ReviewsPage = () => {

    const reviewsStore = useReviewsStore();


    return (
        <>
            <FilterInputComponent placeholder="Search Reviews..." store={useReviewsStore} filterKey="comment" />
            <PageLayout
                title="Reviews"
                data={reviewsStore.getFiltered()}
                renderItem={(review) => (
                    <Link to={`/reviews/${review.review_id}`}>
                        Review #{review.review_id}: {review.comment} (Rating: {review.rating})
                    </Link>
                )}
                entity="reviews"
            />
        </>
    );
};


export default ReviewsPage;