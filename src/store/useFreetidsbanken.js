import { create } from 'zustand';
import freetidsbankenData from '../../data/freetidsbanken_db.json'; // Update with actual path

const createCRUDStore = (key) => (set, get) => ({
    data: freetidsbankenData[key],
    filteredData: freetidsbankenData[key], // Store filtered results in Zustand

    getAll: () => get().data,
    getFiltered: () => get().filteredData,

    getById: (id) => {
        const keyName = Object.keys(get().data[0]).find(k => k.endsWith("_id")); // Detect key dynamically
        return get().data.find(item => item[keyName] === Number(id));
    },

    add: (newItem) => set(state => ({
        data: [...state.data, { ...newItem, user_id: get().authUser?.user_id }],
        filteredData: [...state.filteredData, { ...newItem, user_id: get().authUser?.user_id }]
    })),

    update: (id, updatedItem) => set(state => ({
        data: state.data.map(item =>
            item[`${key.slice(0, -1)}_id`] === Number(id) && item.user_id === get().authUser?.user_id
                ? { ...item, ...updatedItem }
                : item
        ),
        filteredData: state.filteredData.map(item =>
            item[`${key.slice(0, -1)}_id`] === Number(id) && item.user_id === get().authUser?.user_id
                ? { ...item, ...updatedItem }
                : item
        )
    })),

    delete: (id) => set(state => ({
        data: state.data.filter(item =>
            item[`${key.slice(0, -1)}_id`] !== Number(id) || item.user_id !== get().authUser?.user_id
        ),
        filteredData: state.filteredData.filter(item =>
            item[`${key.slice(0, -1)}_id`] !== Number(id) || item.user_id !== get().authUser?.user_id
        )
    })),

    filterBy: (key, value) => set(state => ({
        filteredData: state.data.filter(item =>
            item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        )
    }))
});

// Creating stores
export const useUsersStore = create(createCRUDStore('Users'));
export const useItemsStore = create(createCRUDStore('Items'));
export const useBookingsStore = create(createCRUDStore('Bookings'));
export const useShopsStore = create(createCRUDStore('Shops'));
export const useReviewsStore = create(createCRUDStore('Reviews'));
export const useCategoriesStore = create(createCRUDStore('Categories'));
export const useLoansStore = create(createCRUDStore('Loans'));

// Authentication store
export const useAuthStore = create((set, get) => ({
    authUser: null, // Stores logged-in user

    login: (user) => set({ authUser: user }), // Simulate login
    logout: () => set({ authUser: null }), // Simulate logout

    isAuthenticated: () => !!get().authUser // Check if logged in
}));
