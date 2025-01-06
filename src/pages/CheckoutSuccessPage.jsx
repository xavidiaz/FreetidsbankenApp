import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useLoanQRStore from "@/store/useLoanQRStore"; // ✅ Use Extended QR Store
import { useShopsStore, useItemsStore } from "@/store/useFreetidsbanken";
import { QRCodeSVG } from "qrcode.react";
import SkeletonPlaceholder from "@/components/SkeletonPlaceholder";
import Img from "@/components/Img";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Store, Download } from "lucide-react";

const CheckoutSuccessPage = () => {
    const { loanId } = useParams();
    const loansStore = useLoanQRStore(); // ✅ Use the extended store
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

                // ✅ Fetch loaned items with details
                const items = fetchedLoan.item_id.map((itemId) => itemsStore.getById(itemId)).filter(Boolean);
                setLoanedItems(items);
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [loanId, loansStore, shopsStore, itemsStore]);

    if (isLoading) {
        return <SkeletonPlaceholder.LoanDetails />;
    }

    if (!loan) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10 text-center">
                <CardHeader>
                    <AlertCircle className="text-destructive w-8 h-8 mx-auto" />
                    <CardTitle>Loan Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The requested loan could not be found.</p>
                    <Button asChild className="mt-4">
                        <Link to="/">Go Back</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // ✅ Retrieve the stored QR Code
    const qrValue = loansStore.getLoanQR(loan.loan_id);

    // ✅ Function to download QR Code
    const downloadQRCode = () => {
        const canvas = document.createElement("canvas");
        const svg = document.querySelector("svg");
        const img = new Image();

        img.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}`;
        img.onload = () => {
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const link = document.createElement("a");
            link.download = `loan_${loan.loan_id}_qr.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* ✅ Success Message */}
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">🎉 Checkout Complete!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        Your loan request has been submitted successfully. Below are your loan details.
                    </p>
                </CardContent>
            </Card>

            {/* ✅ Loan Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">Loan ID</Badge>
                            <span className="font-medium">{loan.loan_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Store size={18} className="text-primary" />
                            <span className="font-medium">{shop ? shop.name : "Unknown Shop"}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar size={18} className="text-primary" />
                            <span className="font-medium">
                                {loan.date_start} → {loan.date_end}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ✅ Loaned Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Loaned Items</CardTitle>
                </CardHeader>
                <CardContent>
                    {loanedItems.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanedItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="flex items-center gap-3">
                                            <Img src={item.thumbnail} alt={item.name} className="w-10 h-10 rounded-md" />
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell>{item.quantity || 1}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center">No items found.</p>
                    )}
                </CardContent>
            </Card>

            {/* ✅ QR Code Section */}
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>📌 Scan QR Code at the Shop</CardTitle>
                </CardHeader>
                <CardContent>
                    <QRCodeSVG value={qrValue} size={200} className="mx-auto" />
                    <div className="flex justify-center gap-4 mt-4">
                        <Button onClick={downloadQRCode} className="flex items-center gap-2">
                            <Download size={16} /> Download QR
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ✅ CTA Button */}
            <div className="flex justify-center">
                <Button asChild>
                    <Link to="/loans">View My Loans</Link>
                </Button>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
