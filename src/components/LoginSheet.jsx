import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LoginPage from "@/pages/LoginPage";

const LoginSheet = () => {

    return (
        <Sheet>
            <SheetTrigger >
                Login
            </SheetTrigger>
            <SheetContent className="min-w-56">
                <SheetHeader>
                    <SheetTitle>Login</SheetTitle>
                </SheetHeader>

                <LoginPage />
            </SheetContent>

        </Sheet>
    );
};

export default LoginSheet;
