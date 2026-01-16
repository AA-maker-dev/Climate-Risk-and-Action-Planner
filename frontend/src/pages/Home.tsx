import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  MapPin, Target, Leaf, TrendingUp, AlertTriangle, 
  Shield, Cloud, Zap, Users, BarChart3 
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Risk Assessment',
      description: 'AI-powered analysis of climate risks specific to your location',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/assess'
    },
    {
      icon: Target,
      title: 'Action Plans',
      description: 'Personalized recommendations to mitigate climate risks',
      color: 'text-green-600',
      bg: 'bg-green-50',
      link: '/actions'
    },
    {
      icon: Leaf,
      title: 'Carbon Footprint',
      description: 'Track and reduce your environmental impact',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/footprint'
    },
    {
      icon: TrendingUp,
      title: 'Future Predictions',
      description: 'Forecast climate risks and trends for your area',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/predictions'
    },
  ]

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Shield, value: '50K+', label: 'Risk Assessments' },
    { icon: Cloud, value: '99.9%', label: 'Accuracy Rate' },
    { icon: BarChart3, value: '500+', label: 'Action Plans' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="inline-block mb-4 px-4 py-2 bg-primary-100 rounded-full">
          <span className="text-primary-700 font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Powered by Advanced AI
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          AI Climate Risk &
          <span className="text-primary-600"> Action Planner</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Assess climate risks for any location and get AI-powered action recommendations 
          to protect yourself, your family, and your property from climate change impacts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/assess" className="btn-primary">
            Start Risk Assessment
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            View Dashboard
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-amber-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Climate action is urgent - Start planning today
          </span>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card text-center"
            >
              <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          )
        })}
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Comprehensive Climate Risk Management
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <div className="card hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className={`${feature.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Enter Location',
              description: 'Provide your address or coordinates for analysis'
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'Our AI assesses climate risks using real-time data'
            },
            {
              step: '03',
              title: 'Get Action Plan',
              description: 'Receive personalized recommendations and timelines'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-primary-200 mb-4">{item.step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="card max-w-2xl mx-auto bg-gradient-to-br from-primary-600 to-blue-700 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Climate Action?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Start your free risk assessment today and get personalized recommendations
          </p>
          <Link 
            to="/assess" 
            className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
