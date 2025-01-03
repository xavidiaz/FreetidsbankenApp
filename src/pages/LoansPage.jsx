import { useLoansStore } from '@/store/useFreetidsbanken';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import { Link } from 'react-router-dom'; // Import Link for navigation

const LoansPage = () => {
    const loansStore = useLoansStore();

    return (
        <>
            <FilterInputComponent placeholder="Search Loans..." store={useLoansStore} filterKey="user_id" />
            <PageLayout
                title="Loans"
                data={loansStore.getFiltered()}
                renderItem={(loan) => (
                    loan.loan_id ? ( // ✅ Ensure loan_id exists
                        <li key={loan.loan_id}>
                            <Link to={`/loans/${loan.loan_id}`}>
                                Loan #{loan.loan_id} - Status: {loan.status}
                            </Link>
                        </li>
                    ) : (
                        <li key={Math.random()}>Invalid Loan Data</li> // 🚨 Catch undefined loans
                    )
                )}
                entity="loans"
            />
        </>
    );
};

export default LoansPage;
