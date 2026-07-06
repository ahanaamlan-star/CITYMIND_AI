import { CityVital, Recommendation, CommunityReport, ScenarioParam, MapNode, UserProfile } from './types';

export const initialUserProfile: UserProfile = {
  name: 'Elena Rostova',
  role: 'Chief Urban Intelligence Officer',
  department: 'Department of Smart Municipal Planning',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  email: 'e.rostova@citymind.gov',
  activeAlerts: [
    'District 4 Power Grid Load Peak',
    'Northbound Express Traffic Bottleneck',
    'Air Quality Index drop in Industrial Zone'
  ],
  apiKey: 'cm_live_7x8f93j2a1b9c8d7e6f5g4h3'
};

export const initialVitals: CityVital[] = [
  {
    id: '1',
    name: 'Traffic Congestion Index',
    value: 42,
    unit: '%',
    change: -5.4,
    trend: 'down',
    status: 'optimal',
    category: 'Mobility'
  },
  {
    id: '2',
    name: 'Energy Grid Load',
    value: 88,
    unit: 'MW',
    change: 12.1,
    trend: 'up',
    status: 'warning',
    category: 'Energy'
  },
  {
    id: '3',
    name: 'Emergency Response Time',
    value: 6.8,
    unit: 'min',
    change: -8.2,
    trend: 'down',
    status: 'optimal',
    category: 'Safety'
  },
  {
    id: '4',
    name: 'Air Quality Index (AQI)',
    value: 124,
    unit: 'US AQI',
    change: 18.5,
    trend: 'up',
    status: 'warning',
    category: 'Environment'
  },
  {
    id: '5',
    name: 'Renewable Power Share',
    value: 64.2,
    unit: '%',
    change: 4.8,
    trend: 'up',
    status: 'optimal',
    category: 'Energy'
  },
  {
    id: '6',
    name: 'Active Public Transit Units',
    value: 342,
    unit: 'buses/trains',
    change: 2.1,
    trend: 'up',
    status: 'optimal',
    category: 'Mobility'
  },
  {
    id: '7',
    name: 'Water Grid Reserve Level',
    value: 34,
    unit: '%',
    change: -14.2,
    trend: 'down',
    status: 'critical',
    category: 'Environment'
  },
  {
    id: '8',
    name: 'Municipal Waste Processed',
    value: 1420,
    unit: 'tons/day',
    change: 0.5,
    trend: 'stable',
    status: 'optimal',
    category: 'Environment'
  }
];

export const initialRecommendations: Recommendation[] = [
  {
    id: 'rec_1',
    title: 'Dynamic Traffic Light Calibration on Broadway',
    description: 'Recalibrate intersection signal timings in District 3 based on real-time computer vision sensor feeds. Reduces cross-street idling cycles.',
    category: 'Mobility',
    impact: 'High',
    urgency: 'Immediate',
    confidence: 96,
    costEstimate: '$12,000',
    status: 'pending',
    metricsAffected: [
      { metric: 'Congestion Rate', change: '-12.4%', positive: true },
      { metric: 'Carbon Emissions', change: '-4.2%', positive: true },
      { metric: 'Average Transit Delay', change: '-3.1 min', positive: true }
    ],
    aiReasoning: 'Analysis of District 3 sensors shows a persistent bottleneck from 16:00 to 19:00, leading to secondary congestion blocks on adjacent arterials. Adjusting green cycles by +18s on Broadway Northbound matches the dynamic vehicle load accurately.',
    createdAt: '2026-07-06T08:30:00Z'
  },
  {
    id: 'rec_2',
    title: 'District 4 Microgrid Thermal Batteries Engagement',
    description: 'Trigger supplementary grid thermal batteries in Central Commercial blocks to offset the impending HVAC consumption peak forecasted for 14:00.',
    category: 'Energy',
    impact: 'Medium',
    urgency: 'Immediate',
    confidence: 91,
    costEstimate: 'N/A (SaaS Control)',
    status: 'active',
    metricsAffected: [
      { metric: 'Peak Load Stress', change: '-18.5%', positive: true },
      { metric: 'Grid Failure Risk', change: '-40%', positive: true }
    ],
    aiReasoning: 'With external temperature rising to 34°C, building cooling loads are predicted to exceed peak baseline thresholds. Activating decentralized stored cooling during low-rate intervals shaves the demand curve gracefully.',
    createdAt: '2026-07-06T09:12:00Z'
  },
  {
    id: 'rec_3',
    title: 'Autonomous Transit Route 14 Density Increase',
    description: 'Deploy 4 additional autonomous electric shuttles along the High-Tech Park corridor during morning shift changes.',
    category: 'Mobility',
    impact: 'Medium',
    urgency: 'Scheduled',
    confidence: 88,
    costEstimate: '$4,500 / month',
    status: 'pending',
    metricsAffected: [
      { metric: 'Wait Times', change: '-4.5 min', positive: true },
      { metric: 'Ridership Retention', change: '+8.2%', positive: true }
    ],
    aiReasoning: 'Commuter wait logs at transit bays 4-8 indicate peaks exceeding 15 minutes, prompting commuters to transition to ride-share providers. Deploying idle vehicles directly improves public transit utilization indices.',
    createdAt: '2026-07-06T06:00:00Z'
  },
  {
    id: 'rec_4',
    title: 'Smart Leakage Shutoff at Water Main #12',
    description: 'Actuate automatic valves on Main Pipeline 12 in the Industrial district to isolate a telemetry pressure drop anomaly.',
    category: 'Environment',
    impact: 'High',
    urgency: 'Immediate',
    confidence: 98,
    costEstimate: '$1,200',
    status: 'simulating',
    metricsAffected: [
      { metric: 'Freshwater Loss Rate', change: '-95% local', positive: true },
      { metric: 'Water Reserves Saved', change: '+12,000 gal/hr', positive: true }
    ],
    aiReasoning: 'Sensors report an abrupt 1.8-bar drop on Main 12 with no corresponding increase in metered industrial discharge. Immediate shutoff restricts subterranean soil erosion and maximizes safety.',
    createdAt: '2026-07-06T10:02:00Z'
  }
];

export const initialCommunityReports: CommunityReport[] = [
  {
    id: 'rep_1',
    title: 'Hazardous Pothole on Northern Avenue',
    description: 'Extremely deep pothole in the left lane right after the exit. It is forcing vehicles to swerve abruptly into oncoming lanes.',
    category: 'Infrastructure',
    status: 'investigating',
    votes: 42,
    location: 'District 2, Northern Ave Exit 4',
    latitude: 45.12,
    longitude: 34.56,
    reportedBy: 'Marcus Vance',
    reportedAt: '2026-07-05T14:22:00Z',
    priority: 'high'
  },
  {
    id: 'rep_2',
    title: 'District 3 Main Library Power Surges',
    description: 'Intermittent power flickering in the computer lab and reference sections, causing client systems to restart twice today.',
    category: 'Utilities',
    status: 'open',
    votes: 18,
    location: 'District 3, 242 Library Square',
    latitude: 45.14,
    longitude: 34.58,
    reportedBy: 'Lia Chang',
    reportedAt: '2026-07-06T01:10:00Z',
    priority: 'medium'
  },
  {
    id: 'rep_3',
    title: 'Broken Streetlights - Riverside Path',
    description: 'An entire block of 8 street lamps along the jogging path are completely dark. Feels very unsafe to jog or bike here at night.',
    category: 'Safety',
    status: 'open',
    votes: 29,
    location: 'District 1, Riverside Walkway',
    latitude: 45.10,
    longitude: 34.52,
    reportedBy: 'Kofi Mensah',
    reportedAt: '2026-07-06T05:40:00Z',
    priority: 'medium'
  },
  {
    id: 'rep_4',
    title: 'Industrial Runoff Anomaly near Creek Side',
    description: 'Weird oily sheen and sulfuric odor observed coming from the stormwater pipe outfall behind the old metal fabrication plant.',
    category: 'Ecological',
    status: 'resolved',
    votes: 56,
    location: 'District 5, Industrial Creek Outfall B',
    latitude: 45.18,
    longitude: 34.62,
    reportedBy: 'Dr. Sarah Patel',
    reportedAt: '2026-07-04T09:15:00Z',
    priority: 'high'
  }
];

export const initialScenarioParams: ScenarioParam[] = [
  {
    id: 'p_transit',
    name: 'Public Transit Subsidy Change',
    value: 15,
    min: -50,
    max: 100,
    step: 5,
    unit: '%',
    description: 'Adjust financial subsidies to reduce bus/train fares and increase system frequency.'
  },
  {
    id: 'p_carbon',
    name: 'Congestion Zone Carbon Pricing',
    value: 8,
    min: 0,
    max: 30,
    step: 1,
    unit: '$/day',
    description: 'Daily entry tariff for high-density downtown districts for non-electric passenger vehicles.'
  },
  {
    id: 'p_solar',
    name: 'Solar Grid Rooftop Rebate',
    value: 30,
    min: 0,
    max: 80,
    step: 5,
    unit: '%',
    description: 'Rebate amount provided to residential homeowners for installing PV micro-arrays.'
  },
  {
    id: 'p_ev',
    name: 'EV Charger Infrastructure Budget',
    value: 4.5,
    min: 0.5,
    max: 15.0,
    step: 0.5,
    unit: 'M$',
    description: 'Capital deployment for installing ultra-fast dual-port chargers across municipal curbsides.'
  }
];

export const initialMapNodes: MapNode[] = [
  {
    id: 'node_1',
    name: 'City Command HQ Hub',
    type: 'hub',
    status: 'active',
    metricName: 'System Health',
    metricValue: '99.8%',
    coordinates: { x: 50, y: 50 },
    description: 'The core mainframe consolidating high-performance multi-modal neural models.'
  },
  {
    id: 'node_2',
    name: 'District 3 Traffic Optic Sensor Grid',
    type: 'sensor',
    status: 'active',
    metricName: 'Data Fidelity',
    metricValue: '94.2%',
    coordinates: { x: 30, y: 40 },
    description: 'Computer-vision sensors mounted on Broadway Avenue intersections.'
  },
  {
    id: 'node_3',
    name: 'Central Substation 4 Grid Node',
    type: 'grid',
    status: 'alert',
    metricName: 'Load Factor',
    metricValue: '88% Peak',
    coordinates: { x: 75, y: 35 },
    description: 'Core energy switching substation regulating District 4 commercial blocks.'
  },
  {
    id: 'node_4',
    name: 'Grand Station Transit Hub',
    type: 'station',
    status: 'maintenance',
    metricName: 'Throughput',
    metricValue: '12.4k/hr',
    coordinates: { x: 45, y: 70 },
    description: 'Multi-modal train and bus interchange center servicing downtown.'
  },
  {
    id: 'node_5',
    name: 'Industrial Zone Air Monitor Unit',
    type: 'sensor',
    status: 'active',
    metricName: 'Particulates PM2.5',
    metricValue: '48 µg/m³',
    coordinates: { x: 80, y: 75 },
    description: 'Laser particle counter measuring particulate densities in District 5.'
  }
];
