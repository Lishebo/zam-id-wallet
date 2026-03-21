import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Enrolment from './pages/Enrolment'
import NINRegistry from './pages/NINRegistry'
import CivilRegistration from './pages/CivilRegistration'
import GSBMonitor from './pages/GSBMonitor'
import Login from './pages/Login'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enrolment" element={<Enrolment />} />
        <Route path="nin-registry" element={<NINRegistry />} />
        <Route path="civil-registration" element={<CivilRegistration />} />
        <Route path="gsb-monitor" element={<GSBMonitor />} />
      </Route>
    </Routes>
  )
}