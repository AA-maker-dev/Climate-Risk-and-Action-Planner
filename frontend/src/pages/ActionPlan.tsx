import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Loader, DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateActionPlan, type ActionPlanResponse, type RiskAssessmentResponse } from '../services/api'
import { adaptActionPlan } from '../services/adapters'
import { useStore } from '../store/useStore'

const ActionPlan = () => {
  const { currentAssessment, currentActionPlan, setActionPlan, addActionPlanToHistory } = useStore()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<ActionPlanResponse | null>(null)

  useEffect(() => {
    if (currentActionPlan) {
      setPlan(null) // Reset since we now work with adapted types
    }
  }, [currentActionPlan])

  const handleGenerate = async () => {
    if (!currentAssessment) {
      toast.error('Please complete a risk assessment first')
      return
    }

    setLoading(true)
    
    try {
      // Convert store type back to API type for the request
      const apiAssessment: RiskAssessmentResponse = {
        location: currentAssessment.location,
        latitude: currentAssessment.latitude,
        longitude: currentAssessment.longitude,
        overall_risk_score: currentAssessment.overallRisk,
        risk_level: currentAssessment.riskLevel.toLowerCase(),
        risk_breakdown: currentAssessment.risks.reduce((acc, r) => {
          acc[r.type] = r.score
          return acc
        }, {} as Record<string, number>),
        top_risks: currentAssessment.risks
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((r) => ({ type: r.type, score: r.score })),
        assessment_date: currentAssessment.timestamp,
        confidence: currentAssessment.confidence,
      }

      const result = await generateActionPlan({
        location: currentAssessment.location,
        risk_assessment: apiAssessment,
      })
      setPlan(result)
      
      // Adapt API response and store it
      const adaptedPlan = adaptActionPlan(result, currentAssessment.id)
      setActionPlan(adaptedPlan)
      addActionPlanToHistory(adaptedPlan)
      
      toast.success('Action plan generated!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate action plan')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300',
    }
    return colors[priority.toLowerCase() as keyof typeof colors] || colors.medium
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      infrastructure: '🏗️',
      preparedness: '🎒',
      safety: '🛡️',
      financial: '💰',
      landscaping: '🌳',
      maintenance: '🔧',
    }
    return icons[category] || '📋'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Climate Action Plan
        </h1>
        <p className="text-lg text-gray-600">
          Get AI-powered recommendations to mitigate climate risks
        </p>
      </motion.div>

      {!plan && !currentAssessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Risk Assessment Found
          </h3>
          <p className="text-gray-600 mb-6">
            Please complete a risk assessment before generating an action plan
          </p>
          <a href="/assess" className="btn-primary inline-block">
            Start Risk Assessment
          </a>
        </motion.div>
      )}

      {!plan && currentAssessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <Target className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Generate Your Action Plan
          </h3>
          <p className="text-gray-600 mb-6">
            Based on your risk assessment for <strong>{currentAssessment.location}</strong>
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Generate Action Plan
              </>
            )}
          </button>
        </motion.div>
      )}

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Action Plan for {plan.location}
                </h2>
                <p className="text-gray-600">
                  Risk Level: <span className="font-semibold capitalize">{plan.risk_level}</span>
                </p>
              </div>
              <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold">
                {plan.total_actions} Actions
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Estimated Cost</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${plan.estimated_total_cost.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Impact Score</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {plan.estimated_impact.toFixed(1)}/100
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Generated</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {new Date(plan.generated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Timeline</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {Object.entries(plan.timeline).map(([timeframe, actions]) => (
                <div key={timeframe} className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2 capitalize">
                    {timeframe.replace('-', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {actions.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {actions.length === 1 ? 'action' : 'actions'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions List */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h3>
            <div className="space-y-4">
              {plan.actions.map((action: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-lg border-2 ${getPriorityColor(action.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getCategoryIcon(action.category)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {action.title}
                          </h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                            {action.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{action.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white bg-opacity-50 rounded p-2">
                          <div className="text-xs text-gray-600 mb-1">Category</div>
                          <div className="text-sm font-semibold capitalize">{action.category}</div>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded p-2">
                          <div className="text-xs text-gray-600 mb-1">Cost</div>
                          <div className="text-sm font-semibold">
                            ${action.estimated_cost.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded p-2">
                          <div className="text-xs text-gray-600 mb-1">Impact</div>
                          <div className="text-sm font-semibold">{action.impact_score}/100</div>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded p-2">
                          <div className="text-xs text-gray-600 mb-1">Timeframe</div>
                          <div className="text-sm font-semibold capitalize">
                            {action.timeframe.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                      <CheckCircle2 className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Summary */}
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Take Action Today!
                </h3>
                <p className="text-gray-700">
                  Start with immediate actions to reduce your climate risk. Every action counts!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ActionPlan
