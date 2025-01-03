import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    cart: [], // Stores added items

    // 🔹 Add item to cart (if exists, increase quantity)
    addToCart: (item) => {
        set(state => {
            const existingItem = state.cart.find(i => i.item_id === item.item_id);
            if (existingItem) {
                return { cart: state.cart.map(i => i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i) };
            }
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
        });
    },

    // 🔹 Remove item completely from cart
    removeFromCart: (item_id) => {
        set(state => ({
            cart: state.cart.filter(i => i.item_id !== item_id)
        }));
    },

    // 🔹 Update quantity
    updateQuantity: (item_id, quantity) => {
        set(state => ({
            cart: state.cart.map(i => i.item_id === item_id ? { ...i, quantity } : i)
        }));
    },

    // 🔹 Clear cart (after checkout)
    clearCart: () => set({ cart: [] }),

    // 🔹 Get total items
    getTotalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

    // 🔹 Get total price (if items have a price)
    getTotalPrice: () => get().cart.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0)
}));
