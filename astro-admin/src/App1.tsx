import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ClientsPage } from './pages/ClientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { logout } from './lib/auth'

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <h2>Astro Admin</h2>
          <p>Quartier generale</p>
        </div>

        <nav className="admin-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/clienti">Clienti</NavLink>
          <NavLink to="/ordini">Ordini</NavLink>
          <NavLink to="/statistiche">Statistiche</NavLink>
        </nav>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </main>
  )
}

function OrdersPage() {
  return (
    <article className="card">
      <h1>Ordini</h1>
      <p>Area ordini pronta per integrazione dati reali.</p>
    </article>
  )
}

function StatisticsPage() {
  return (
    <article className="card">
      <h1>Statistiche</h1>
      <p>Area statistiche pronta per integrazione dati reali.</p>
    </article>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clienti" element={<ClientsPage />} />
        <Route path="ordini" element={<OrdersPage />} />
        <Route path="statistiche" element={<StatisticsPage />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
