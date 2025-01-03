import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore'; // Ensure correct path
import defaultData from '../../data/freetidsbanken_db.json'; // Ensure correct path

const loadFromLocalStorage = (key) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData[key] || []; // ✅ Use default data as fallback
};

const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const createCRUDStore = (key) => (set, get) => ({
    data: loadFromLocalStorage(key),
    filteredData: loadFromLocalStorage(key),

    getAll: () => get().data,
    getFiltered: () => get().filteredData,

    getById: (id) => {
        const firstItem = get().data[0];
        if (!firstItem) return undefined;

        const keyName = Object.keys(firstItem).find(k => k.endsWith("_id"));
        return get().data.find(item => item[keyName] === Number(id));
    },

    add: (newItem) => {
        const authUser = useAuthStore.getState().authUser;
        if (!authUser) {
            console.error("User not authenticated!");
            return;
        }

        set(state => {
            const updatedItem = { ...newItem, user_id: authUser.user_id };
            const updatedData = [...state.data, updatedItem];

            saveToLocalStorage(key, updatedData); // ✅ Persist to localStorage

            return {
                data: updatedData,
                filteredData: updatedData
            };
        });
    },

    update: (id, updatedItem) => {
        const authUser = useAuthStore.getState().authUser;
        if (!authUser) {
            console.error("User not authenticated!");
            return;
        }

        set(state => {
            const keyName = Object.keys(state.data[0] || {}).find(k => k.endsWith("_id"));
            const updatedData = state.data.map(item =>
                item[keyName] === Number(id) && item.user_id === authUser.user_id
                    ? { ...item, ...updatedItem }
                    : item
            );

            saveToLocalStorage(key, updatedData); // ✅ Persist to localStorage

            return {
                data: updatedData,
                filteredData: updatedData
            };
        });
    },

    delete: (id) => {
        const authUser = useAuthStore.getState().authUser;
        if (!authUser) {
            console.error("User not authenticated!");
            return;
        }

        set(state => {
            const keyName = Object.keys(state.data[0] || {}).find(k => k.endsWith("_id"));
            const updatedData = state.data.filter(item =>
                item[keyName] !== Number(id) || item.user_id !== authUser.user_id
            );

            saveToLocalStorage(key, updatedData); // ✅ Persist to localStorage

            return {
                data: updatedData,
                filteredData: updatedData
            };
        });
    },

    filterBy: (filterKey, value) => set(state => ({
        filteredData: state.data.filter(item =>
            item[filterKey]?.toString().toLowerCase().includes(value.toLowerCase())
        )
    })),
});

// 🔹 Creating stores
export const useUsersStore = create(createCRUDStore('Users'));
export const useItemsStore = create(createCRUDStore('Items'));
export const useBookingsStore = create(createCRUDStore('Bookings'));
export const useShopsStore = create(createCRUDStore('Shops'));
export const useReviewsStore = create(createCRUDStore('Reviews'));
export const useCategoriesStore = create(createCRUDStore('Categories'));
export const useLoansStore = create(createCRUDStore('Loans'));
