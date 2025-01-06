import { Link } from "react-router-dom";
import Img from "./Img";

const RelatedItemsDetailItem = ({ relatedItems }) => {
    return (
        <div>
            <h3 className="font-semibold">Similar Items</h3>
            {relatedItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {relatedItems.map((relatedItem) => (
                        <Link
                            key={relatedItem.item_id}
                            to={`/items/${relatedItem.item_id}`}
                            className="flex items-center gap-3 border p-2 rounded-md hover:bg-accent"
                        >
                            <Img src={relatedItem.thumbnail} alt={relatedItem.name} className="w-12 h-12 object-cover rounded-md" />
                            <span>{relatedItem.name}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No related items found.</p>
            )}
        </div>
    );
};

export default RelatedItemsDetailItem;