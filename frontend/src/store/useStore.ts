import { create } from 'zustand'
import { RiskAssessmentResponse, ActionPlanResponse } from '../services/api'

interface AppState {
  currentAssessment: RiskAssessmentResponse | null
  currentActionPlan: ActionPlanResponse | null
  userId: string
  setAssessment: (assessment: RiskAssessmentResponse) => void
  setActionPlan: (plan: ActionPlanResponse) => void
  clearData: () => void
}

export const useStore = create<AppState>((set) => ({
  currentAssessment: null,
  currentActionPlan: null,
  userId: 'user_' + Math.random().toString(36).substring(7),
  setAssessment: (assessment) => set({ currentAssessment: assessment }),
  setActionPlan: (plan) => set({ currentActionPlan: plan }),
  clearData: () => set({ currentAssessment: null, currentActionPlan: null }),
}))
