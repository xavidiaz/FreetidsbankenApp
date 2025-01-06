import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CartPage from "@/pages/CartPage";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster"; // ✅ Keep `Toaster` global

const Layout = () => {
    return (
        <ToastProvider>
            <div className="flex flex-col gap-0 min-h-screen">
                {/* ✅ Fixed Navbar */}
                <Navbar />

                {/* ✅ Main Content */}
                <main className="flex-1">
                    <Outlet /> {/* Renders the routed pages dynamically */}
                </main>

                {/* ✅ Toast Notifications (Global) */}

                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: "toast",
                        style: {
                            zIndex: 9999, /* ✅ Ensures it's on top */
                        },
                    }}
                />

                {/* ✅ Footer (CartPage) */}
                <CartPage />
            </div>
        </ToastProvider>
    );
};

export default Layout;
