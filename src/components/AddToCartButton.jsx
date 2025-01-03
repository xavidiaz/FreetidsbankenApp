import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

const AddToCartButton = ({ item }) => {
    const cartStore = useCartStore();
    const cartItem = cartStore.getCartItem ? cartStore.getCartItem(item.item_id) : null; // ✅ Check function existence
    const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
    const [inCart, setInCart] = useState(!!cartItem);

    const handleAddToCart = () => {
        cartStore.addToCart({ ...item, quantity });
        setInCart(true);
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
        cartStore.updateCartItem(item.item_id, quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
            cartStore.updateCartItem(item.item_id, quantity - 1);
        } else {
            handleRemoveFromCart(); // If 1, remove instead of decreasing
        }
    };

    const handleRemoveFromCart = () => {
        cartStore.removeFromCart(item.item_id);
        setInCart(false);
        setQuantity(1);
    };

    return (
        <div>
            {inCart ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={handleDecrease}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease}>+</button>
                    <button onClick={handleRemoveFromCart} style={{ background: 'red', color: 'white' }}>
                        🗑️
                    </button>
                </div>
            ) : (
                <button onClick={handleAddToCart}>Add to Cart</button>
            )}
        </div>
    );
};

export default AddToCartButton;
