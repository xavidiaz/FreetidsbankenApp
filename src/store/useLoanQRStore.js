import { create } from "zustand";
import { useLoansStore } from "@/store/useFreetidsbanken";
import { useShopsStore } from "@/store/useFreetidsbanken";

// 🔹 Utility function to generate QR data
const generateQRData = (loan) => {
    const shop = useShopsStore.getState().getById(loan.shop_id);
    return JSON.stringify({
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        shop: shop ? shop.name : "Unknown Shop",
        date_start: loan.date_start,
        date_end: loan.date_end,
        items: loan.item_id,
    });
};

// 🔹 Zustand store that extends `useLoansStore`
const useLoanQRStore = create((set, get) => ({
    ...useLoansStore.getState(), // ✅ Inherit all methods from `useLoansStore`

    addLoanWithQR: (loan) => {
        const updatedLoan = { ...loan, qr_code: generateQRData(loan) };
        useLoansStore.getState().add(updatedLoan); // ✅ Add loan to original store
    },

    updateLoanWithQR: (id, updatedData) => {
        const existingLoan = useLoansStore.getState().getById(id);
        if (!existingLoan) return;

        const updatedLoan = { ...existingLoan, ...updatedData, qr_code: generateQRData({ ...existingLoan, ...updatedData }) };
        useLoansStore.getState().update(id, updatedLoan);
    },

    getLoanQR: (id) => {
        const loan = useLoansStore.getState().getById(id);
        return loan ? loan.qr_code : null;
    },
}));

export default useLoanQRStore;