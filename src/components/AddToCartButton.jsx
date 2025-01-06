import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddToCartButton = ({ item }) => {
    const cartStore = useCartStore();
    const cartItem = cartStore.getCartItem ? cartStore.getCartItem(item.item_id) : null;

    const [quantity, setQuantity] = useState(1);
    const [inCart, setInCart] = useState(false);

    // ✅ Ensure hydration-safe state initialization
    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity);
            setInCart(true);
        }
    }, [cartItem]);

    const handleAddToCart = () => {
        cartStore.addToCart({ ...item, quantity });
        setInCart(true);
    };

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        cartStore.updateCartItem(item.item_id, newQuantity);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            cartStore.updateCartItem(item.item_id, newQuantity);
        } else {
            handleRemoveFromCart();
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
                <div className='flex flex-col items-center gap-1'>
                    <div className='flex flex-row items-center gap-0'>
                        <Button
                            variant="destructive"
                            className="size-8 border-2"
                            onClick={handleDecrease}
                        >
                            -
                        </Button>
                        <Input
                            className="size-8 p-0 text-center"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))} // ✅ Added controlled input handler
                        />
                        <Button
                            variant="primary"
                            className="size-8 border-2 border-primary text-primary"
                            onClick={handleIncrease}
                        >
                            +
                        </Button>
                    </div>
                    <Button
                        className="h-8 w-24 border-destructive text-destructive hover:bg-destructive/10"
                        variant="outline"
                        onClick={handleRemoveFromCart}
                    >
                        🗑️
                    </Button>
                </div>
            ) : (
                <Button
                    className="h-8 w-24"
                    onClick={handleAddToCart}
                >
                    Reserve
                </Button>
            )}
        </div>
    );
};

// ✅ Add prop validation to avoid missing `item.item_id`
AddToCartButton.propTypes = {
    item: PropTypes.shape({
        item_id: PropTypes.number.isRequired, // Ensure item_id exists
        name: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
    }).isRequired,
};

export default AddToCartButton;
