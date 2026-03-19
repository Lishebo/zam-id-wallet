import { MdHub, MdCheckCircle, MdError, MdPending } from 'react-icons/md'

const services = [
  { name: 'MTN MoMo',      type: 'Mobile Money', status: 'online',  latency: '120ms', transactions: 34 },
  { name: 'Airtel Money',  type: 'Mobile Money', status: 'online',  latency: '98ms',  transactions: 28 },
  { name: 'Zamtel Money',  type: 'Mobile Money', status: 'online',  latency: '145ms', transactions: 12 },
  { name: 'ZRA',           type: 'Government',   status: 'online',  latency: '203ms', transactions: 7  },
  { name: 'ECZ',           type: 'Government',   status: 'pending', latency: '--',    transactions: 0  },
  { name: 'SmartCare',     type: 'Health',       status: 'online',  latency: '178ms', transactions: 6  },
]

const recentTransactions = [
  { ref: 'TXN-00123', citizen: '9903157001007', service: 'MTN MoMo',     type: 'KYC_CHECK',          status: 'completed', time: '14:32' },
  { ref: 'TXN-00122', citizen: '0111226001014', service: 'Airtel Money',  type: 'MOBILE_MONEY_ONBOARD',status: 'completed', time: '14:28' },
  { ref: 'TXN-00121', citizen: '9205190002003', service: 'ZRA',           type: 'TAX_CLEARANCE',      status: 'completed', time: '14:15' },
  { ref: 'TXN-00120', citizen: '0008124001002', service: 'MTN MoMo',     type: 'KYC_CHECK',          status: 'failed',    time: '14:02' },
  { ref: 'TXN-00119', citizen: '9401085002006', service: 'SmartCare',    type: 'KYC_CHECK',          status: 'completed', time: '13:55' },
]

const statusIcon = {
  online:  <MdCheckCircle size={16} className="text-green-500" />,
  offline: <MdError size={16} className="text-red-500" />,
  pending: <MdPending size={16} className="text-yellow-500" />,
}

const statusDot = {
  online:  'bg-green-500',
  offline: 'bg-red-500',
  pending: 'bg-yellow-500',
}

const txStatusStyle = {
  completed: 'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-700',
  pending:   'bg-yellow-100 text-yellow-700',
}

export default function GSBMonitor() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <MdHub size={24} className="text-green-700" />
          <h2 className="text-lg font-semibold text-gray-800">GSB Integration Monitor</h2>
        </div>
        <p className="text-sm text-gray-500">
          Real-time status of all Government Service Bus integrations and NIN-verified transactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-green-700">5</p>
          <p className="text-sm text-gray-500 mt-1">Services Online</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-gray-800">87</p>
          <p className="text-sm text-gray-500 mt-1">Transactions Today</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-red-500">1</p>
          <p className="text-sm text-gray-500 mt-1">Failed Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Service Health */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Service Health</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {services.map((s) => (
              <div key={s.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${statusDot[s.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{s.latency}</span>
                  <span className="text-gray-500">{s.transactions} txns</span>
                  {statusIcon[s.status]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((t) => (
              <div key={t.ref} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-green-700 font-medium">{t.ref}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${txStatusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{t.service} — {t.type}</span>
                  <span>{t.time}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">NIN: {t.citizen}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}