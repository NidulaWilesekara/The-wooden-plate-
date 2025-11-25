import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const u = localStorage.getItem('admin_user')
    if (!token) {
      navigate('/admin/login', { replace: true })
      return
    }
    setUser(u ? JSON.parse(u) : null)
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="brand-mini">🍽️ The Wooden Plate</div>
        <div className="spacer" />
        <button className="ghost" onClick={handleLogout}>Logout</button>
      </header>
      <main className="dash-main">
        <div className="dash-card">
          <h2>Welcome{user?.name ? `, ${user.name}` : ''} 👋</h2>
          <p>This is a placeholder dashboard. After backend endpoints are ready, we’ll fetch stats here.</p>
        </div>
      </main>
    </div>
  )
}
