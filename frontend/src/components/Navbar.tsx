import { Link, useLocation } from 'react-router-dom'
import { Cloud, MapPin, Target, Leaf, TrendingUp, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Cloud },
    { path: '/assess', label: 'Risk Assessment', icon: MapPin },
    { path: '/actions', label: 'Action Plan', icon: Target },
    { path: '/footprint', label: 'Carbon Footprint', icon: Leaf },
    { path: '/predictions', label: 'Predictions', icon: TrendingUp },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">
              Climate Risk Planner
            </span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
