import { create } from 'zustand';
import type {
  RiskAssessment,
  ActionPlan,
  CarbonFootprint,
  Prediction,
  User,
  UserPreferences,
} from '../types';

interface AppState {
  // User data
  currentUser: User | null;
  userId: string;

  // Assessment data
  currentAssessment: RiskAssessment | null;
  assessmentHistory: RiskAssessment[];

  // Action plans
  currentActionPlan: ActionPlan | null;
  actionPlans: ActionPlan[];

  // Carbon footprint
  carbonFootprint: CarbonFootprint | null;
  footprintHistory: CarbonFootprint[];

  // Predictions
  currentPrediction: Prediction | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAssessment: (assessment: RiskAssessment) => void;
  addAssessmentToHistory: (assessment: RiskAssessment) => void;
  setActionPlan: (plan: ActionPlan) => void;
  addActionPlanToHistory: (plan: ActionPlan) => void;
  setCarbonFootprint: (footprint: CarbonFootprint) => void;
  setPrediction: (prediction: Prediction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  clearData: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  currentUser: null,
  userId: 'user_' + Math.random().toString(36).substring(7),
  currentAssessment: null,
  assessmentHistory: [],
  currentActionPlan: null,
  actionPlans: [],
  carbonFootprint: null,
  footprintHistory: [],
  currentPrediction: null,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ currentUser: user }),
  setAssessment: (assessment) =>
    set({ currentAssessment: assessment, error: null }),
  addAssessmentToHistory: (assessment) =>
    set((state) => ({
      assessmentHistory: [assessment, ...state.assessmentHistory],
    })),
  setActionPlan: (plan) => set({ currentActionPlan: plan, error: null }),
  addActionPlanToHistory: (plan) =>
    set((state) => ({
      actionPlans: [plan, ...state.actionPlans],
    })),
  setCarbonFootprint: (footprint) =>
    set({ carbonFootprint: footprint, error: null }),
  setPrediction: (prediction) => set({ currentPrediction: prediction }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setUserPreferences: (preferences) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, preferences }
        : null,
    })),
  clearData: () =>
    set({
      currentAssessment: null,
      currentActionPlan: null,
      carbonFootprint: null,
      currentPrediction: null,
      error: null,
    }),
}));
