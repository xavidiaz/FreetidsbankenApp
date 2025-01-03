import { useCartStore } from '@/store/useCartStore';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const cartStore = useCartStore();

    return (
        <div>
            <h1>Your Cart 🛒</h1>
            {cartStore.cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {cartStore.cart.map((item) => (
                            <li key={item.item_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                                <Link to={`/items/${item.item_id}`} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                    {item.name}
                                </Link>
                                <span>Quantity: </span>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => cartStore.updateQuantity(item.item_id, parseInt(e.target.value))}
                                    style={{ width: '50px' }}
                                />
                                <button onClick={() => cartStore.removeFromCart(item.item_id)}>❌ Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h2>Total Items: {cartStore.getTotalItems()}</h2>

                    <button onClick={() => cartStore.clearCart()}>Checkout</button>
                </>
            )}
        </div>
    );
};

export default CartPage;
