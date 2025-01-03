import { useParams, Link } from "react-router-dom";
import { useLoansStore, useShopsStore, useItemsStore } from "@/store/useFreetidsbanken";
import { QRCodeSVG } from "qrcode.react";

const CheckoutSuccessPage = () => {
    const { loanId } = useParams();
    const loansStore = useLoansStore();
    const shopsStore = useShopsStore();

    const loan = loansStore.getById(Number(loanId));
    if (!loan) {
        return <h1>Loan not found</h1>;
    }

    const shop = shopsStore.getById(loan.shop_id);

    // ✅ Format loan details as text for QR Code
    const qrValue = JSON.stringify({
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        shop: shop ? shop.name : "Unknown Shop",
        date_start: loan.date_start,
        date_end: loan.date_end,
        items: loan.item_id,  // List of item IDs
    });

    return (
        <div>
            <h1>🎉 Checkout Complete!</h1>
            <p>Your loan request has been submitted successfully.</p>

            <h2>Loan Details</h2>
            <p><strong>Loan ID:</strong> {loan.loan_id}</p>
            <p><strong>Pickup Location:</strong> {shop ? shop.name : "Unknown Shop"}</p>
            <p><strong>Loan Period:</strong> {loan.date_start} to {loan.date_end}</p>

            <h2>Loaned Items</h2>
            <ul>
                {loan.item_id.map((itemId, index) => {
                    const item = useItemsStore.getState().getById(itemId);
                    return item ? (
                        <li key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: "5px" }} />
                            <span><strong>{item.name}</strong></span>
                            <span>Quantity: {item.quantity || 1}</span> {/* Default quantity to 1 if missing */}
                        </li>
                    ) : (
                        <li key={index}>Item #{itemId} (Not Found)</li>
                    );
                })}
            </ul>

            <h2>📌 Scan this QR Code at the shop for pickup:</h2>
            <QRCodeSVG value={qrValue} size={200} />

            <br />
            <Link to="/loans">View My Loans</Link>
        </div>
    );
};

export default CheckoutSuccessPage;
