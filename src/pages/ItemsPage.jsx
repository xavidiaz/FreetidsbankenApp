import { useState } from 'react';
import { useItemsStore, useCategoriesStore, useReviewsStore } from '@/store/useFreetidsbanken';
import { useCartStore } from '@/store/useCartStore';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import AddToCartButton from '@/components/AddToCartButton';
import RelatedItemsComponent from '@/components/RelatedItemsComponent';
import { Link } from 'react-router-dom';

const ItemsPage = () => {
    const itemsStore = useItemsStore();
    const categoriesStore = useCategoriesStore();
    const reviewsStore = useReviewsStore();
    const cartStore = useCartStore();

    // 🔹 Local State for Search & Category Filter
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Get filtered items based on category **and** search term
    const filteredItems = itemsStore.getAll().filter(item => {
        const matchesCategory = selectedCategory ? item.category_id === Number(selectedCategory) : true;
        const matchesSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    // ✅ Get categories that contain at least one item after filtering
    const availableCategories = categoriesStore.getAll().filter(category =>
        itemsStore.getAll().some(item =>
            item.category_id === category.category_id &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // ✅ Function to get average rating for an item
    const getAverageRating = (item) => {
        if (!item.reviews || item.reviews.length === 0) return null;

        const reviewRatings = item.reviews.map(reviewId => {
            const review = reviewsStore.getById(reviewId);
            return review ? review.rating : null;
        }).filter(rating => rating !== null);

        if (reviewRatings.length === 0) return null;
        const avgRating = reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length;
        return avgRating.toFixed(1);
    };

    return (
        <>
            {/* 🔹 Search Input - Uses Local State Filtering */}
            <FilterInputComponent placeholder="Search Items..." onSearch={setSearchTerm} />

            {/* 🔹 Category Filter Dropdown (Only Show Available Categories) */}
            {availableCategories.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                    <label><strong>Filter by Category: </strong></label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {availableCategories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* 🔹 Show "No items found" when there are no results */}
            {filteredItems.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "1.2em", marginTop: "20px" }}>⚠️ No items found.</p>
            ) : (
                <PageLayout
                    title="Items"
                    data={filteredItems}
                    renderItem={(item) => {
                        const avgRating = getAverageRating(item);

                        return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                                <div>
                                    <Link to={`/items/${item.item_id}`} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                        {item.name}
                                    </Link>
                                    <p style={{ margin: 0, fontSize: '0.9em' }}>
                                        {avgRating ? (
                                            <>
                                                ⭐ {avgRating} / 5
                                                {" "}
                                                <Link to={`/reviews?item_id=${item.item_id}`} style={{ fontSize: '0.8em', marginLeft: '5px' }}>
                                                    View Reviews
                                                </Link>
                                            </>
                                        ) : (
                                            "No reviews"
                                        )}
                                    </p>
                                </div>
                                <AddToCartButton item={item} />
                            </div>
                        );
                    }}
                    entity="items"
                />

            )}
            {/* ✅ Show Related Items if cart has items */}
            <RelatedItemsComponent />
        </>
    );
};

export default ItemsPage;
