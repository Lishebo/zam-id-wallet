import { MdPeople, MdBadge, MdChildCare, MdHub } from 'react-icons/md'

const stats = [
  { label: 'Total Enrolments',      value: '1,342',  sub: '+12 today',   icon: <MdPeople size={28} />,    color: 'bg-blue-500'   },
  { label: 'NIns Issued',           value: '1,298',  sub: '97% success', icon: <MdBadge size={28} />,     color: 'bg-green-600'  },
  { label: 'Birth Registrations',   value: '204',    sub: '+3 today',    icon: <MdChildCare size={28} />, color: 'bg-yellow-500' },
  { label: 'GSB Transactions',      value: '87',     sub: 'Last 24hrs',  icon: <MdHub size={28} />,       color: 'bg-purple-500' },
]

const recent = [
  { nin: '9903157001007', name: 'Chanda Mutale',   gender: 'Male',   status: 'Active'  },
  { nin: '0111226001014', name: 'Mwape Bwalya',    gender: 'Female', status: 'Active'  },
  { nin: '8507043003009', name: 'Joseph Phiri',    gender: 'Male',   status: 'Pending' },
  { nin: '9205190002003', name: 'Grace Lungu',     gender: 'Female', status: 'Active'  },
  { nin: '0008124001002', name: 'Kelvin Mwansa',   gender: 'Male',   status: 'Active'  },
]

export default function Dashboard() {
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
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
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
              {recent.map((r) => (
                <tr key={r.nin} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-green-700 font-medium">{r.nin}</td>
                  <td className="px-6 py-3 text-gray-800">{r.name}</td>
                  <td className="px-6 py-3 text-gray-500">{r.gender}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}