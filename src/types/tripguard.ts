export type LanguageCode = 'en' | 'hi' | 'te';

export type NavSection =
  | 'home'
  | 'journey'
  | 'recovery'
  | 'whatif'
  | 'howitworks'
  | 'dashboard';

export type TrainStatusIndicator = 'RUNNING' | 'DELAYED' | 'CANCELLED' | 'DIVERTED';

/**
 * Structured train status returned by the n8n backend.
 * Only fields actually present in the backend response are populated.
 * Missing fields are never invented or hardcoded.
 */
export interface TrainStatusData {
  trainNumber?: string;
  trainName?: string;
  journeyDate?: string;
  source?: string;
  destination?: string;
  route?: string;
  currentStatus?: TrainStatusIndicator | string;
  currentStation?: string;
  previousStation?: string;
  nextStation?: string;
  delay?: string;
  scheduledDeparture?: string;
  scheduledArrival?: string;
  expectedArrival?: string;
  travelTime?: string;
  risk?: string;
  platform?: string;
}

/**
 * Recovery option returned by the n8n backend (up to 3 alternatives).
 */
export interface RecoveryOption {
  id: string;
  optionNumber: 1 | 2 | 3;
  trainName?: string;
  trainNumber?: string;
  departure?: string;
  arrival?: string;
  delay?: string;
  travelTime?: string;
  route?: string;
  risk?: string;
  source?: string;
  destination?: string;
  whyThisOption?: string;
  isRecommended?: boolean;
  connectionFeasible?: boolean;
}

export type ActionStatusStage =
  | 'Recovery option selected'
  | 'Booking preparation'
  | 'Pending secure confirmation'
  | 'Notification prepared'
  | 'Itinerary updated';

export interface UpdatedItineraryData {
  originalJourney?: string;
  disruptionNote?: string;
  selectedOption: RecoveryOption;
  statusText: string;
  actionStage: ActionStatusStage;
  actionMessage: string;
  confirmedBooking: boolean;
  approvalStatus: 'approved' | 'rejected' | 'pending';
  notificationSent: boolean;
  updatedAt: string;
}

export interface PlanComparisonMetrics {
  label?: string;
  departure?: string;
  arrival?: string;
  delay?: string;
  travelTime?: string;
  route?: string;
  risk?: string;
}

export interface WhatIfAnalysis {
  scenarioQuery: string;
  currentPlan?: string;
  possibleImpact?: string;
  alternativePlan?: string;
  recommendation?: string;
  currentMetrics?: PlanComparisonMetrics;
  alternativeMetrics?: PlanComparisonMetrics;
  rawText?: string;
  timestamp: string;
}

/**
 * Only preferences explicitly provided by the user or returned by the backend are set.
 */
export interface TripPreferences {
  preferredTransport?: string;
  budget?: string;
  preferredArrivalTime?: string;
  comfortPreferences?: string;
  maxAcceptableDelay?: string;
  travelStyle?: string;
  language: LanguageCode;
}

export type AgentActivityState = 'idle' | 'active' | 'completed' | 'alert';

export interface LiveAgentStatuses {
  disruptionDetection: AgentActivityState;
  alternativeDiscovery: AgentActivityState;
  recoveryOptimization: AgentActivityState;
  safetyCheck: AgentActivityState;
  decisionAgent: AgentActivityState;
  notificationAgent: AgentActivityState;
}

export interface ProcessingStepStatus {
  disruptionDetected: boolean;
  checkingLiveStatus: boolean;
  searchingAlternatives: boolean;
  comparingOptions: boolean;
  recommendationReady: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isError?: boolean;
  errorType?:
    | 'BACKEND_UNAVAILABLE'
    | 'NETWORK_ERROR'
    | 'EMPTY_RESPONSE'
    | 'INVALID_RESPONSE'
    | 'TOOL_FAILURE';
  trainStatus?: TrainStatusData;
  alternatives?: RecoveryOption[];
  noAlternativesFound?: boolean;
  whatIf?: WhatIfAnalysis;
  askForApproval?: boolean;
  confirmedDataSummary?: string;
  aiReasoningSummary?: string;
}

export interface ParsedTripGuardResponse {
  replyText: string;
  trainStatus?: TrainStatusData;
  alternatives?: RecoveryOption[];
  noAlternativesFound?: boolean;
  recommendedOptionNumber?: 1 | 2 | 3;
  whatIf?: WhatIfAnalysis;
  backendPreferences?: Partial<TripPreferences>;
  confirmedBooking?: boolean;
  bookingReference?: string;
  toolError?: string;
}
