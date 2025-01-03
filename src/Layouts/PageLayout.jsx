import { Link } from 'react-router-dom';

const PageLayout = ({ title, data, renderItem, entity }) => {
    return (
        <div>
            <h1>{title}</h1>
            <Link to={`/${entity}/new`}>Add New {title}</Link>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        <Link to={`/${entity}/${item.id}`}>{renderItem(item)}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PageLayout;
