export interface CityVital {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
  status: 'optimal' | 'warning' | 'critical';
  category: 'Mobility' | 'Energy' | 'Safety' | 'Environment';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'Mobility' | 'Energy' | 'Safety' | 'Environment';
  impact: 'High' | 'Medium' | 'Low';
  urgency: 'Immediate' | 'Scheduled' | 'Routine';
  confidence: number; // percentage e.g. 94
  costEstimate: string;
  status: 'pending' | 'simulating' | 'active' | 'archived';
  metricsAffected: { metric: string; change: string; positive: boolean }[];
  aiReasoning: string;
  createdAt: string;
}

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  category: 'Potholes' | 'Garbage' | 'Water Leakage' | 'Broken Street Lights' | 'Flooding' | 'Traffic Congestion' | 'Public Safety' | 'Pollution' | 'Infrastructure' | 'Utilities' | 'Safety' | 'Ecological' | 'Other';
  status: 'open' | 'investigating' | 'resolved';
  votes: number;
  userVoted?: boolean;
  location: string;
  latitude: number;
  longitude: number;
  reportedBy: string;
  reportedByUid?: string;
  reportedAt: string;
  priority: 'low' | 'medium' | 'high';
  imageUrl?: string;
  voters?: string[];
}

export interface ScenarioParam {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

export interface PredictionMetric {
  year: number;
  carbonEmission: number;
  congestionRate: number;
  energyGridLoad: number;
  livabilityIndex: number;
  budgetDeficit: number;
}

export interface MapNode {
  id: string;
  name: string;
  type: 'hub' | 'sensor' | 'grid' | 'station';
  status: 'active' | 'maintenance' | 'alert';
  metricName: string;
  metricValue: string;
  coordinates: { x: number; y: number }; // Relative percentage coordinates for SVG map (0-100)
  description: string;
}

export interface UserProfile {
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  email: string;
  activeAlerts: string[];
  apiKey: string;
}
