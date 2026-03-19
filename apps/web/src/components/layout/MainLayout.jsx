import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/':                   'Dashboard',
  '/enrolment':          'Citizen Enrolment',
  '/nin-registry':       'NIN Registry',
  '/civil-registration': 'Civil Registration',
  '/gsb-monitor':        'GSB Monitor',
}

export default function MainLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'ZAM-ID Wallet'

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Topbar pageTitle={title} />
      <main className="ml-64 pt-16 p-6">
        <Outlet />
      </main>
    </div>
  )
}