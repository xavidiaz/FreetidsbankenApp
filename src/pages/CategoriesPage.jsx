import { useCategoriesStore } from '@/store/useFreetidsbanken';
import { Link } from 'react-router-dom';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';

const CategoriesPage = () => {
    const categoriesStore = useCategoriesStore();

    return (
        <>
            <FilterInputComponent placeholder="Search Categories..." store={useCategoriesStore} filterKey="name" />
            <PageLayout
                title="Categories"
                data={categoriesStore.getFiltered()}
                renderItem={(category) => (
                    <Link to={`/categories/${category.category_id}`}>{category.name}</Link>
                )}
                entity="categories"
            />
        </>
    );
};

export default CategoriesPage;