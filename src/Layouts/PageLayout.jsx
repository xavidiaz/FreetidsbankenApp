const PageLayout = ({ title, data, renderItem, entity }) => {
    return (
        <div>
            <h1>{title}</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        {renderItem(item)} {/* No automatic <Link> wrapping */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PageLayout;
