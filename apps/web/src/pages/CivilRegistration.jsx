import { useState } from 'react'
import { MdChildCare, MdCheckCircle } from 'react-icons/md'

const initialForm = {
  childFirstName: '',
  childLastName: '',
  dateOfBirth: '',
  gender: '',
  placeOfBirth: '',
  motherNIN: '',
  fatherNIN: '',
  hospitalName: '',
}

const hospitals = [
  'University Teaching Hospital (UTH)',
  'Levy Mwanawasa University Teaching Hospital',
  'Ndola Teaching Hospital',
  'Kitwe Teaching Hospital',
  'Livingstone General Hospital',
  'Chipata General Hospital',
  'Kasama General Hospital',
  'Other',
]

export default function CivilRegistration() {
  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate birth-to-NIN pipeline via RabbitMQ
    await new Promise((r) => setTimeout(r, 1500))

    // Mock response — will be replaced with real civil-reg-service on :3004
    const regNumber = `BR-${Date.now().toString().slice(-8)}`
    const mockNIN   = `${form.dateOfBirth.replace(/-/g,'').slice(2,8)}${Math.floor(Math.random()*5)+( form.gender==='female'?0:5)}001007`

    setResult({
      registrationNumber: regNumber,
      assignedNIN: mockNIN,
      childName: `${form.childFirstName} ${form.childLastName}`,
      dateOfBirth: form.dateOfBirth,
      hospital: form.hospitalName,
    })
    setLoading(false)
  }

  const handleReset = () => {
    setForm(initialForm)
    setResult(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1">
          <MdChildCare size={24} className="text-green-700" />
          <h2 className="text-lg font-semibold text-gray-800">Civil Registration</h2>
        </div>
        <p className="text-sm text-gray-500">
          Register a birth and automatically trigger NIN assignment via the identity pipeline.
        </p>
      </div>

      {/* Success */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <MdCheckCircle size={24} />
            <span className="font-semibold text-lg">Birth Registered Successfully</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Registration Number</p>
              <p className="font-mono font-bold text-green-700">{result.registrationNumber}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Assigned NIN</p>
              <p className="font-mono font-bold text-green-700">{result.assignedNIN}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Child Name</p>
              <p className="font-medium text-gray-800">{result.childName}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-gray-400 text-xs">Hospital</p>
              <p className="font-medium text-gray-800">{result.hospital}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-green-100 text-sm text-green-700">
            ✓ Birth event published to RabbitMQ — NIN assigned automatically via identity pipeline.
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 border border-green-600 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Register Another Birth
          </button>
        </div>
      )}

      {/* Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          <h3 className="font-medium text-gray-700 border-b pb-2">Child Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                name="childFirstName"
                value={form.childFirstName}
                onChange={handleChange}
                required
                placeholder="e.g. Mutinta"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                name="childLastName"
                value={form.childLastName}
                onChange={handleChange}
                required
                placeholder="e.g. Banda"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              <input
                name="placeOfBirth"
                value={form.placeOfBirth}
                onChange={handleChange}
                placeholder="e.g. Lusaka"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / Clinic</label>
              <select
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select hospital</option>
                {hospitals.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="font-medium text-gray-700 border-b pb-2 pt-2">Parent Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's NIN</label>
              <input
                name="motherNIN"
                value={form.motherNIN}
                onChange={handleChange}
                placeholder="13-digit NIN"
                maxLength={13}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's NIN</label>
              <input
                name="fatherNIN"
                value={form.fatherNIN}
                onChange={handleChange}
                placeholder="13-digit NIN"
                maxLength={13}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering Birth & Assigning NIN...' : 'Register Birth & Assign NIN'}
          </button>

        </form>
      )}
    </div>
  )
}