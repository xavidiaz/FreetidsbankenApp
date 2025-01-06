import { Routes, Route } from "react-router-dom";
import UsersPage from "@/pages/UsersPage";
import UserDetailPage from "@/pages/UserDetailPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import SignUpSuccessPage from "@/pages/SignUpSuccessPage";
import ItemsPage from "@/pages/ItemsPage";
import ItemDetailPage from "@/pages/ItemDetailPage";
import LoansPage from "@/pages/LoansPage";
import LoanDetailPage from "@/pages/LoanDetailPage";
import ReviewsPage from "@/pages/ReviewsPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryDetailPage from "@/pages/CategoryDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import Layout from "./Layouts/Layout"; // ✅ Import Layout (Correct Path)

// ✅ Wrap Everything Inside Layout
const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ItemsPage />} /> {/* Default Home Page */}
        <Route path="login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-success" element={<SignUpSuccessPage />} /> {/* ✅ New Route */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="items/:id" element={<ItemDetailPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="loans/:id" element={<LoanDetailPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reviews/:id" element={<ReviewDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:id" element={<CategoryDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout-success/:loanId" element={<CheckoutSuccessPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
