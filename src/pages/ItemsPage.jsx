import { useItemsStore, useReviewsStore } from '@/store/useFreetidsbanken';
import { useCartStore } from '@/store/useCartStore';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import { Link } from 'react-router-dom';

const ItemsPage = () => {
    const itemsStore = useItemsStore();
    const reviewsStore = useReviewsStore();
    const cartStore = useCartStore();

    const getAverageRating = (item) => {
        if (!item.reviews || item.reviews.length === 0) return "No reviews";
        const reviewRatings = item.reviews.map(reviewId => {
            const review = reviewsStore.getById(reviewId);
            return review ? review.rating : null;
        }).filter(rating => rating !== null);

        if (reviewRatings.length === 0) return "No reviews";
        const avgRating = reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length;
        return avgRating.toFixed(1);
    };

    return (
        <>
            <FilterInputComponent placeholder="Search Items..." store={useItemsStore} filterKey="name" />
            <PageLayout
                title="Items"
                data={itemsStore.getFiltered()}
                renderItem={(item) => (
                    <div key={item.item_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                        <div>
                            <Link to={`/items/${item.item_id}`} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                {item.name}
                            </Link>
                            <p style={{ margin: 0, fontSize: '0.9em' }}>⭐ {getAverageRating(item)}</p>
                        </div>
                        <button onClick={() => cartStore.addToCart(item)}>Add to Cart</button>
                    </div>
                )}
                entity="items"
            />

        </>
    );
};

export default ItemsPage;
