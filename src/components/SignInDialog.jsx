import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginPage from "@/pages/LoginPage";

const SignInDialog = ({ isOpen, setIsOpen }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                {/* ✅ Pass setIsOpen to LoginPage */}
                <LoginPage closeDialog={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default SignInDialog;
