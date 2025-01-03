import { create } from "zustand";

export const useDateRangeStore = create((set) => ({
    startDate: "",
    endDate: "",

    setStartDate: (date) => set((state) => ({
        startDate: date,
        endDate: state.endDate && state.endDate < date ? date : state.endDate, // Prevent invalid range
    })),

    setEndDate: (date) => set((state) => ({
        endDate: date,
        startDate: state.startDate && state.startDate > date ? date : state.startDate, // Prevent invalid range
    })),

    clearDates: () => set({ startDate: "", endDate: "" }),
}));
