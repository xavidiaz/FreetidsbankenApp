import { useItemsStore } from "@/store/useFreetidsbanken";
import { useEffect } from "react";

const ListGetComponent = ({ title, data, renderItem }) => {
    const itemsStore = useItemsStore();

    useEffect(() => {
        itemsStore.getAll();
    }, [data]);

    return (
        <div>
            <h2>{title}</h2>
            {data && data.length > 0 ? (
                <ul>
                    {data.map((item, index) => (
                        <li
                            key={index}

                        >
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default ListGetComponent;
