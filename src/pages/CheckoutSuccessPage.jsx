import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLoansStore, useShopsStore, useItemsStore } from "@/store/useFreetidsbanken";
import { QRCodeSVG } from "qrcode.react";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";

const CheckoutSuccessPage = () => {
    const { loanId } = useParams();
    const loansStore = useLoansStore();
    const shopsStore = useShopsStore();
    const itemsStore = useItemsStore();

    const [isLoading, setIsLoading] = useState(true);
    const [loan, setLoan] = useState(null);
    const [shop, setShop] = useState(null);
    const [loanedItems, setLoanedItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedLoan = loansStore.getById(Number(loanId));
            if (fetchedLoan) {
                setLoan(fetchedLoan);
                setShop(shopsStore.getById(fetchedLoan.shop_id));

                // Fetch loaned items with details
                const items = fetchedLoan.item_id.map((itemId) => itemsStore.getById(itemId)).filter(Boolean);
                setLoanedItems(items);
            }
            setIsLoading(false);
        }, 500); // Adjust delay if needed

        return () => clearTimeout(timer);
    }, [loanId, loansStore, shopsStore, itemsStore]);

    if (isLoading) {
        return <SkeletonPlaceholder.LoanDetails />;
    }

    if (!loan) {
        return <h1>Loan not found</h1>;
    }

    // ✅ Format loan details as text for QR Code
    const qrValue = JSON.stringify({
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        shop: shop ? shop.name : "Unknown Shop",
        date_start: loan.date_start,
        date_end: loan.date_end,
        items: loan.item_id, // List of item IDs
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
                {loanedItems.length > 0 ? (
                    loanedItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-4">
                            <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-md" />
                            <span><strong>{item.name}</strong></span>
                            <span>Quantity: {item.quantity || 1}</span> {/* Default to 1 if missing */}
                        </li>
                    ))
                ) : (
                    <p>No items found.</p>
                )}
            </ul>

            <h2>📌 Scan this QR Code at the shop for pickup:</h2>
            <QRCodeSVG value={qrValue} size={200} />

            <br />
            <Link to="/loans">View My Loans</Link>
        </div>
    );
};

export default CheckoutSuccessPage;
