import { useState } from "react";
import { useLoansStore } from "@/store/useFreetidsbanken";
import useLoanQRStore from "@/store/useLoanQRStore"; // ✅ Import Extended QR Store
import { useDateRangeStore } from "@/store/useDateRangeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, QrCode, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // ✅ Modal Component
import { QRCodeSVG } from "qrcode.react";

const LoansPage = () => {
    const loansStore = useLoansStore();
    const qrStore = useLoanQRStore();
    const { startDate, endDate } = useDateRangeStore();
    const authUser = useAuthStore().authUser;
    const navigate = useNavigate();

    // ✅ State for the QR Code Modal
    const [qrModal, setQrModal] = useState({ open: false, qrValue: "" });

    const filteredLoans = filterLoansByUserAndDate(loansStore.getAll(), authUser, startDate, endDate);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <PageHeader />
            <Card>
                <CardContent>
                    {filteredLoans.length > 0 ? (
                        <LoansTable loans={filteredLoans} onRowClick={navigateToLoanDetail(navigate)} setQrModal={setQrModal} qrStore={qrStore} />
                    ) : (
                        <NoLoansMessage />
                    )}
                </CardContent>
            </Card>

            {/* ✅ QR Code Modal */}
            <Dialog open={qrModal.open} onOpenChange={(open) => setQrModal({ ...qrModal, open })}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>📌 Scan QR Code at the Shop</DialogTitle>
                    </DialogHeader>
                    <QRCodeSVG value={qrModal.qrValue} size={200} className="mx-auto" />
                    <Button variant="outline" onClick={() => setQrModal({ open: false, qrValue: "" })} className="mt-4 flex items-center gap-2">
                        <X size={16} /> Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ✅ Filter loans by user and only show active/future loans
const filterLoansByUserAndDate = (loans, authUser, startDate, endDate) => {
    if (!authUser) return [];

    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    return loans.filter(loan =>
        loan.user_id === authUser.user_id && // 🔹 Only loans of the logged-in user
        loan.date_end >= today && // 🔹 Loan must be active or in the future
        (!startDate || loan.date_start >= startDate) &&
        (!endDate || loan.date_end <= endDate)
    );
};

const PageHeader = () => (
    <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Calendar size={24} className="text-primary" />
                Your Upcoming Loans
            </CardTitle>
        </CardHeader>
    </Card>
);

const LoansTable = ({ loans, onRowClick, setQrModal, qrStore }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {loans.map((loan) => (
                <TableRow key={loan.loan_id} className="cursor-pointer hover:bg-muted transition" onClick={() => onRowClick(loan.loan_id)}>
                    <TableCell>#{loan.loan_id}</TableCell>
                    <TableCell>
                        {loan.date_start} → {loan.date_end}
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation(); // ✅ Prevents row click event

                                // ✅ Get the stored QR code for this loan
                                const qrValue = qrStore.getLoanQR(loan.loan_id);
                                setQrModal({ open: true, qrValue });
                            }}
                        >
                            <QrCode size={16} />
                            Show QR
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const navigateToLoanDetail = (navigate) => (loanId) => {
    navigate(`/loans/${loanId}`);
};

const NoLoansMessage = () => (
    <p className="text-center text-muted-foreground py-4">
        You have no upcoming loans.
    </p>
);

export default LoansPage;
