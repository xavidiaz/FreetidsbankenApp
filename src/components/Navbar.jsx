import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/loans">Loans</Link></li>
                <li><Link to="/reviews">Reviews</Link></li>
                <li><Link to="/categories">Categories</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;