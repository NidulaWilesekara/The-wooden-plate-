import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './customer/context/CartContext.jsx'
import { CustomerAuthProvider } from './contexts/CustomerAuthContext.jsx'

// Customer Pages (Public)
import HomePage from './customer/pages/HomePage.jsx'
import AboutPage from './customer/pages/AboutPage.jsx'
import MenuPage from './customer/pages/MenuPage.jsx'
import CartPage from './customer/pages/CartPage.jsx'
import CheckoutPage from './customer/pages/CheckoutPage.jsx'
import OrderTrackingPage from './customer/pages/OrderTrackingPage.jsx'

// Customer Auth Pages
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'

// Customer Management (Admin)
import CustomerList from './admin/pages/customers/CustomerList.jsx'
import CreateCustomer from './admin/pages/customers/CreateCustomer.jsx'
import EditCustomer from './admin/pages/customers/EditCustomer.jsx'
import ViewCustomer from './admin/pages/customers/ViewCustomer.jsx'

// Order Pages
import OrderList from './admin/pages/orders/OrderList.jsx'
import ViewOrder from './admin/pages/orders/ViewOrder.jsx'

// Product Pages
import ProductList from './admin/pages/products/ProductList.jsx'
import CreateProduct from './admin/pages/products/CreateProduct.jsx'
import EditProduct from './admin/pages/products/EditProduct.jsx'
import ViewProduct from './admin/pages/products/ViewProduct.jsx'

// Promotion Pages
import PromotionList from './admin/pages/promotions/PromotionList.jsx'
import CreatePromotion from './admin/pages/promotions/CreatePromotion.jsx'
import EditPromotion from './admin/pages/promotions/EditPromotion.jsx'
import ViewPromotion from './admin/pages/promotions/ViewPromotion.jsx'

// Category Pages
import CategoryList from './admin/pages/categories/CategoryList.jsx'
import CreateCategory from './admin/pages/categories/CreateCategory.jsx'
import EditCategory from './admin/pages/categories/EditCategory.jsx'
import ViewCategory from './admin/pages/categories/ViewCategory.jsx'

// Menu Item Pages
import MenuItemList from './admin/pages/menu-items/MenuItemList.jsx'
import CreateMenuItem from './admin/pages/menu-items/CreateMenuItem.jsx'
import EditMenuItem from './admin/pages/menu-items/EditMenuItem.jsx'
import ViewMenuItem from './admin/pages/menu-items/ViewMenuItem.jsx'

// Table Pages
import TableList from './admin/pages/tables/TableList.jsx'
import CreateTable from './admin/pages/tables/CreateTable.jsx'
import EditTable from './admin/pages/tables/EditTable.jsx'

// Reservation Pages
import ReservationList from './admin/pages/reservations/ReservationList.jsx'

// Reports Pages
import Reports from './admin/pages/reports/Reports.jsx'

// Inventory Pages
import InventoryDashboard from './admin/pages/inventory/InventoryDashboard.jsx'
import IngredientList from './admin/pages/ingredients/IngredientList.jsx'
import CreateIngredient from './admin/pages/ingredients/CreateIngredient.jsx'
import EditIngredient from './admin/pages/ingredients/EditIngredient.jsx'
import StockMovementList from './admin/pages/stock-movements/StockMovementList.jsx'

// Settings Pages
import SettingsList from './admin/pages/settings/SettingsList.jsx'
import CreateSetting from './admin/pages/settings/CreateSetting.jsx'
import EditSetting from './admin/pages/settings/EditSetting.jsx'
import ViewSetting from './admin/pages/settings/ViewSetting.jsx'

function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer Routes (Public) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderNumber" element={<OrderTrackingPage />} />
          
          {/* Customer Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* Customer Routes */}
      <Route path="/admin/customers" element={<CustomerList />} />
      <Route path="/admin/customers/create" element={<CreateCustomer />} />
      <Route path="/admin/customers/edit/:id" element={<EditCustomer />} />
      <Route path="/admin/customers/view/:id" element={<ViewCustomer />} />
      
      {/* Order Routes */}
      <Route path="/admin/orders" element={<OrderList />} />
      <Route path="/admin/orders/view/:id" element={<ViewOrder />} />
      
      {/* Product Routes */}
      <Route path="/admin/products" element={<ProductList />} />
      <Route path="/admin/products/create" element={<CreateProduct />} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      <Route path="/admin/products/view/:id" element={<ViewProduct />} />
      
      {/* Promotion Routes */}
      <Route path="/admin/promotions" element={<PromotionList />} />
      <Route path="/admin/promotions/create" element={<CreatePromotion />} />
      <Route path="/admin/promotions/edit/:id" element={<EditPromotion />} />
      <Route path="/admin/promotions/view/:id" element={<ViewPromotion />} />
      
      {/* Category Routes */}
      <Route path="/admin/categories" element={<CategoryList />} />
      <Route path="/admin/categories/create" element={<CreateCategory />} />
      <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
      <Route path="/admin/categories/:id" element={<ViewCategory />} />
      
      {/* Menu Item Routes */}
      <Route path="/admin/menu-items" element={<MenuItemList />} />
      <Route path="/admin/menu-items/create" element={<CreateMenuItem />} />
      <Route path="/admin/menu-items/:id/edit" element={<EditMenuItem />} />
      <Route path="/admin/menu-items/:id" element={<ViewMenuItem />} />
      
      {/* Table Routes */}
      <Route path="/admin/tables" element={<TableList />} />
      <Route path="/admin/tables/create" element={<CreateTable />} />
      <Route path="/admin/tables/:id/edit" element={<EditTable />} />
      
      {/* Reservation Routes */}
      <Route path="/admin/reservations" element={<ReservationList />} />
      
      {/* Inventory Routes */}
      <Route path="/admin/inventory" element={<InventoryDashboard />} />
      <Route path="/admin/ingredients" element={<IngredientList />} />
      <Route path="/admin/ingredients/create" element={<CreateIngredient />} />
      <Route path="/admin/ingredients/:id/edit" element={<EditIngredient />} />
      <Route path="/admin/stock-movements" element={<StockMovementList />} />
      
      {/* Reports Routes */}
      <Route path="/admin/reports" element={<Reports />} />
      
      {/* Settings Routes */}
      <Route path="/admin/settings" element={<SettingsList />} />
      <Route path="/admin/settings/create" element={<CreateSetting />} />
      <Route path="/admin/settings/edit/:id" element={<EditSetting />} />
      <Route path="/admin/settings/view/:id" element={<ViewSetting />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </CartProvider>
    </CustomerAuthProvider>
  )
}

export default App
