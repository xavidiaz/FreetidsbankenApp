import { useCartStore } from "@/store/useCartStore";
import { useLoansStore, useShopsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";

const CartPage = () => {
    const cartStore = useCartStore();
    const loansStore = useLoansStore();
    const shopsStore = useShopsStore();
    const authUser = useAuthStore().authUser;
    const totalItems = cartStore.getTotalItems();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!authUser) {
            alert("You must be logged in to proceed.");
            return;
        }
        if (totalItems === 0) {
            alert("Your cart is empty.");
            return;
        }
        if (!cartStore.startDate || !cartStore.endDate) {
            alert("Please select a loan period.");
            return;
        }
        if (!cartStore.selectedShop) {
            alert("Please select a pickup shop.");
            return;
        }

        // ✅ Create Loan Immediately
        const newLoan = {
            loan_id: Date.now(),
            user_id: authUser.user_id,
            item_id: cartStore.cart.map(item => item.item_id),
            shop_id: cartStore.selectedShop,
            date_start: cartStore.startDate,
            date_end: cartStore.endDate,
            status: "Confirmed",
        };

        loansStore.add(newLoan);

        // ✅ Clear Cart
        cartStore.clearCart();

        // ✅ Redirect to Checkout Success Page with loan details
        navigate(`/checkout-success/${newLoan.loan_id}`);
    };

    return (
        <div>
            <h1>Cart</h1>
            {totalItems > 0 ? (
                <>
                    <ul>
                        {cartStore.cart.map((item) => (
                            <li key={item.item_id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img src={item.thumbnail} alt={item.name} width={50} height={50} />
                                {item.name} <AddToCartButton item={item} />
                            </li>
                        ))}
                    </ul>

                    <h2>Select Pickup Location</h2>
                    <select onChange={(e) => cartStore.setSelectedShop(Number(e.target.value))} value={cartStore.selectedShop || ""}>
                        <option value="" disabled>Select a shop</option>
                        {shopsStore.getAll().map((shop) => (
                            <option key={shop.shop_id} value={shop.shop_id}>
                                {shop.name}
                            </option>
                        ))}
                    </select>

                    <h2>Select Loan Period</h2>
                    <label>
                        Start Date:
                        <input type="date" value={cartStore.startDate} onChange={(e) => cartStore.setStartDate(e.target.value)} />
                    </label>
                    <label>
                        End Date:
                        <input type="date" value={cartStore.endDate} onChange={(e) => cartStore.setEndDate(e.target.value)} />
                    </label>

                    <button onClick={handleCheckout}>Proceed to Checkout</button>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}

            <br />
            <Link to="/items">Continue Browsing</Link>
        </div>
    );
};

export default CartPage;
