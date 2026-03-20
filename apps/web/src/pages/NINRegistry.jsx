import { useState } from 'react'
import { MdSearch, MdBadge, MdCheckCircle, MdCancel } from 'react-icons/md'

const mockRegistry = [
  { nin: '9903157001007', firstName: 'Chanda',  lastName: 'Mutale',   dob: '1999-03-15', gender: 'Male',   province: 'Lusaka',     status: 'active'    },
  { nin: '0111226001014', firstName: 'Mwape',   lastName: 'Bwalya',   dob: '2001-11-22', gender: 'Female', province: 'Copperbelt', status: 'active'    },
  { nin: '8507043003009', firstName: 'Joseph',  lastName: 'Phiri',    dob: '1985-07-04', gender: 'Male',   province: 'Eastern',    status: 'suspended' },
  { nin: '9205190002003', firstName: 'Grace',   lastName: 'Lungu',    dob: '1992-05-19', gender: 'Female', province: 'Southern',   status: 'active'    },
  { nin: '0008124001002', firstName: 'Kelvin',  lastName: 'Mwansa',   dob: '2000-08-12', gender: 'Male',   province: 'Northern',   status: 'active'    },
  { nin: '9401085002006', firstName: 'Namukolo',lastName: 'Siame',    dob: '1994-01-08', gender: 'Female', province: 'Western',    status: 'active'    },
  { nin: '8812317001003', firstName: 'Patrick', lastName: 'Zulu',     dob: '1988-12-31', gender: 'Male',   province: 'Luapula',    status: 'revoked'   },
  { nin: '9706224002008', firstName: 'Monde',   lastName: 'Kabwe',    dob: '1997-06-22', gender: 'Female', province: 'Muchinga',   status: 'active'    },
]

const statusStyle = {
  active:    'bg-green-100 text-green-700',
  suspended: 'bg-yellow-100 text-yellow-700',
  revoked:   'bg-red-100 text-red-700',
}

export default function NINRegistry() {
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = mockRegistry.filter((c) => {
    const q = query.toLowerCase()
    return (
      c.nin.includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <MdBadge size={24} className="text-green-700" />
          <h2 className="text-lg font-semibold text-gray-800">NIN Registry</h2>
        </div>
        <p className="text-sm text-gray-500">
          Search and manage all issued National Identity Numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by NIN, name or province..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">NIN</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Province</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.nin}
                      onClick={() => setSelected(c)}
                      className={`hover:bg-green-50 cursor-pointer transition-colors ${
                        selected?.nin === c.nin ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-green-700 font-medium">{c.nin}</td>
                      <td className="px-4 py-3 text-gray-800">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{c.province}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {mockRegistry.length} records
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
              <MdBadge size={48} className="mb-3 opacity-30" />
              <p className="text-sm">Select a record to view details</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Citizen Detail</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">National ID Number</p>
                <p className="font-mono font-bold text-green-700 text-xl tracking-widest">{selected.nin}</p>
              </div>

              {[
                { label: 'First Name',    value: selected.firstName  },
                { label: 'Last Name',     value: selected.lastName   },
                { label: 'Date of Birth', value: selected.dob        },
                { label: 'Gender',        value: selected.gender     },
                { label: 'Province',      value: selected.province   },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="font-medium text-gray-800">{row.value}</span>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800 transition-colors">
                  <MdCheckCircle size={14} /> Verify
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                  <MdCancel size={14} /> Revoke
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}