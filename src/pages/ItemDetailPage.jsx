import { useParams, Link } from "react-router-dom";
import { useItemsStore, useReviewsStore, useShopsStore, useCategoriesStore } from "@/store/useFreetidsbanken";
import ReviewFormComponent from "@/components/ReviewFormComponent";
import AddToCartButton from "@/components/AddToCartButton";

const ItemDetailPage = () => {
    const { id } = useParams();
    const itemsStore = useItemsStore();
    const reviewsStore = useReviewsStore();
    const shopsStore = useShopsStore();
    const categoriesStore = useCategoriesStore();

    const item = itemsStore.getById(Number(id));
    if (!item) {
        return <h1>Item not found</h1>;
    }

    const shop = shopsStore.getById(item.shop_id);
    const category = categoriesStore.getById(item.category_id);
    const itemReviews = item.reviews.map((reviewId) => reviewsStore.getById(reviewId)).filter(Boolean);
    const relatedItems = itemsStore.getAll().filter((i) => i.category_id === item.category_id && i.item_id !== item.item_id);

    return (
        <div>
            <h1>{item.name}</h1>
            <img src={item.thumbnail} alt={item.name} width={200} />
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Stock:</strong> {item.stock_quantity}</p>
            <p><strong>Category:</strong> {category ? category.name : "Unknown Category"}</p>
            <p><strong>Shop:</strong> {shop ? shop.name : "Unknown Shop"}</p>

            <h2>Gallery</h2>
            <div>
                {item.gallery.map((image, index) => (
                    <img key={index} src={image} alt={`Gallery ${index + 1}`} width={150} />
                ))}
            </div>

            <h2>Reserved Dates</h2>
            {item.dates_reserved.length > 0 ? (
                <ul>
                    {item.dates_reserved.map((dates, index) => (
                        <li key={index}>{dates[0]} to {dates[1]}</li>
                    ))}
                </ul>
            ) : (
                <p>No reservations.</p>
            )}

            <h2>Add to Cart</h2>
            <AddToCartButton item={item} />

            <h2>Reviews</h2>
            {itemReviews.length > 0 ? (
                <ul>
                    {itemReviews.map((review) => (
                        <li key={review.review_id}>
                            <strong>Rating:</strong> {review.rating} - {review.comment}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews yet.</p>
            )}

            {/* 🔹 Add Review Form */}
            <ReviewFormComponent itemId={id} />

            <h2>Similar Items</h2>
            {relatedItems.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {relatedItems.map((relatedItem) => (
                        <li key={relatedItem.item_id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <img src={relatedItem.thumbnail} alt={relatedItem.name} width={50} height={50} style={{ borderRadius: "5px" }} />
                            <Link to={`/items/${relatedItem.item_id}`} style={{ fontWeight: "bold", textDecoration: "none" }}>
                                {relatedItem.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No related items found.</p>
            )}
        </div>
    );
};

export default ItemDetailPage;
