import { MdNotifications, MdAccountCircle } from 'react-icons/md'

export default function Topbar({ pageTitle }) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      
      {/* Page Title */}
      <h2 className="text-gray-800 font-semibold text-lg">{pageTitle}</h2>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative text-gray-500 hover:text-green-700 transition-colors">
          <MdNotifications size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <MdAccountCircle size={32} className="text-green-700" />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Admin Officer</p>
            <p className="text-gray-400 text-xs">Lusaka Region</p>
          </div>
        </div>

      </div>
    </header>
  )
}