import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdShield, MdPerson, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'

const ROLES = {
  admin: { password: 'admin123', role: 'Admin', region: 'Lusaka Region' },
  officer: { password: 'officer123', role: 'Registration Officer', region: 'Copperbelt Region' },
  auditor: { password: 'auditor123', role: 'Auditor', region: 'Southern Region' },
}

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))

    const user = ROLES[form.username.toLowerCase()]

    if (!user || user.password !== form.password) {
      setError('Invalid username or password')
      setLoading(false)
      return
    }

    // Save session
    localStorage.setItem('zam_id_user', JSON.stringify({
      username: form.username,
      role: user.role,
      region: user.region,
    }))

    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center p-4">

      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
            <MdShield size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ZAM-ID Wallet</h1>
          <p className="text-green-300 mt-1">Issuer Dashboard · Secure Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <MdPerson size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <MdLock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* Demo Credentials */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demo Credentials</p>
            {Object.entries(ROLES).map(([username, { role }]) => (
              <button
                key={username}
                onClick={() => setForm({ username, password: ROLES[username].password })}
                className="w-full text-left text-xs text-gray-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 rounded transition-colors"
              >
                <span className="font-mono font-medium">{username}</span> — {role}
              </button>
            ))}
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-green-400 text-xs">
          ZAMREN 2026 · Kwame Nkrumah University · ZAM-ID Wallet
        </p>

      </div>
    </div>
  )
}