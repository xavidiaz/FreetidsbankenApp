import { create } from "zustand";
import { useUsersStore } from "@/store/useFreetidsbanken";

export const useAuthStore = create((set, get) => ({
    authUser: null, // Stores the logged-in user

    login: (email) => {
        import("@/store/useFreetidsbanken").then(module => {
            const { useUsersStore } = module;
            const users = useUsersStore.getState().getAll();
            const user = users.find(u => u.email === email); // 🔹 Check by email only

            if (user) {
                set({ authUser: user });
                localStorage.setItem("authUser", JSON.stringify(user)); // Persist session
                return true;
            }
            return false; // Invalid email
        });
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
        try {
            console.log("📝 Register called with:", { name, email, phone, profile_image, preferred_shop });

            if (!name || !email) {
                console.error("❌ Invalid data: Name or Email is missing!");
                return { success: false, message: "Name and Email are required" };
            }

            const usersStore = useUsersStore.getState();
            console.log("✅ `useUsersStore` Loaded:", usersStore);

            const users = usersStore.getAll();
            console.log("🔹 Current Users in Store:", users);

            if (users.find((u) => u.email === email)) {
                console.warn(`⚠️ Registration failed: Email ${email} already in use.`);
                return { success: false, message: "User already exists" };
            }

            console.log("✅ User does not exist, proceeding with registration...");

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

            set({ authUser: newUser });
            localStorage.setItem("authUser", JSON.stringify(newUser));
            console.log("✅ Session persisted:", newUser);

            console.log("📝 Creating new user...");

            usersStore.add(newUser);

            console.log("🔄 Updated Users:", usersStore.getAll());

            console.log("🎉 Registration successful:", newUser);
            return { success: true, message: "Registration successful" };
        } catch (error) {
            console.error("❌ Registration error:", error);
            return { success: false, message: "An unexpected error occurred" };
        }
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
