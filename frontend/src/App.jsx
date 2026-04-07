import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './customer/context/CartContext.jsx'

import HomePage from './customer/pages/HomePage.jsx'
import AboutPage from './customer/pages/AboutPage.jsx'
import MenuPage from './customer/pages/MenuPage.jsx'
import CartPage from './customer/pages/CartPage.jsx'
import GalleryPage from './customer/pages/GalleryPage.jsx'
import ContactPage from './customer/pages/ContactPage.jsx'

import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'

import ProductList from './admin/pages/products/ProductList.jsx'
import CreateProduct from './admin/pages/products/CreateProduct.jsx'
import EditProduct from './admin/pages/products/EditProduct.jsx'
import ViewProduct from './admin/pages/products/ViewProduct.jsx'

import PromotionList from './admin/pages/promotions/PromotionList.jsx'
import CreatePromotion from './admin/pages/promotions/CreatePromotion.jsx'
import EditPromotion from './admin/pages/promotions/EditPromotion.jsx'
import ViewPromotion from './admin/pages/promotions/ViewPromotion.jsx'

import CategoryList from './admin/pages/categories/CategoryList.jsx'
import CreateCategory from './admin/pages/categories/CreateCategory.jsx'
import EditCategory from './admin/pages/categories/EditCategory.jsx'
import ViewCategory from './admin/pages/categories/ViewCategory.jsx'

import MenuItemList from './admin/pages/menu-items/MenuItemList.jsx'
import CreateMenuItem from './admin/pages/menu-items/CreateMenuItem.jsx'
import EditMenuItem from './admin/pages/menu-items/EditMenuItem.jsx'
import ViewMenuItem from './admin/pages/menu-items/ViewMenuItem.jsx'

import SettingsList from './admin/pages/settings/SettingsList.jsx'
import CreateSetting from './admin/pages/settings/CreateSetting.jsx'
import EditSetting from './admin/pages/settings/EditSetting.jsx'

import GalleryList from './admin/pages/gallery/GalleryList.jsx'
import { ContactMessagesList, ContactMessageDetail } from './admin/pages/contact-messages/index.js'
import CustomerLayout from './customer/layout/customerLayout.jsx'

function App() {
  return (
    <CartProvider>
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{
          top: 88,
          left: 0,
          right: 0,
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111827',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 14px',
            boxShadow:
              '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          },
          success: {
            style: { background: '#16a34a' },
            iconTheme: { primary: '#fff', secondary: '#16a34a' },
          },
          error: {
            style: { background: '#dc2626' },
            iconTheme: { primary: '#fff', secondary: '#dc2626' },
          },
        }}
      />

      <Routes>
        <Route
          path="/"
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/menu"
          element={
            <CustomerLayout>
              <MenuPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/about"
          element={
            <CustomerLayout>
              <AboutPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <CustomerLayout>
              <GalleryPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <CustomerLayout>
              <ContactPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <CustomerLayout>
              <CartPage />
            </CustomerLayout>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/admin/products/view/:id" element={<ViewProduct />} />

        <Route path="/admin/promotions" element={<PromotionList />} />
        <Route path="/admin/promotions/create" element={<CreatePromotion />} />
        <Route path="/admin/promotions/edit/:id" element={<EditPromotion />} />
        <Route path="/admin/promotions/view/:id" element={<ViewPromotion />} />

        <Route path="/admin/categories" element={<CategoryList />} />
        <Route path="/admin/categories/create" element={<CreateCategory />} />
        <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
        <Route path="/admin/categories/:id" element={<ViewCategory />} />

        <Route path="/admin/menu-items" element={<MenuItemList />} />
        <Route path="/admin/menu-items/create" element={<CreateMenuItem />} />
        <Route path="/admin/menu-items/:id/edit" element={<EditMenuItem />} />
        <Route path="/admin/menu-items/:id" element={<ViewMenuItem />} />

        <Route path="/admin/settings" element={<SettingsList />} />
        <Route path="/admin/settings/create" element={<CreateSetting />} />
        <Route path="/admin/settings/edit/:id" element={<EditSetting />} />

        <Route path="/admin/gallery" element={<GalleryList />} />

        <Route path="/admin/contact-messages" element={<ContactMessagesList />} />
        <Route path="/admin/contact-messages/:id" element={<ContactMessageDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}

export default App
