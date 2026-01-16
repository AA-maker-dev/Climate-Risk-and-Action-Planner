import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Loader, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { generatePredictions, getClimateScenarios } from '../services/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Predictions = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [years, setYears] = useState(10)
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<any>(null)
  const [scenario, setScenario] = useState<any>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!latitude || !longitude) {
      toast.error('Please enter coordinates')
      return
    }

    setLoading(true)

    try {
      const [predData, scenarioData] = await Promise.all([
        generatePredictions({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          years,
        }),
        getClimateScenarios(parseFloat(latitude), parseFloat(longitude), 'moderate'),
      ])

      setPredictions(predData)
      setScenario(scenarioData)
      toast.success('Predictions generated!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate predictions')
    } finally {
      setLoading(false)
    }
  }

  const getChartData = () => {
    if (!predictions) return null

    const labels = predictions.predictions.map((p: any) => p.year)

    return {
      labels,
      datasets: [
        {
          label: 'Overall Risk Score',
          data: predictions.predictions.map((p: any) => p.overall_risk),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
        },
        {
          label: 'Temperature Change (°C)',
          data: predictions.predictions.map((p: any) => p.temperature_change * 10),
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          fill: true,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Climate Risk Projections',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Climate Predictions
        </h1>
        <p className="text-lg text-gray-600">
          Forecast future climate risks and trends
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 40.7128"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., -74.0060"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years to Forecast
              </label>
              <select
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={5}>5 years</option>
                <option value={10}>10 years</option>
                <option value={20}>20 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Generate Predictions
              </>
            )}
          </button>
        </form>
      </motion.div>

      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Trends Overview */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Climate Trends</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <div className="text-sm text-gray-600 mb-1">Temperature Increase</div>
                <div className="text-3xl font-bold text-red-600">
                  +{predictions.trends.temperature.total_increase}°C
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  By {new Date().getFullYear() + years}
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <div className="text-sm text-gray-600 mb-1">Risk Increase</div>
                <div className="text-3xl font-bold text-orange-600">
                  +{predictions.trends.overall_risk.increase_percent}%
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  From {predictions.trends.overall_risk.current} to {predictions.trends.overall_risk.future}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Sea Level Rise</div>
                <div className="text-3xl font-bold text-blue-600">
                  {predictions.trends.sea_level.total_rise_mm}mm
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Rate: {predictions.trends.sea_level.annual_rate}mm/year
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Projections</h3>
            <div className="h-80">
              <Line data={getChartData()!} options={chartOptions} />
            </div>
          </div>

          {/* Scenario */}
          {scenario && (
            <div className="card bg-yellow-50 border-2 border-yellow-200">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Climate Scenario: {scenario.scenario.toUpperCase()}
                  </h3>
                  <p className="text-gray-700 mb-4">{scenario.data.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm text-gray-600">Temperature Increase by 2050</div>
                      <div className="text-xl font-bold text-gray-900">
                        +{scenario.data.temperature_increase_2050}°C
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm text-gray-600">Sea Level Rise by 2050</div>
                      <div className="text-xl font-bold text-gray-900">
                        {scenario.data.sea_level_rise_2050_cm}cm
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {scenario.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-primary-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Predictions
