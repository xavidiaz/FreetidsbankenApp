import { useItemsStore } from '@/store/useFreetidsbanken';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import { Link } from 'react-router-dom';


const ItemsPage = () => {

    const itemsStore = useItemsStore();

    return (
        <>
            <FilterInputComponent placeholder="Search Items..." store={useItemsStore} filterKey="name" />
            <PageLayout
                title="Items"
                data={itemsStore.getFiltered()}
                renderItem={(item) => (
                    <Link to={`/items/${item.item_id}`}>{item.name}</Link>
                )}
                entity="items"
            />
        </>
    );
};

export default ItemsPage;