import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'

// Customer Pages
import CustomerList from './admin/pages/customers/CustomerList.jsx'
import CreateCustomer from './admin/pages/customers/CreateCustomer.jsx'
import EditCustomer from './admin/pages/customers/EditCustomer.jsx'
import ViewCustomer from './admin/pages/customers/ViewCustomer.jsx'

// Settings Pages
import SettingsList from './admin/pages/settings/SettingsList.jsx'
import CreateSetting from './admin/pages/settings/CreateSetting.jsx'
import EditSetting from './admin/pages/settings/EditSetting.jsx'
import ViewSetting from './admin/pages/settings/ViewSetting.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* Customer Routes */}
      <Route path="/admin/customers" element={<CustomerList />} />
      <Route path="/admin/customers/create" element={<CreateCustomer />} />
      <Route path="/admin/customers/edit/:id" element={<EditCustomer />} />
      <Route path="/admin/customers/view/:id" element={<ViewCustomer />} />
      
      {/* Settings Routes */}
      <Route path="/admin/settings" element={<SettingsList />} />
      <Route path="/admin/settings/create" element={<CreateSetting />} />
      <Route path="/admin/settings/edit/:id" element={<EditSetting />} />
      <Route path="/admin/settings/view/:id" element={<ViewSetting />} />
      
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

export default App
