import { useState, useEffect, useMemo } from "react";
import { useItemsStore } from "@/store/useFreetidsbanken";
import { useParams } from "react-router-dom";
import RelatedItems from "@/components/RelatedItems";

const DetailLayout = ({ title, children }) => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const itemsStore = useItemsStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setItem(itemsStore.getById(Number(id)));
        }, 500);

        return () => clearTimeout(timer);
    }, [id, itemsStore]);

    const relatedItems = useMemo(() => {
        if (!item) return [];
        return itemsStore.getAll().filter(
            (i) => i.category_id === item.category_id && i.item_id !== item.item_id
        );
    }, [item, itemsStore]);

    if (!item) return <p className="text-muted-foreground text-center">Loading item details...</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div>{children}</div>

            {/* Pass related items to the merged component */}
            <RelatedItems relatedItems={relatedItems} />
        </div>
    );
};

export default DetailLayout;
