const PageLayout = ({ title, data, renderItem, entity }) => {
    return (
        <div className="">
            <ul>
                {data.map((item) => {
                    const itemId = item.item_id || item.user_id || item.loan_id || item.review_id || item.category_id;
                    return (
                        <li key={itemId}> {/* ✅ Uses correct ID based on entity type */}
                            {renderItem(item)}
                        </li>
                    );
                })}
            </ul>

        </div>
    );
};

export default PageLayout;
