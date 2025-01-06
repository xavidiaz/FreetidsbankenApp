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

    register: ({ name, email, phone = "", profile_image = "", preferred_shop = null }) => {
        const users = useUsersStore.getState().getAll();
        console.log("useUsersStore", Boolean(users));

        if (users.find((u) => u.email === email)) {
            console.log("User already exists");
            return { success: false, message: "User already exists" };
        }

        // 🔹 Create new user object with full schema
        const newUser = {
            user_id: Date.now(),
            name,
            email,
            phone,
            profile_image: profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
            booking_history: [],
            reviews: [],
            preferred_shop: preferred_shop || null,
            loans: [],
        };

        // ✅ Set new user as `authUser` FIRST before adding to `useUsersStore`
        set({ authUser: newUser });
        localStorage.setItem("authUser", JSON.stringify(newUser));
        console.log("Registered user", newUser);

        // ✅ Now add the user to `useUsersStore`
        useUsersStore.getState().add(newUser);

        return { success: true, message: "Registration successful" };
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
