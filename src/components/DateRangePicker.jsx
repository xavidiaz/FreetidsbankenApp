import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { DayPicker } from "react-day-picker";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const DateRangePicker = () => {
    const { startDate, endDate, setStartDate, setEndDate } = useCartStore();

    // ✅ Maintain internal state for selection
    const [selectedRange, setSelectedRange] = useState({
        from: startDate ? new Date(startDate) : null,
        to: endDate ? new Date(endDate) : null,
    });

    // ✅ Sync Zustand state whenever the user selects a date range
    useEffect(() => {
        if (selectedRange?.from) {
            setStartDate(format(selectedRange.from, "yyyy-MM-dd"));
        } else {
            setStartDate(""); // Clear Zustand state when no date selected
        }

        if (selectedRange?.to) {
            setEndDate(format(selectedRange.to, "yyyy-MM-dd"));
        } else {
            setEndDate(""); // Clear Zustand state when no date selected
        }
    }, [selectedRange, setStartDate, setEndDate]);

    return (
        <Sheet>
            <SheetTrigger className="h-12 p-0  min-w-fit">
                {startDate && endDate ? `${startDate.slice(5)} to ${endDate.slice(5)}` : "Select Date Range"}
            </SheetTrigger>

            {/* 📌 Full-Width Sheet */}
            <SheetContent
                side="bottom"
                className="w-screen max-w-none h-[90vh] p-6 flex flex-col justify-between bg-white shadow-lg rounded-t-lg"
            >
                {/* 🔹 Header */}
                <SheetHeader className="text-center border-b pb-4">
                    <SheetTitle className="text-lg font-semibold">Select Date Range</SheetTitle>
                </SheetHeader>

                {/* 🗓️ Full-Width Date Picker */}
                <div className="flex flex-col items-center flex-1 justify-center">
                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={setSelectedRange} // ✅ Updates Zustand state
                        numberOfMonths={2}
                        classNames={{
                            today: "border-amber-500", // Highlight today
                            selected: "bg-amber-500 border-amber-500 text-white", // Highlight selection
                            root: "shadow-lg p-5 rounded-lg w-full bg-gray-100", // Full-width with a light background
                            chevron: "fill-amber-500", // Style navigation buttons
                        }}
                    />
                </div>

                {/* 🔹 Bottom Button */}
                <SheetClose asChild>
                    <Button type="submit">Save date range</Button>
                </SheetClose>
            </SheetContent>

        </Sheet>
    );
};

export default DateRangePicker;
