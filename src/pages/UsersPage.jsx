import { useUsersStore } from '@/store/useFreetidsbanken';
import FilterInputComponent from '@/components/FilterInputComponent';
import PageLayout from '@/Layouts/PageLayout';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const usersStore = useUsersStore();

    return (
        <>
            <FilterInputComponent placeholder="Search Users..." store={useUsersStore} filterKey="user" />
            <PageLayout
                title="Users"
                data={usersStore.getFiltered()}
                renderItem={(user) => (
                    <Link to={`/users/${user.user_id}`}>{user.name}</Link>
                )}
                entity="users"
            />
        </>
    );
};

export default UsersPage;