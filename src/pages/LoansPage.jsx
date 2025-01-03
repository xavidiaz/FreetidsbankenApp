
import { useLoansStore } from '@/store/useFreetidsbanken';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';

const LoansPage = () => {
    const loansStore = useLoansStore();

    return (
        <>
            <FilterInputComponent placeholder="Search Loans..." store={useLoansStore} filterKey="user_id" />
            <PageLayout
                title="Loans"
                data={loansStore.getFiltered()}
                renderItem={(loan) => <>Loan #{loan.loan_id} - Status: {loan.status}</>}
                entity="loans"
            />
        </>
    );
};

export default LoansPage;
