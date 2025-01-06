import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useLoansStore, useShopsStore } from "@/store/useFreetidsbanken";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";
import { useToast } from "@/hooks/use-toast";
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
import { MapPin, CalendarRange, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import Img from '@/components/Img';

const CartPage = () => {

    const cartStore = useCartStore();
    const loansStore = useLoansStore();
    const shopsStore = useShopsStore();
    const authUser = useAuthStore().authUser;
    const navigate = useNavigate();
    const { toast } = useToast();

    const dateRef = useRef(null);
    const shopRef = useRef(null);
    const drawerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const cartItems = cartStore.cart;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const selectedShop = shopsStore.getById(cartStore.selectedShop);
    const { startDate, endDate } = cartStore;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [cartItems]);

    const closeDrawer = () => {
        if (drawerRef.current) {
            drawerRef.current.close();
        }
    };

    const handleCheckout = () => {
        if (!authUser) {
            showToast("Authentication Required", "You must be logged in to proceed.", "destructive");
            return;
        }

        if (cartItems.length === 0) {
            showToast("Cart is Empty", "Please add items before checking out.", "destructive");
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
                    if (shopRef.current) { // ✅ Check before removing class
                        shopRef.current.classList.remove("shake");
                    }
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

            // ✅ Ensure `dateRef.current` exists before modifying class
            if (dateRef.current) {
                dateRef.current.classList.add("shake");

                setTimeout(() => {
                    if (dateRef.current) dateRef.current.classList.remove("shake");
                }, 600);
            }
            return;
        }



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
        cartStore.clearCart();
        showToast("Checkout Successful", "Your loan request has been submitted.", "success");

        setTimeout(() => {
            window.location.href = `/checkout-success/${newLoan.loan_id}`;
        }, 10);
    };
    const handleClearCart = () => {

        if (cartItems.length === 0) {
            showToast("Cart already is Empty", "destructive");
            return;
        }

        cartStore.clearCart();
        showToast("Cleart Successfully done", "success");

        setTimeout(() => {
            window.location.href = `/`;
        }, 100);
    };

    const showToast = (title, description, variant = "default") => {
        toast({
            title,
            description,
            variant,
            className: "custom-toast", // ✅ Apply HSL background
        });
    };


    return (
        <div className="fixed bottom-0 left-0 w-full bg-background border-t-4 border-green-100">
            <Drawer className="shadow-lg" ref={drawerRef}>
                <DrawerTrigger className="w-full flex justify-between items-center px-4 py-2 shadow-lg">
                    <DrawerTriggerContent selectedShop={selectedShop} startDate={startDate} endDate={endDate} totalItems={totalItems} className="" />
                </DrawerTrigger>

                <DrawerContent className="w-full z-50">
                    {isLoading ? (
                        <SkeletonPlaceholder.CartItem />
                    ) : cartItems.length > 0 ? (
                        <>
                            <DrawerHeader className="flex justify-between items-center px-4 py-2">
                                <h2>Cart</h2>
                            </DrawerHeader>

                            <DrawerDescription className="h-auto overflow-y-auto">
                                <CartItemsList cartItems={cartItems} />
                            </DrawerDescription>

                            <DrawerFooter className="h-auto flex justify-between items-center w-full bg-muted p-4 rounded-b-md">
                                <CheckoutSection handleCheckout={handleCheckout} handleClearCart={handleClearCart} dateRef={dateRef} shopRef={shopRef} />
                            </DrawerFooter>
                        </>
                    ) : (
                        <>
                            <DrawerHeader className="flex justify-between items-center px-4 py-2">
                                <h2 className="text-muted-foreground text-center py-4">Your cart is empty.</h2>
                            </DrawerHeader>
                            <DrawerDescription className="h-0" />

                            <DrawerFooter className="flex justify-between items-center w-full bg-muted p-4 rounded-b-md">
                                <CheckoutSection handleCheckout={handleCheckout} handleClearCart={handleClearCart} dateRef={dateRef} shopRef={shopRef} />
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
};

const DrawerTriggerContent = ({ selectedShop, startDate, endDate, totalItems }) => (
    <>
        <div className="flex flex-col items-center gap-1">
            <MapPin size={24} />
            <span>{selectedShop ? selectedShop.name : "Unknown Shop"}</span>
        </div>
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
        <div className="relative flex items-center">
            <ShoppingCart size={28} className="text-primary" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                </span>
            )}
        </div>
    </>
);

const CartItemsList = ({ cartItems }) => (
    <ul>
        {cartItems.map((item) => (
            <Card key={item.item_id} className="box-border flex flex-row items-center justify-between gap-1 p-2">
                <div className="flex w-1/4 shrink-0 p-0 m-0.5">
                    <Img src={item.thumbnail} alt={item.name} className="w-1/6 rounded-md" />
                </div>
                <CardContent className="p-0 flex flex-col h-full space-y-1">
                    <Link to={`/items/${item.item_id}`} className="font-semibold text-left text-sm truncate-ellipsis">
                        {item.name}
                    </Link>
                </CardContent>
                <div className="flex w-auto m-0 p-0 box-border">

                    <AddToCartButton item={item} />
                </div>
            </Card>
        ))}
    </ul>
);

const CheckoutSection = ({
    handleCheckout, handleClearCart, shopRef,
    dateRef }) => (
    <div className="space-y-2 w-full">
        <h4 className="text-sm font-medium text-muted-foreground">Pickup Location & Date</h4>
        <div className="flex items-center gap-4 bg-card p-2 rounded-md">
            {/* Shop Picker */}
            <div ref={shopRef} className="flex items-center gap-2 border border-border rounded-md px-3 py-2 w-full">
                <MapPin size={20} className="text-primary" />
                <LocationPicker className="w-full" />
            </div>
            {/* Date Picker */}
            <div ref={dateRef} className="flex items-center gap-2 border border-border rounded-md px-3 py-2 w-full">
                <CalendarRange size={20} className="text-primary" />
                <DateRangePicker className="w-full" />
            </div>
        </div>
        <div className="flex flex-row gap-2">
            <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary-dark">
                Proceed to Checkout
            </Button>
            <Button onClick={handleClearCart} variant="destructive">Clear Cart</Button>
        </div>
    </div>
);

export default CartPage;
