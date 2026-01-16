import type {
  RiskAssessment,
  ActionPlan,
  CarbonFootprint,
  Prediction,
} from '../types';
import type {
  RiskAssessmentResponse,
  ActionPlanResponse,
  FootprintResponse,
  PredictionResponse,
} from './api';

export const adaptRiskAssessment = (apiResponse: RiskAssessmentResponse): RiskAssessment => {
  return {
    id: `risk_${Date.now()}`,
    location: apiResponse.location,
    latitude: apiResponse.latitude,
    longitude: apiResponse.longitude,
    overallRisk: apiResponse.overall_risk_score,
    riskLevel: (apiResponse.risk_level?.toUpperCase() || 'MEDIUM') as
      | 'Critical'
      | 'High'
      | 'Medium'
      | 'Low',
    risks: Object.entries(apiResponse.risk_breakdown || {}).map(([type, score]) => ({
      type: type as any,
      score: Math.round(score),
      level: ((score: number): 'Critical' | 'High' | 'Medium' | 'Low' => {
        if (score >= 75) return 'Critical';
        if (score >= 50) return 'High';
        if (score >= 25) return 'Medium';
        return 'Low';
      })(score),
      description: `${type} risk assessment`,
    })),
    confidence: apiResponse.confidence || 0.85,
    timestamp: apiResponse.assessment_date || new Date().toISOString(),
  };
};

export const adaptActionPlan = (
  apiResponse: ActionPlanResponse,
  assessmentId: string
): ActionPlan => {
  return {
    id: `action_${Date.now()}`,
    assessmentId,
    actions: (apiResponse.actions || []).map((action: any, idx: number) => ({
      id: `action_${idx}`,
      title: action.title || 'Action',
      description: action.description || '',
      priority: (action.priority?.toUpperCase() || 'MEDIUM') as
        | 'Critical'
        | 'High'
        | 'Medium'
        | 'Low',
      estimatedCost: action.estimated_cost || 0,
      estimatedTime: action.estimated_time || '1-2 weeks',
      category: action.category || 'General',
      status: 'not_started' as const,
    })),
    estimatedCost: apiResponse.estimated_total_cost || 0,
    priorityMatrix: {
      riskLevel: 1,
      impactScore: apiResponse.estimated_impact || 0.8,
      costOptimization: 0.9,
      timeline: apiResponse.timeline?.immediate ? 'Immediate' : 'Medium-term',
    },
    createdAt: apiResponse.generated_at || new Date().toISOString(),
  };
};

export const adaptCarbonFootprint = (
  apiResponse: FootprintResponse,
  userId: string
): CarbonFootprint => {
  return {
    id: `footprint_${Date.now()}`,
    userId,
    transportation: {
      car: apiResponse.transportation?.car || 0,
      public_transit: apiResponse.transportation?.public_transit || 0,
      flights: apiResponse.transportation?.flights || 0,
    },
    energy: {
      electricity: apiResponse.energy?.electricity || 0,
      gas: apiResponse.energy?.gas || 0,
      heating_oil: apiResponse.energy?.heating_oil || 0,
    },
    food: {
      beef: apiResponse.food?.beef || 0,
      chicken: apiResponse.food?.chicken || 0,
      dairy: apiResponse.food?.dairy || 0,
    },
    goods: {
      clothing: apiResponse.goods?.clothing || 0,
      electronics: apiResponse.goods?.electronics || 0,
      furniture: apiResponse.goods?.furniture || 0,
    },
    totalEmissions: apiResponse.total_emissions || 0,
    offset: apiResponse.offset || 0,
    timestamp: apiResponse.timestamp || new Date().toISOString(),
  };
};

export const adaptPrediction = (apiResponse: PredictionResponse, assessmentId: string): Prediction => {
  return {
    id: `prediction_${Date.now()}`,
    assessmentId,
    years: apiResponse.years || 20,
    scenarios: (apiResponse.scenarios || []).map((s: any) => ({
      name: s.name as 'optimistic' | 'moderate' | 'pessimistic',
      temperatureChange: s.temperature_change || 0,
      precipitationChange: s.precipitation_change || 0,
      seaLevelRise: s.sea_level_rise || 0,
    })),
    trends: (apiResponse.trends || []).map((t: any) => ({
      metric: t.metric || 'Unknown',
      historicalData: t.historical_data || [],
      projection: t.projection || [],
      changePercentage: t.change_percentage || 0,
    })),
    extremeEvents: (apiResponse.extreme_events || []).map((e: any) => ({
      type: e.type || 'Unknown Event',
      probability: e.probability || 0,
      expectedFrequency: e.expected_frequency || 'Unknown',
      severity: (e.severity?.toUpperCase() || 'MEDIUM') as 'Low' | 'Medium' | 'High' | 'Critical',
    })),
  };
};
