import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SignUpPage from "@/pages/SignUpPage";

const LoginSheet = () => {

    return (
        <Sheet>
            <SheetTrigger className="text-primary" >
                Sign Up
            </SheetTrigger>
            <SheetContent className="min-w-56">
                <SheetHeader>
                    <SheetTitle>Sign Up</SheetTitle>
                </SheetHeader>

                <SignUpPage />
            </SheetContent>

        </Sheet>
    );
};

export default LoginSheet;
