import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoundX, UserCog, LogOut } from "lucide-react";
import LoginSheet from "@/components/LoginSheet";
import { Link, useNavigate } from "react-router-dom";


const UserButton = () => {
    const authUser = useAuthStore(state => state.authUser);
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate(); // ✅ Get the navigate function
    const handleLogout = () => {
        logout(navigate); // ✅ Pass navigate to logout
    };

    return (
        <div className="flex flex-col items-center">
            {authUser ? (
                // Logged-in view
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex flex-col items-center cursor-pointer">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={authUser.profile_image} alt={authUser.name} />
                                <AvatarFallback>{authUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="mt-1 text-sm font-medium">{authUser.name}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem asChild>
                            <Link to={`/users/${authUser.user_id}`}><UserCog /> Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout} className="text-red-600 cursor-pointer">
                            <LogOut /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                // Guest view
                <div className="flex flex-col items-center gap-0">
                    <Avatar className="size-12">
                        <AvatarFallback><UserRoundX /></AvatarFallback>
                    </Avatar>
                    <LoginSheet />
                </div>
            )}
        </div>
    );
};

export default UserButton;
