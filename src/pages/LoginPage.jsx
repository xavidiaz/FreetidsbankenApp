import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleLogin = () => {
        const success = login(email);
        if (success) {
            navigate("/items"); // Redirect after successful login
        } else {
            alert("User not found. Please enter a registered email.");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
