import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  )
}

export default App
