import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RiskAssessmentRequest {
  location: string
  latitude?: number
  longitude?: number
}

export interface RiskAssessmentResponse {
  location: string
  latitude: number
  longitude: number
  overall_risk_score: number
  risk_level: string
  risk_breakdown: Record<string, number>
  top_risks: Array<{ type: string; score: number }>
  assessment_date: string
  confidence: number
}

export interface ActionPlanRequest {
  location: string
  risk_assessment: RiskAssessmentResponse
  user_profile?: Record<string, any>
}

export interface ActionPlanResponse {
  location: string
  risk_level: string
  actions: Array<any>
  total_actions: number
  estimated_total_cost: number
  estimated_impact: number
  timeline: Record<string, string[]>
  generated_at: string
}

export interface FootprintRequest {
  user_id: string
  category: string
  activity_type: string
  amount: number
  unit: string
}

export interface FootprintResponse {
  transportation?: Record<string, number>
  energy?: Record<string, number>
  food?: Record<string, number>
  goods?: Record<string, number>
  total_emissions: number
  offset: number
  timestamp: string
}

export interface PredictionRequest {
  latitude: number
  longitude: number
  years?: number
}

export interface PredictionResponse {
  years: number
  scenarios: Array<{
    name: 'optimistic' | 'moderate' | 'pessimistic'
    temperature_change: number
    precipitation_change: number
    sea_level_rise: number
  }>
  trends: Array<{
    metric: string
    historical_data: number[]
    projection: number[]
    change_percentage: number
  }>
  extreme_events: Array<{
    type: string
    probability: number
    expected_frequency: string
    severity: string
  }>
  timestamp: string
}

// Risk Assessment API
export const assessRisk = async (data: RiskAssessmentRequest): Promise<RiskAssessmentResponse> => {
  const response = await api.post('/risk/assess', data)
  return response.data
}

export const getRiskHistory = async (location: string) => {
  const response = await api.get(`/risk/history/${location}`)
  return response.data
}

// Action Plan API
export const generateActionPlan = async (data: ActionPlanRequest): Promise<ActionPlanResponse> => {
  const response = await api.post('/actions/generate', data)
  return response.data
}

export const getActionTemplates = async () => {
  const response = await api.get('/actions/templates')
  return response.data
}

// Climate Data API
export const getCurrentClimate = async (lat: number, lon: number) => {
  const response = await api.get(`/climate/current/${lat}/${lon}`)
  return response.data
}

export const getForecast = async (lat: number, lon: number, days: number = 5) => {
  const response = await api.post('/climate/forecast', { latitude: lat, longitude: lon, days })
  return response.data
}

export const getHistoricalClimate = async (lat: number, lon: number, months: number = 12) => {
  const response = await api.get(`/climate/historical/${lat}/${lon}`, { params: { months } })
  return response.data
}

// Carbon Footprint API
export const calculateFootprint = async (data: FootprintRequest) => {
  const response = await api.post('/footprint/calculate', data)
  return response.data
}

export const getFootprintSummary = async (userId: string) => {
  const response = await api.get(`/footprint/user/${userId}/summary`)
  return response.data
}

export const getFootprintCategories = async () => {
  const response = await api.get('/footprint/categories')
  return response.data
}

// Predictions API
export const generatePredictions = async (data: PredictionRequest) => {
  const response = await api.post('/predictions/generate', data)
  return response.data
}

export const getClimateScenarios = async (lat: number, lon: number, scenario: string = 'moderate') => {
  const response = await api.get(`/predictions/scenarios/${lat}/${lon}`, { params: { scenario } })
  return response.data
}

export default api
