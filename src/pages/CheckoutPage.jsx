import { useCartStore } from "@/store/useCartStore";
import { useLoansStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const cartStore = useCartStore();
    const loansStore = useLoansStore();
    const authUser = useAuthStore().authUser;
    const navigate = useNavigate();

    if (!authUser) {
        return <h1>You must be logged in to complete the checkout.</h1>;
    }

    const handleConfirmCheckout = () => {
        if (!cartStore.startDate || !cartStore.endDate) {
            alert("Please select a loan period.");
            return;
        }
        if (!cartStore.selectedShop) {
            alert("Please select a pickup shop.");
            return;
        }

        const newLoan = {
            loan_id: Date.now(),
            user_id: authUser.user_id,
            item_id: cartStore.cart.map(item => item.item_id),
            shop_id: cartStore.selectedShop,
            date_start: cartStore.startDate,
            date_end: cartStore.endDate,
            status: "Pending",
        };

        loansStore.add(newLoan);
        alert("Checkout complete! Your loan request has been submitted.");

        // Clear cart after checkout
        cartStore.clearCart();
        navigate("/loans");
    };

    return (
        <div>
            <h1>Checkout</h1>
            <div>
                <strong>Pickup Shop:</strong> <span>{cartStore.selectedShop}</span>
            </div>
            <div>
                <strong>Loan Period:</strong> <span>{cartStore.startDate} - {cartStore.endDate}</span>
            </div>


            <h2>Items in Cart</h2>
            <ul>
                {cartStore.cart.map((item) => (
                    <li key={item.item_id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={item.thumbnail} alt={item.name} width={50} height={50} />
                        {item.name} - Quantity: {item.quantity}
                    </li>
                ))}
            </ul>

            <button onClick={handleConfirmCheckout}>Confirm & Submit Loan</button>
        </div>
    );
};

export default CheckoutPage;
