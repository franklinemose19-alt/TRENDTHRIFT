import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <aside className="flex w-56 flex-col border-r border-white/10 p-5">
      <span className="mb-8 font-display text-lg">THRIFT WEARs</span>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ' +
              (isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white')
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  )
}
