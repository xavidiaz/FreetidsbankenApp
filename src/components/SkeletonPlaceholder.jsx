import { Skeleton } from "@/components/ui/skeleton";

const SkeletonItem = () => (
    <div className="flex gap-4 items-center p-4 border-b">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="flex-1">
            <Skeleton className="w-32 h-4 mb-2" />
            <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-16 h-6" />
    </div>
);

const SkeletonReview = () => (
    <div className="flex gap-4 items-start p-4 border-b">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-1/2 h-4" />
        </div>
    </div>
);

const SkeletonCartItem = () => (
    <div className="flex gap-4 items-center p-4 border-b">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="flex-1">
            <Skeleton className="w-32 h-4 mb-2" />
            <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-10 h-6" />
    </div>
);

const SkeletonLoanDetails = () => (
    <div className="space-y-4">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-40 h-40" />
    </div>
);

const SkeletonProfile = () => (
    <div className="flex flex-col items-center space-y-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-40 h-4" />
    </div>
);

const SkeletonNoItems = () => (
    <div className="flex flex-col items-center justify-center p-6">
        <Skeleton className="w-12 h-12 rounded-full mb-2" />
        <Skeleton className="w-40 h-4 mb-2" />
        <Skeleton className="w-24 h-4" />
    </div>
);


// 🔹 Export all skeletons for easy usage
export const SkeletonPlaceholder = {
    Item: SkeletonItem,
    Review: SkeletonReview,
    CartItem: SkeletonCartItem,
    LoanDetails: SkeletonLoanDetails,
    Profile: SkeletonProfile,
    NoItems: SkeletonNoItems,
};

export default SkeletonPlaceholder;
