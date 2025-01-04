import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
                <>

                    <div className='flex flex-col items-center gap-1'>
                        <div
                            className='flex flex-row items-center gap-0'>
                            <Button
                                variant="destructive"
                                className="size-8 border-2"
                                onClick={handleDecrease}>-</Button>
                            <Input className="size-8 p-0 text-center" value={quantity} />
                            <Button
                                variant="primary"
                                className="size-8 border-2 border-primary text-primary "
                                onClick={handleIncrease}>+</Button>
                        </div>
                        <Button
                            className="h-8 w-24 border-destructive text-destructive hover:bg-destructive/10"
                            variant="outline"
                            onClick={handleRemoveFromCart}>
                            🗑️
                        </Button>
                    </div>
                </>
            ) : (
                <Button
                    className="h-8 w-24"
                    onClick={handleAddToCart}>Reserve</Button>
            )}
        </div>
    );
};

export default AddToCartButton;
