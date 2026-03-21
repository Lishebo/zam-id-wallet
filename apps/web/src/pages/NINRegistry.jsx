import { useState, useEffect } from 'react'
import { MdSearch, MdBadge, MdCheckCircle, MdCancel } from 'react-icons/md'
import { enrolmentAPI, verificationAPI } from '../api'

const statusStyle = {
  active:    'bg-green-100 text-green-700',
  suspended: 'bg-yellow-100 text-yellow-700',
  revoked:   'bg-red-100 text-red-700',
}

export default function NINRegistry() {
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)

  useEffect(() => {
    enrolmentAPI.get('/citizens')
      .then(res => setCitizens(res.data.citizens || []))
      .catch(() => setCitizens([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = citizens.filter((c) => {
    const q = query.toLowerCase()
    return (
      c.nin?.toLowerCase().includes(q) ||
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q)
    )
  })

  const handleVerify = async (nin) => {
    setVerifying(true)
    setVerifyResult(null)
    try {
      const res = await verificationAPI.get(`/verify/${nin}`)
      setVerifyResult({ success: true, ...res.data })
    } catch (err) {
      setVerifyResult({ success: false, error: err.response?.data?.error || 'Verification failed' })
    } finally {
      setVerifying(false)
    }
  }

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
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by NIN or name..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">NIN</th>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Gender</th>
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
                        onClick={() => { setSelected(c); setVerifyResult(null) }}
                        className={`hover:bg-green-50 cursor-pointer transition-colors ${
                          selected?.nin === c.nin ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-green-700 font-medium">{c.nin}</td>
                        <td className="px-4 py-3 text-gray-800 capitalize">{c.first_name} {c.last_name}</td>
                        <td className="px-4 py-3 text-gray-500 capitalize">{c.gender}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[c.status] || statusStyle.active}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {citizens.length} records
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[selected.status] || statusStyle.active}`}>
                  {selected.status}
                </span>
              </div>

              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">National ID Number</p>
                <p className="font-mono font-bold text-green-700 text-xl tracking-widest">{selected.nin}</p>
              </div>

              {[
                { label: 'First Name',    value: selected.first_name  },
                { label: 'Last Name',     value: selected.last_name   },
                { label: 'Date of Birth', value: selected.date_of_birth?.slice(0, 10) },
                { label: 'Gender',        value: selected.gender      },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="font-medium text-gray-800 capitalize">{row.value}</span>
                </div>
              ))}

              {/* Verify Result */}
              {verifyResult && (
                <div className={`p-3 rounded-lg text-sm ${
                  verifyResult.success
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {verifyResult.success
                    ? '✓ Identity verified — Trust Triangle complete'
                    : `✗ ${verifyResult.error}`}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleVerify(selected.nin)}
                  disabled={verifying}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  <MdCheckCircle size={14} />
                  {verifying ? 'Verifying...' : 'Verify'}
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