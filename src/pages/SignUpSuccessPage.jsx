import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SignUpSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold">Account Created Successfully!</h1>
            <p className="mt-2 text-muted-foreground">
                You can now log in and start exploring Fritidsbanken.
            </p>

            <Button className="mt-6 w-full max-w-sm" onClick={() => navigate("/")}>
                Go to Home Page
            </Button>
        </div>
    );
};

export default SignUpSuccessPage;
