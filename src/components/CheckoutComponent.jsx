import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useLoansStore } from "@/store/useFreetidsbanken";
import SignInDialog from "@/components/SignInDialog"; // ✅ Import Sign-In Dialog

const CheckoutComponent = () => {
    console.log("CheckoutComponent");
    const { toast } = useToast();
    const cartStore = useCartStore();
    const loansStore = useLoansStore();
    const authUser = useAuthStore((state) => state.authUser);

    const shopRef = useRef(null);
    const dateRef = useRef(null);

    // ✅ State to control the Sign-In Dialog visibility
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const handleCheckout = () => {
        const cartItems = cartStore.getAll();

        if (cartItems.length === 0) {
            toast({
                title: "Cart is Empty",
                description: "Please add items before checking out.",
                variant: "destructive",
            });
            return;
        }

        if (!cartStore.selectedShop) {
            toast({
                title: "Select a Pickup Shop",
                description: "Please select a shop before checking out.",
                variant: "destructive",
            });

            if (shopRef.current) {
                shopRef.current.classList.add("shake");
                setTimeout(() => {
                    shopRef.current?.classList.remove("shake");
                }, 600);
            }
            return;
        }

        if (!cartStore.startDate || !cartStore.endDate) {
            toast({
                title: "Select a Loan Period",
                description: "Please choose a start and end date before proceeding.",
                variant: "destructive",
                icon: <AlertTriangle className="text-red-500" />,
            });

            if (dateRef.current) {
                dateRef.current.classList.add("shake");
                setTimeout(() => {
                    dateRef.current?.classList.remove("shake");
                }, 600);
            }
            return;
        }

        // ✅ Instead of rendering JSX in `onClick`, toggle state
        if (!authUser) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to proceed.",
                variant: "destructive",
                duration: 5000,
                action: {
                    label: "Sign In",
                    onClick: () => setIsSignInOpen(true), // ✅ Opens the Sign-In Dialog
                },
            });
            return;
        }

        const newLoan = {
            loan_id: Date.now(),
            user_id: authUser.user_id,
            item_id: cartItems.map((item) => item.item_id),
            shop_id: cartStore.selectedShop,
            date_start: cartStore.startDate,
            date_end: cartStore.endDate,
            status: "Confirmed",
        };

        loansStore.add(newLoan);
        cartStore.clearCart();

        toast({
            title: "Checkout Successful",
            description: "Your loan request has been submitted.",
            variant: "success",
            duration: 5000,
        });

        setTimeout(() => {
            window.location.href = `/checkout-success/${newLoan.loan_id}`;
        }, 10);
    };

    return (
        <>
            <button onClick={handleCheckout} className="btn-primary">
                Checkout
            </button>

            {/* ✅ Render the Sign-In Dialog when state is true */}
            <SignInDialog isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </>
    );
};

export default CheckoutComponent;
