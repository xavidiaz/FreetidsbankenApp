import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLoansStore, useUsersStore, useItemsStore, useShopsStore } from '@/store/useFreetidsbanken';

const LoanDetailPage = () => {
    const { id } = useParams();
    const loansStore = useLoansStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();
    const shopsStore = useShopsStore();

    const loan = loansStore.getById(Number(id));
    if (!loan) {
        return <h1>Loan not found</h1>;
    }

    const user = usersStore.getById(loan.user_id);
    const shop = shopsStore.getById(loan.shop_id);

    // 🔹 State for updating the loan
    const [dateStart, setDateStart] = useState(loan.date_start);
    const [dateEnd, setDateEnd] = useState(loan.date_end);
    const [status, setStatus] = useState(loan.status);

    // 🔹 Handle Loan Update
    const handleUpdateLoan = (e) => {
        e.preventDefault();

        const updatedLoan = {
            ...loan,
            date_start: dateStart,
            date_end: dateEnd,
            status: status,
        };

        loansStore.update(loan.loan_id, updatedLoan); // ✅ Update Zustand store
        localStorage.setItem("loans", JSON.stringify(loansStore.getAll())); // ✅ Persist to localStorage

        alert("Loan updated successfully!");
    };

    return (
        <div>
            <h1>Loan #{loan.loan_id}</h1>
            <p><strong>User:</strong> {user ? user.name : 'Unknown User'}</p>
            <p><strong>Shop:</strong> {shop ? shop.name : 'Unknown Shop'}</p>

            {/* 🔹 Loaned Items */}
            <h2>Loaned Items</h2>
            {loan.item_id.length > 0 ? (
                <ul>
                    {loan.item_id.map((itemId) => {
                        const item = itemsStore.getById(itemId);
                        return item ? (
                            <li key={item.item_id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={item.thumbnail} alt={item.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                                <Link to={`/items/${item.item_id}`} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                                    {item.name}
                                </Link>
                            </li>
                        ) : (
                            <li key={itemId}>Item #{itemId} not found</li>
                        );
                    })}
                </ul>
            ) : (
                <p>No loaned items available.</p>
            )}

            {/* 🔹 Loan Edit Form */}
            <h2>Edit Loan</h2>
            <form onSubmit={handleUpdateLoan}>
                <label>
                    Date Start:
                    <input
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Date End:
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </label>
                <br />
                <button type="submit">Update Loan</button>
            </form>
        </div>
    );
};

export default LoanDetailPage;
