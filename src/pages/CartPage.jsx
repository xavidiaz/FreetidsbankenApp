import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useLoansStore, useShopsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer";
import DateRangePicker from "@/components/DateRangePicker";
import LocationPicker from "@/components/LocationPicker";
import { MapPin, CalendarRange, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // ✅ Import ShadCN Card
import Img from '@/components/Img';

const CartPage = ({ totalItems }) => {
    const cartStore = useCartStore();
    const loansStore = useLoansStore();
    const shopsStore = useShopsStore();
    const authUser = useAuthStore().authUser;
    const navigate = useNavigate();

    // ✅ Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCartItems(cartStore.cart);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [cartStore.cart]);

    // ✅ Get selected shop from store
    const selectedShop = shopsStore.getById(cartStore.selectedShop);
    const { startDate, endDate } = cartStore;

    const handleCheckout = () => {
        if (!authUser) {
            alert("You must be logged in to proceed.");
            return;
        }
        if (cartItems.length === 0) {
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
            item_id: cartItems.map(item => item.item_id),
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
        <div className="fixed bottom-0 left-0 w-full bg-background shadow-md flex  p-4">
            <Drawer>
                <DrawerTrigger className="w-full">
                    <div className="flex flex-row justify-between items-center w-full px-4 py-2">
                        {/* Shop Selection */}
                        <div className="flex flex-col items-center gap-1">
                            <MapPin size={24} />
                            <span>{selectedShop ? selectedShop.name : "Unknown Shop"}</span>
                        </div>

                        {/* Date Range */}
                        <div className="flex flex-col items-center gap-1">
                            <CalendarRange size={24} />
                            {startDate && endDate ? (
                                <>
                                    <p className="text-sm">{startDate}</p>
                                    <p className="text-sm">{endDate}</p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Select Date Range</p>
                            )}
                        </div>

                        {/* Cart Icon with Item Count */}
                        <div className="relative flex flex-col items-center gap-1">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        </div>
                    </div>
                </DrawerTrigger>


                <DrawerContent
                    className="w-full h-5/6"
                >
                    {isLoading ? (
                        <SkeletonPlaceholder.CartItem />
                    ) : cartItems.length > 0 ? (
                        <>
                            <DrawerHeader
                                className="flex flex-row justify-between items-center w-full px-4 py-2 h-1/6">

                                {/* Cart Icon with Item Count */}
                                <h2>Cart</h2>
                                {/* Cart Icon with Item Count */}
                                <div className="relative flex flex-col items-center gap-1">
                                    <ShoppingCart size={24} />
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {totalItems}
                                    </span>
                                </div>
                            </DrawerHeader>
                            <DrawerDescription
                                className="h-auto overflow-y-auto"
                            >
                                <ul>
                                    {cartItems.map((item) => (
                                        <Card key={item.item_id} className="flex items-center gap-3 p-4 h-20">
                                            {/* ✅ Replaces `<img>` with `<Img>` for consistency */}
                                            <Img src={item.thumbnail} alt={item.name} className="w-1/6 rounded-md" />

                                            {/* ✅ Structured content inside `CardContent` */}
                                            <CardContent className="p-2 pt-0 flex flex-col w-5/6 h-full justify-between">
                                                <Link to={`/items/${item.item_id}`}
                                                    className="font-semibold text-lg">
                                                    {item.name}
                                                </Link>
                                            </CardContent>

                                            {/* ✅ Keep AddToCartButton for actions */}
                                            <AddToCartButton item={item} />
                                        </Card>
                                    ))}

                                </ul>
                            </DrawerDescription>
                            <DrawerFooter
                                className="h-1/6"
                            >

                                <div>
                                    <h4>Select Pickup Location & Date Range</h4>
                                    <div className="flex flex-row flex-nowrap gap-4">
                                        <LocationPicker />
                                        <DateRangePicker />
                                    </div>
                                </div>

                                <button onClick={handleCheckout}>Proceed to Checkout</button>
                            </DrawerFooter>

                        </>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}

                    <br />
                    <Link to="/items">Continue Browsing</Link>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default CartPage;
