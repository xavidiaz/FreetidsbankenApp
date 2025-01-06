import { useToast } from "@/hooks/use-toast"; // ✅ Corrected Import Path
import { Button } from "@/components/ui/button";

const ToastTester = () => {
    const { toast } = useToast(); // ✅ Initialize toast hook

    return (
        <div className="p-4">
            <Button
                onClick={() =>
                    toast({
                        title: "Test Notification",
                        description: "This is a test toast notification!",
                    })
                }
            >
                Show Test Toast
            </Button>
        </div>
    );
};

export default ToastTester;
