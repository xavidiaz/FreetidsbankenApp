import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLoansStore, useUsersStore, useItemsStore, useShopsStore } from '@/store/useFreetidsbanken';
import { useCartStore } from '@/store/useCartStore';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import Img from '@/components/Img';
import { Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

const LoanDetailPage = () => {
    const { id } = useParams();
    const loansStore = useLoansStore();
    const usersStore = useUsersStore();
    const itemsStore = useItemsStore();
    const shopsStore = useShopsStore();
    const cartStore = useCartStore();
    const { toast } = useToast();

    const loan = loansStore.getById(Number(id));
    if (!loan) {
        return <h1 className="text-center text-red-500 text-xl">Loan not found</h1>;
    }

    const user = usersStore.getById(loan.user_id);
    const shop = shopsStore.getById(loan.shop_id);

    const [dateStart, setDateStart] = useState(loan.date_start);
    const [dateEnd, setDateEnd] = useState(loan.date_end);
    const [status, setStatus] = useState(loan.status);

    // ✅ Handle loan update
    const handleUpdateLoan = (e) => {
        e.preventDefault();

        const updatedLoan = {
            ...loan,
            date_start: dateStart,
            date_end: dateEnd,
            status: status,
        };

        loansStore.update(loan.loan_id, updatedLoan);
        localStorage.setItem("loans", JSON.stringify(loansStore.getAll()));

        toast({
            title: "Loan Updated",
            description: "The loan details have been updated successfully.",
            variant: "success",
            icon: <CheckCircle className="text-green-500" />,
        });
    };
    // ✅ Repeat Loan Functionality (Refactored)
    const repeatLoan = () => {
        console.log("Repeating loan...");
        cartStore.clearCart(); // Clears existing cart before adding
        cartStore.setShop(loan.shop_id); // ✅ Set shop to the same one used in the previous loan
        cartStore.setStartDate(""); // Ensure the user selects a new date
        cartStore.setEndDate("");

        const itemsToAdd = loan.item_id.map((itemId) => {
            const item = itemsStore.getById(itemId);
            if (item) {
                return { ...item, quantity: 1 };
            }
            return null; // Avoid adding undefined items
        }).filter(Boolean); // Remove null values

        if (itemsToAdd.length === 0) {
            toast({
                title: "Error Adding Items",
                description: "Failed to load item details. Please try again.",
                variant: "destructive",
            });
            return;
        }

        // ✅ Add all items to the cart in one batch
        itemsToAdd.forEach(item => cartStore.addToCart(item));

        console.log("Added items to cart", itemsToAdd);

        toast({
            title: "Loan Added to Cart",
            description: "Your previous loan has been added to the cart. Please select a new date range before checkout.",
            variant: "success",
        });
    };

    const [loans, setLoans] = useState(loansStore.getAll());

    const handleCancelLoan = () => {
        loansStore.delete(loan.loan_id);

        toast({
            title: "Loan Cancelled",
            description: "The loan has been cancelled successfully.",
            variant: "success",
            icon: <CheckCircle className="text-green-500" />,
        });

        // ✅ Update state after deleting
        setLoans(loansStore.getAll());

        setTimeout(() => {
            window.location.href = "/loans";
        }, 500);
    };




    return (
        <div className="flex flex-col min-h-screen space-y-4">
            <LoanSummaryCard loan={loan} user={user} shop={shop} repeatLoan={repeatLoan} canceLoan={handleCancelLoan} />
            <LoanEditForm
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                status={status}
                setStatus={setStatus}
                handleUpdateLoan={handleUpdateLoan}
                handleCancelLoan={handleCancelLoan}
            />
            <LoanedItemsTable loan={loan} itemsStore={itemsStore} />

        </div>
    );
};

const LoanSummaryCard = ({ loan, user, shop, repeatLoan }) => (
    <Card>
        <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-primary w-full flex items-center gap-2 justify-between">
                <div>
                    <Calendar size={24} /> Loan #{loan.loan_id}
                </div>
                <div><MapPin /> {shop ? shop.name : 'Unknown Shop'}</div>
            </CardTitle>
        </CardHeader>
        <CardFooter>
            <Button onClick={repeatLoan} className="bg-primary w-full text-white flex items-center gap-2">
                <RefreshCw size={16} />
                Repeat Loan
            </Button>
        </CardFooter>
    </Card >
);

const LoanedItemsTable = ({ loan, itemsStore }) => (
    <Card>
        <CardHeader>
            <CardTitle>Loaned Items</CardTitle>
        </CardHeader>
        <CardContent>
            {loan.item_id.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loan.item_id.map((itemId) => {
                            const item = itemsStore.getById(itemId);
                            return item ? (
                                <TableRow key={item.item_id}>
                                    <TableCell>
                                        <Img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-md" />
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/items/${item.item_id}`} className="font-semibold">
                                            {item.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.quantity || 1}</TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={itemId}>
                                    <TableCell colSpan={3}>Item #{itemId} not found</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-muted-foreground text-center py-4">No loaned items available.</p>
            )}
        </CardContent>
    </Card>
);

const LoanEditForm = ({ dateStart, setDateStart, dateEnd, setDateEnd, status, setStatus, handleUpdateLoan, handleCancelLoan }) => (

    <Card>
        <CardContent>
            <div
                className="CardContent flex flex-row gap-4 justify-center w-full pt-2 ">

                <form onSubmit={handleUpdateLoan} className="w-full m-0 p-0">
                    <div
                        className="flex w-full justify-between gap-2">


                        <FormField className="w-1/2" label="Date Start" id="date-start" type="date" value={dateStart} onChange={setDateStart} />
                        <FormField className="w-1/2" label="Date End" id="date-end" type="date" value={dateEnd} onChange={setDateEnd} />
                    </div>
                    <Button type="submit" className="mt-2 w-full bg-primary hover:bg-primary-dark">
                        Update Loan
                    </Button>
                </form>

            </div>
            <div
                className='flex flex-1'>
                <Button
                    onClick={handleCancelLoan} // 🔹 Fix function name here
                    className="mt-2 w-full bg-primary hover:bg-primary-dark">
                    Cancel Loan
                </Button>
            </div>

        </CardContent>
    </Card>
);

const FormField = ({ label, id, type, value, onChange }) => (
    <div className="grid gap-2">
        <label htmlFor={id}>{label}</label>
        <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
);


export default LoanDetailPage;