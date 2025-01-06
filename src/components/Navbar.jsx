import { Link } from 'react-router-dom';
import UserButton from '@/components/UserButton';
import { Home, FileText } from 'lucide-react';

const Navbar = () => {

    return (
        <div className="sticky top-0 left-0 w-full bg-secondary z-50 border-b-4 border-green-100">
            <nav className="flex items-center justify-between px-4">
                <Link to="/" className="flex items-center">
                    <Home className="mr-2" />
                    Home
                </Link>
                <Link to="/loans" className="flex items-center">
                    <FileText className="mr-2" />
                    Loans
                </Link>
                <UserButton />
            </nav>
        </div>
    );
};

export default Navbar;
