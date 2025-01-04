import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DayPicker } from "react-day-picker";
import { useState, useEffect } from "react";
import { format } from "date-fns";

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
            <SheetTrigger className="px-4 py-2 border rounded-md bg-background text-foreground">
                {startDate && endDate ? `${startDate} - ${endDate}` : "Select Date Range"}
            </SheetTrigger>

            {/* 📌 Full-Width Sheet */}
            <SheetContent side="bottom" className="w-screen max-w-none h-[100vh] p-6 flex flex-col">
                <SheetHeader>
                    <SheetTitle>Select Date Range</SheetTitle>
                </SheetHeader>

                {/* 🗓️ Full-Width Date Picker */}
                <div className="w-full flex flex-col items-center">
                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={setSelectedRange} // ✅ Updates Zustand state
                        numberOfMonths={2}
                        classNames={{
                            today: "border-amber-500", // Highlight today
                            selected: "bg-amber-500 border-amber-500 text-white", // Highlight selection
                            root: "shadow-lg p-5 rounded-lg w-full", // Ensure full-width
                            chevron: "fill-amber-500", // Style navigation buttons
                        }}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default DateRangePicker;
