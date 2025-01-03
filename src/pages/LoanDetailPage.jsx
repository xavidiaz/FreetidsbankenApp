import { useParams } from 'react-router-dom';
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
    const item = itemsStore.getById(loan.item_id);
    const shop = shopsStore.getById(loan.shop_id);

    return (
        <div>
            <h1>Loan #{loan.loan_id}</h1>
            <p><strong>User:</strong> {user ? user.name : 'Unknown User'}</p>
            <p><strong>Item:</strong> {item ? item.name : 'Unknown Item'}</p>
            <p><strong>Shop:</strong> {shop ? shop.name : 'Unknown Shop'}</p>
            <p><strong>Date Start:</strong> {loan.date_start}</p>
            <p><strong>Date End:</strong> {loan.date_end}</p>
            <p><strong>Status:</strong> {loan.status}</p>
        </div>
    );
};

export default LoanDetailPage;