import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Plus, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { calculateFootprint, getFootprintSummary, getFootprintCategories } from '../services/api'
import { useStore } from '../store/useStore'

const CarbonFootprint = () => {
  const { userId } = useStore()
  const [categories, setCategories] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    loadSummary()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getFootprintCategories()
      setCategories(data)
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0])
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const loadSummary = async () => {
    try {
      const data = await getFootprintSummary(userId)
      setSummary(data)
    } catch (error) {
      console.error('Failed to load summary')
    }
  }

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !selectedActivity || !amount) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const result = await calculateFootprint({
        user_id: userId,
        category: selectedCategory,
        activity_type: selectedActivity,
        amount: parseFloat(amount),
        unit: 'unit',
      })

      toast.success(`Calculated: ${result.emissions_kg.toFixed(2)} kg CO₂`)
      setAmount('')
      loadSummary()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to calculate footprint')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      transportation: 'bg-blue-500',
      energy: 'bg-yellow-500',
      food: 'bg-green-500',
      goods: 'bg-purple-500',
    }
    return colors[category] || 'bg-gray-500'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carbon Footprint Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Track and reduce your environmental impact
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary-600" />
            Add Activity
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setSelectedActivity('')
                }}
                className="input-field"
              >
                {categories?.categories.map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select activity</option>
                  {categories?.details[selectedCategory]?.map((activity: string) => (
                    <option key={activity} value={activity}>
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter quantity"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Calculating...' : 'Calculate Carbon Footprint'}
            </button>
          </form>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Emissions</div>
                <div className="text-3xl font-bold text-gray-900">
                  {summary?.total_emissions_kg?.toFixed(2) || 0} kg
                </div>
                <div className="text-sm text-gray-600">
                  {summary?.total_emissions_tons?.toFixed(4) || 0} tons CO₂
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <div className="text-sm text-gray-700">
                📊 <strong>{summary?.total_entries || 0}</strong> activities tracked
              </div>
              <div className="text-sm text-gray-700">
                📈 Average: <strong>{summary?.average_per_entry?.toFixed(2) || 0}</strong> kg per activity
              </div>
            </div>
          </div>

          {summary?.by_category && Object.keys(summary.by_category).length > 0 && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Emissions by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(summary.by_category).map(([category, emissions]: [string, any]) => {
                  const percentage = (emissions / summary.total_emissions_kg) * 100
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-sm font-bold">{emissions.toFixed(2)} kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getCategoryColor(category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Reduce Your Impact</h3>
                <p className="text-sm text-gray-700">
                  Track your activities to identify areas for improvement
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CarbonFootprint
