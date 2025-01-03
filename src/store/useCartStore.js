import { create } from "zustand";
import { useLoansStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Failed to load cart from storage:", error);
        return [];
    }
};

// ✅ Load checkout details from localStorage
const loadCheckoutDetails = () => {
    return {
        startDate: localStorage.getItem("startDate") || "",
        endDate: localStorage.getItem("endDate") || "",
        selectedShop: localStorage.getItem("selectedShop")
            ? Number(localStorage.getItem("selectedShop"))
            : null, // Ensure it's a number
    };
};

// ✅ Zustand store
export const useCartStore = create((set, get) => ({
    cart: loadCartFromStorage(),
    ...loadCheckoutDetails(),

    // 🏪 Get a specific cart item
    getCartItem: (itemId) => get().cart.find(item => item.item_id === itemId),

    // 🛒 Get total items in cart
    getTotalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

    // ➕ Add item to cart (persisted)
    addToCart: (item) => {
        set((state) => {
            const existingItem = state.cart.find(cartItem => cartItem.item_id === item.item_id);
            let updatedCart;

            if (existingItem) {
                updatedCart = state.cart.map(cartItem =>
                    cartItem.item_id === item.item_id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                updatedCart = [...state.cart, { ...item, quantity: 1 }];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        });
    },

    // 🔄 Update cart item quantity
    updateCartItem: (itemId, quantity) => {
        if (quantity < 1) return; // Prevent invalid quantity
        set((state) => {
            const updatedCart = state.cart.map(cartItem =>
                cartItem.item_id === itemId ? { ...cartItem, quantity } : cartItem
            );

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        });
    },

    // ❌ Remove item from cart
    removeFromCart: (itemId) => {
        set((state) => {
            const updatedCart = state.cart.filter(cartItem => cartItem.item_id !== itemId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        });
    },

    // 🚮 **Clear Cart**
    clearCart: () => {
        localStorage.removeItem("cart");
        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");
        localStorage.removeItem("selectedShop");
        set({ cart: [], startDate: "", endDate: "", selectedShop: null });
    },

    // 🏬 Set selected shop for pickup (persisted)
    setSelectedShop: (shopId) => {
        if (!shopId) return;
        localStorage.setItem("selectedShop", shopId);
        set({ selectedShop: Number(shopId) });
    },

    // 📆 Set loan date range (persisted)
    setStartDate: (date) => {
        if (!date) return;
        localStorage.setItem("startDate", date);
        set((state) => ({
            startDate: date,
            endDate: state.endDate && state.endDate < date ? date : state.endDate,
        }));
    },

    setEndDate: (date) => {
        if (!date) return;
        localStorage.setItem("endDate", date);
        set((state) => ({
            endDate: date,
            startDate: state.startDate && state.startDate > date ? date : state.startDate,
        }));
    },

    clearDates: () => {
        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");
        set({ startDate: "", endDate: "" });
    },

    // ✅ Handle Checkout
    checkout: () => {
        const authUser = useAuthStore.getState().authUser;
        if (!authUser) {
            alert("You must be logged in to proceed to checkout.");
            return false;
        }

        const { cart, startDate, endDate, selectedShop } = get();
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return false;
        }
        if (!startDate || !endDate) {
            alert("Please select a loan period.");
            return false;
        }
        if (!selectedShop) {
            alert("Please select a pickup shop.");
            return false;
        }

        // ✅ Save loan in Zustand
        const newLoan = {
            loan_id: Date.now(),
            user_id: authUser.user_id,
            item_id: cart.map(item => item.item_id),
            shop_id: selectedShop,
            date_start: startDate,
            date_end: endDate,
            status: "Pending",
        };

        // Check if `add` function exists before calling it
        const loansStore = useLoansStore.getState();
        if (typeof loansStore.add === "function") {
            loansStore.add(newLoan);
            alert("Checkout successful! Your loan request has been created.");
        } else {
            console.error("useLoansStore.add function is missing!");
        }

        // ✅ Clear cart, dates, and shop selection
        get().clearCart();

        return newLoan; // Return new loan if needed
    },
}));
