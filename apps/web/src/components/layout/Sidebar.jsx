import { NavLink } from 'react-router-dom'
import {
  MdDashboard,
  MdPersonAdd,
  MdBadge,
  MdChildCare,
  MdHub,
  MdLogout,
} from 'react-icons/md'

const navItems = [
  { to: '/',                   icon: <MdDashboard size={20} />,  label: 'Dashboard'          },
  { to: '/enrolment',          icon: <MdPersonAdd size={20} />,  label: 'Enrolment'          },
  { to: '/nin-registry',       icon: <MdBadge size={20} />,      label: 'NIN Registry'       },
  { to: '/civil-registration', icon: <MdChildCare size={20} />,  label: 'Civil Registration' },
  { to: '/gsb-monitor',        icon: <MdHub size={20} />,        label: 'GSB Monitor'        },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-green-800 text-white flex flex-col z-50">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-green-700">
        <h1 className="text-xl font-bold tracking-wide">ZAM-ID Wallet</h1>
        <p className="text-green-300 text-xs mt-1">Issuer Dashboard</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-green-200 hover:bg-green-700 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-green-700">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-green-200 hover:bg-green-700 hover:text-white w-full transition-colors">
          <MdLogout size={20} />
          Logout
        </button>
      </div>

    </aside>
  )
}