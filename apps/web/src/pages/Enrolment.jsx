import { useState } from 'react'
import { enrolmentAPI } from '../api'
import { MdPersonAdd, MdCheckCircle } from 'react-icons/md'

const initialForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  province: '',
}

const provinces = [
  'Central', 'Copperbelt', 'Eastern', 'Luapula',
  'Lusaka', 'Muchinga', 'Northern', 'North-Western',
  'Southern', 'Western',
]

export default function Enrolment() {
  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await enrolmentAPI.post('/enrol', {
        firstName:   form.firstName,
        lastName:    form.lastName,
        dateOfBirth: form.dateOfBirth,
        gender:      form.gender,
      })
      setResult(res.data)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Enrolment service unavailable. Check that the backend is running on port 3001.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <MdPersonAdd size={24} className="text-green-700" />
          <h2 className="text-lg font-semibold text-gray-800">Citizen Enrolment</h2>
        </div>
        <p className="text-sm text-gray-500">
          Register a new citizen and generate their 13-digit INRIS National Identity Number.
        </p>
      </div>

      {/* Success Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <MdCheckCircle size={24} />
            <span className="font-semibold text-lg">Enrolment Successful</span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-100 space-y-2">
            <p className="text-sm text-gray-500">Generated NIN</p>
            <p className="text-3xl font-mono font-bold text-green-700 tracking-widest">
              {result.nin}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Full Name</p>
              <p className="font-medium text-gray-800">
                {result.citizen.firstName} {result.citizen.lastName}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Date of Birth</p>
              <p className="font-medium text-gray-800">{result.citizen.dateOfBirth}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Gender</p>
              <p className="font-medium text-gray-800 capitalize">{result.citizen.gender}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Biometric Hash</p>
              <p className="font-mono text-xs text-gray-600 truncate">{result.bioHash?.slice(0, 20)}...</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 border border-green-600 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Enrol Another Citizen
          </button>
        </div>
      )}

      {/* Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="e.g. Chanda"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="e.g. Mutale"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0977123456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select province</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating NIN...' : 'Enrol Citizen & Generate NIN'}
          </button>

        </form>
      )}
    </div>
  )
}