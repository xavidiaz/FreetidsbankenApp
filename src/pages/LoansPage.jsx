import { useLoansStore } from "@/store/useFreetidsbanken";
import { useDateRangeStore } from "@/store/useDateRangeStore";
import DateRangePicker from "@/components/DateRangePicker";
import PageLayout from "@/Layouts/PageLayout";

const LoansPage = () => {
    const loansStore = useLoansStore();
    const { startDate, endDate } = useDateRangeStore();

    // 🔹 Filter loans by selected date range
    const filteredLoans = loansStore.getAll().filter(loan =>
        (!startDate || loan.date_start >= startDate) &&
        (!endDate || loan.date_end <= endDate)
    );

    return (
        <>
            <h1>Loans</h1>
            <DateRangePicker />
            <PageLayout
                title="Loans"
                data={filteredLoans}
                renderItem={(loan) => (
                    <>
                        Loan #{loan.loan_id} - Status: {loan.status} - {loan.date_start} → {loan.date_end}
                    </>
                )}
                entity="loans"
            />
        </>
    );
};

export default LoansPage;
