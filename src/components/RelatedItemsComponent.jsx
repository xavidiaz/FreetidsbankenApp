import { useItemsStore } from "@/store/useFreetidsbanken";
import { useCartStore } from "@/store/useCartStore";
import { useCategoriesStore } from "@/store/useFreetidsbanken";
import { Link } from "react-router-dom";

const RelatedItemsComponent = () => {
    const itemsStore = useItemsStore();
    const cartStore = useCartStore();
    const categoriesStore = useCategoriesStore();

    const cartItems = cartStore.cart;

    if (cartItems.length === 0) return null; // If cart is empty, hide related items

    // 🔹 Get unique category IDs from cart items
    const cartCategories = [...new Set(cartItems.map(item => item.category_id))];

    // 🔹 Find all items related to those categories, but exclude those already in the cart
    const relatedItems = itemsStore.getAll().filter(
        item => cartCategories.includes(item.category_id) &&
            !cartItems.some(cartItem => cartItem.item_id === item.item_id) // Exclude cart items
    );

    // 🔹 Group related items by category
    const relatedItemsByCategory = cartCategories.reduce((acc, categoryId) => {
        const categoryItems = relatedItems.filter(item => item.category_id === categoryId);
        if (categoryItems.length > 0) {
            acc[categoryId] = categoryItems;
        }
        return acc;
    }, {});

    return (
        <div>
            <h2>Related Items</h2>
            {Object.keys(relatedItemsByCategory).length > 0 ? (
                Object.keys(relatedItemsByCategory).map(categoryId => {
                    const category = categoriesStore.getById(Number(categoryId));

                    return (
                        <div key={categoryId} style={{ marginBottom: "20px" }}>
                            <h3>{category ? category.name : "Unknown Category"}</h3>
                            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {relatedItemsByCategory[categoryId].map((item) => (
                                    <li key={item.item_id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: "5px" }} />
                                        <Link to={`/items/${item.item_id}`} style={{ fontWeight: "bold", textDecoration: "none" }}>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })
            ) : (
                <p>No related items available.</p>
            )}
        </div>
    );
};

export default RelatedItemsComponent;
