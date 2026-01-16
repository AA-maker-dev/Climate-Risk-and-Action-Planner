import { motion } from 'framer-motion'
import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Climate Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Overview of your climate risk management
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: LayoutDashboard, label: 'Assessments', value: '3', color: 'blue' },
          { icon: CheckCircle2, label: 'Actions Taken', value: '12', color: 'green' },
          { icon: AlertTriangle, label: 'Active Risks', value: '5', color: 'red' },
          { icon: TrendingUp, label: 'Impact Score', value: '78', color: 'purple' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <Icon className={`w-8 h-8 text-${stat.color}-600 mb-3`} />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="card text-center py-12">
        <LayoutDashboard className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Coming Soon
        </h3>
        <p className="text-gray-600 mb-6">
          We're building an interactive dashboard to help you track and manage your climate actions
        </p>
      </div>
    </div>
  )
}

export default Dashboard
