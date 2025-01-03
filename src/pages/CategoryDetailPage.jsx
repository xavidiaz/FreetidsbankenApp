import { useParams } from 'react-router-dom';
import { useCategoriesStore } from '@/store/useFreetidsbanken';

const CategoryDetailPage = () => {
    const { id } = useParams();
    const categoriesStore = useCategoriesStore();
    const category = categoriesStore.getById(Number(id)); // Convert id to number


    if (!category) {
        return <h1>Category not found</h1>;
    }

    return (
        <div>
            <h1>{category.name}</h1>
            <p>Category ID: {category.category_id}</p>
        </div>
    );
};

export default CategoryDetailPage;
