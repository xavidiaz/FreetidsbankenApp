import { create } from 'zustand';
import { useUsersStore } from '@/store/useFreetidsbanken'; // Ensure correct path

export const useAuthStore = create((set, get) => ({
    authUser: null, // Stores the logged-in user

    login: (email) => {
        const users = useUsersStore.getState().getAll();
        const user = users.find(u => u.email === email); // 🔹 Check by email only

        if (user) {
            set({ authUser: user });
            localStorage.setItem("authUser", JSON.stringify(user)); // Persist session
            return true;
        }
        return false; // Invalid email
    },

    logout: (navigate) => {
        set({ authUser: null });
        localStorage.removeItem("authUser"); // Clear session
        navigate("/"); // ✅ Redirect to home page

    },

    isAuthenticated: () => !!get().authUser, // Check if a user is logged in
}));

// 🔹 Auto-load user from storage on app start
const storedUser = localStorage.getItem("authUser");
if (storedUser) {
    useAuthStore.setState({ authUser: JSON.parse(storedUser) });
}
