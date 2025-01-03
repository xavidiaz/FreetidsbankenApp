import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";

const UserButton = () => {
    const authUser = useAuthStore(state => state.authUser);
    const logout = useAuthStore(state => state.logout);

    return (
        <div>
            {authUser ? (
                // Logged in view
                <div>
                    <img src={authUser.profile_image} alt="User Avatar" width={40} height={40} />
                    <span>{authUser.name}</span>
                    <Link to={`/users/${authUser.user_id}`}>Profile</Link>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                // Guest view
                <div>
                    <span>Guest</span>
                    <Link to="/login">Login</Link>
                </div>
            )}
        </div>
    );
};

export default UserButton;
