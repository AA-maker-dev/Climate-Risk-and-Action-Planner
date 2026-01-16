// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Risk Assessment Types
export interface RiskAssessment {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  overallRisk: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  risks: RiskFactor[];
  confidence: number;
  timestamp: string;
  recommendations?: string[];
}

export interface RiskFactor {
  type: 'flood' | 'wildfire' | 'hurricane' | 'drought' | 'heatwave' | 'sea_level_rise';
  score: number;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  mitigation?: string[];
}

// Action Plan Types
export interface ActionPlan {
  id: string;
  assessmentId: string;
  actions: Action[];
  estimatedCost: number;
  priorityMatrix: PriorityMatrix;
  createdAt: string;
  completedAt?: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  estimatedCost: number;
  estimatedTime: string;
  category: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface PriorityMatrix {
  riskLevel: number;
  impactScore: number;
  costOptimization: number;
  timeline: string;
}

// Carbon Footprint Types
export interface CarbonFootprint {
  id: string;
  userId: string;
  transportation: TransportationEmissions;
  energy: EnergyEmissions;
  food: FoodEmissions;
  goods: GoodsEmissions;
  totalEmissions: number;
  offset: number;
  timestamp: string;
}

export interface TransportationEmissions {
  car: number;
  public_transit: number;
  flights: number;
  [key: string]: number;
}

export interface EnergyEmissions {
  electricity: number;
  gas: number;
  heating_oil: number;
  [key: string]: number;
}

export interface FoodEmissions {
  beef: number;
  chicken: number;
  dairy: number;
  [key: string]: number;
}

export interface GoodsEmissions {
  clothing: number;
  electronics: number;
  furniture: number;
  [key: string]: number;
}

// Prediction Types
export interface Prediction {
  id: string;
  assessmentId: string;
  years: number;
  scenarios: ScenarioData[];
  trends: Trend[];
  extremeEvents: ExtremeEvent[];
}

export interface ScenarioData {
  name: 'optimistic' | 'moderate' | 'pessimistic';
  temperatureChange: number;
  precipitationChange: number;
  seaLevelRise: number;
}

export interface Trend {
  metric: string;
  historicalData: number[];
  projection: number[];
  changePercentage: number;
}

export interface ExtremeEvent {
  type: string;
  probability: number;
  expectedFrequency: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  location?: string;
  preferences?: UserPreferences;
  createdAt: string;
  lastLogin?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  unit: 'metric' | 'imperial';
}

// Dashboard Types
export interface DashboardData {
  latestAssessment: RiskAssessment;
  lastPrediction: Prediction;
  recentActions: Action[];
  totalEmissions: number;
  healthScore: number;
}
