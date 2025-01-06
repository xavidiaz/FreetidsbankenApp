import { useLoadingStore } from "@/store/useLoadingStore";

const WithLoading = ({ children, onExecute }) => {
    const setLoading = useLoadingStore((state) => state.setLoading);

    const handleAction = async () => {
        setLoading(true);
        try {
            await onExecute(); // Execute the provided async function
        } catch (error) {
            console.error("Error in WithLoading:", error);
        } finally {
            setLoading(false);
        }
    };

    return children(handleAction);
};

export default WithLoading;
