import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { assessRisk, RiskAssessmentResponse } from '../services/api'
import { useStore } from '../store/useStore'

const RiskAssessment = () => {
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [assessment, setAssessmentData] = useState<RiskAssessmentResponse | null>(null)
  const { setAssessment } = useStore()
  const navigate = useNavigate()

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!location.trim()) {
      toast.error('Please enter a location')
      return
    }

    setLoading(true)
    
    try {
      const result = await assessRisk({ location })
      setAssessmentData(result)
      setAssessment(result)
      toast.success('Risk assessment completed!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to assess risk')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50 border-green-200',
      moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      critical: 'text-red-600 bg-red-50 border-red-200',
    }
    return colors[level.toLowerCase() as keyof typeof colors] || colors.moderate
  }

  const getRiskBadgeClass = (level: string) => {
    const classes = {
      low: 'risk-badge-low',
      moderate: 'risk-badge-moderate',
      high: 'risk-badge-high',
      critical: 'risk-badge-critical',
    }
    return classes[level.toLowerCase() as keyof typeof classes] || classes.moderate
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Climate Risk Assessment
        </h1>
        <p className="text-lg text-gray-600">
          Enter your location to get an AI-powered climate risk analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <form onSubmit={handleAssess} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, address, or coordinates"
                className="input-field pl-10"
                disabled={loading}
              />
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
                Analyzing...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Assess Climate Risk
              </>
            )}
          </button>
        </form>
      </motion.div>

      {assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Risk Card */}
          <div className={`card border-2 ${getRiskColor(assessment.risk_level)}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {assessment.location}
                </h2>
                <p className="text-gray-600">
                  Coordinates: {assessment.latitude.toFixed(4)}, {assessment.longitude.toFixed(4)}
                </p>
              </div>
              <span className={getRiskBadgeClass(assessment.risk_level)}>
                {assessment.risk_level.toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">Overall Risk Score</div>
                <div className="text-3xl font-bold text-gray-900">
                  {assessment.overall_risk_score}/100
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">Confidence</div>
                <div className="text-3xl font-bold text-gray-900">
                  {assessment.confidence}%
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-sm text-gray-600 mb-1">Assessment Date</div>
                <div className="text-sm font-bold text-gray-900">
                  {new Date(assessment.assessment_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    assessment.risk_level === 'critical' ? 'bg-red-600' :
                    assessment.risk_level === 'high' ? 'bg-orange-600' :
                    assessment.risk_level === 'moderate' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${assessment.overall_risk_score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Top Risks */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Climate Risks</h3>
            <div className="space-y-3">
              {assessment.top_risks.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {risk.type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-600">Risk Score: {risk.score}/100</div>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          risk.score > 70 ? 'bg-red-500' :
                          risk.score > 50 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${risk.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Risk Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(assessment.risk_breakdown).map(([type, score]) => (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        score > 70 ? 'bg-red-500' :
                        score > 50 ? 'bg-orange-500' :
                        score > 30 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="card bg-primary-50 border-2 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready for Action?
                </h3>
                <p className="text-gray-600">
                  Get personalized recommendations to mitigate these risks
                </p>
              </div>
              <button
                onClick={() => navigate('/actions')}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Generate Action Plan
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RiskAssessment
