import { Routes, Route, Link } from 'react-router-dom';
import UsersPage from '@/pages/UsersPage';
import UserDetailPage from '@/pages/UserDetailPage';
import LoginPage from '@/pages/LoginPage';
import ItemsPage from '@/pages/ItemsPage';
import ItemDetailPage from '@/pages/ItemDetailPage';
import LoansPage from '@/pages/LoansPage';
import LoanDetailPage from '@/pages/LoanDetailPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ReviewDetailPage from '@/pages/ReviewDetailPage';
import CategoriesPage from '@/pages/CategoriesPage';
import CategoryDetailPage from '@/pages/CategoryDetailPage';
import UserButton from "@/components/UserButton";
import CartPage from '@/pages/CartPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import { useCartStore } from '@/store/useCartStore';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";



const App = () => {
  const cartStore = useCartStore();
  const totalItems = cartStore.getTotalItems(); // ✅ Call as a function

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Items</Link></li>
          <UserButton /> {/* User profile & login/logout button */}
        </ul>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/:id" element={<LoanDetailPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/reviews/:id" element={<ReviewDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout-success/:loanId" element={<CheckoutSuccessPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>

      <CartPage totalItems={totalItems} />
    </>
  );
};

export default App;
