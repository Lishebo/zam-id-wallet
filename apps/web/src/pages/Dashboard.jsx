import { useState, useEffect } from 'react'
import { MdPeople, MdBadge, MdChildCare, MdHub } from 'react-icons/md'
import { enrolmentAPI } from '../api'

export default function Dashboard() {
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    enrolmentAPI.get('/citizens')
      .then(res => setCitizens(res.data.citizens || []))
      .catch(() => setCitizens([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Enrolments',    value: citizens.length,                                          sub: 'From database',   icon: <MdPeople size={28} />,    color: 'bg-blue-500'   },
    { label: 'NIns Issued',         value: citizens.filter(c => c.status === 'active').length,       sub: 'Active NIns',     icon: <MdBadge size={28} />,     color: 'bg-green-600'  },
    { label: 'Birth Registrations', value: 0,                                                        sub: 'Civil reg',       icon: <MdChildCare size={28} />, color: 'bg-yellow-500' },
    { label: 'GSB Transactions',    value: 0,                                                        sub: 'Last 24hrs',      icon: <MdHub size={28} />,       color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${s.color} text-white rounded-lg p-3`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xs text-green-600 font-medium">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enrolments Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Enrolments</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400">Loading...</div>
          ) : citizens.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400">No enrolments yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">NIN</th>
                  <th className="px-6 py-3 text-left">Full Name</th>
                  <th className="px-6 py-3 text-left">Gender</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {citizens.map((c) => (
                  <tr key={c.nin} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-green-700 font-medium">{c.nin}</td>
                    <td className="px-6 py-3 text-gray-800">{c.first_name} {c.last_name}</td>
                    <td className="px-6 py-3 text-gray-500 capitalize">{c.gender}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        c.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}