import {
  Train,
  LiveFeedItem,
  StationTraffic,
  JourneyDurationBucket,
  RoutePerformance,
  DelayRootCause,
  VolumeTrend,
  RouteEfficiency,
  CongestionCell,
  MaintenanceLog
} from './types';

export const INITIAL_TRAINS: Train[] = [
  {
    id: '1456',
    name: 'Train 1456',
    status: 'on-time',
    speed: 95,
    nextStation: 'Central Station',
    eta: '14:35',
    fuelLevel: 82,
    passengerLoad: 'Moderate',
    engineTemp: 'Normal',
    routeType: 'Short',
    route: 'Mumbai-Thane Local',
    x: 480,
    y: 300,
    angle: 0,
    speedHistory: [80, 85, 90, 95, 95, 93, 95]
  },
  {
    id: '1458',
    name: 'Train 1458',
    status: 'on-time',
    speed: 110,
    nextStation: 'Kalyan JN',
    eta: '14:50',
    fuelLevel: 90,
    passengerLoad: 'High',
    engineTemp: 'Normal',
    routeType: 'Short',
    route: 'Mumbai Express',
    x: 580,
    y: 300,
    angle: 0,
    speedHistory: [100, 105, 110, 110, 108, 110, 110]
  },
  {
    id: '1209',
    name: 'Train 1209',
    status: 'delayed',
    speed: 0,
    nextStation: 'North Junction',
    eta: '14:55 (+20m)',
    fuelLevel: 45,
    passengerLoad: 'High',
    engineTemp: 'Cool',
    routeType: 'Medium',
    route: 'Kolkata Rajdhani',
    x: 400,
    y: 190,
    angle: 90,
    speedHistory: [75, 60, 40, 20, 0, 0, 0]
  },
  {
    id: '3301',
    name: 'Train 3301',
    status: 'warning',
    speed: 45,
    nextStation: 'South Park',
    eta: '15:10',
    fuelLevel: 61,
    passengerLoad: 'Low',
    engineTemp: 'Elevated',
    routeType: 'Long',
    route: 'Deccan Odyssey',
    x: 320,
    y: 380,
    angle: 135,
    speedHistory: [80, 75, 70, 55, 50, 45, 45]
  },
  {
    id: '1000',
    name: 'Train 1000',
    status: 'on-time',
    speed: 120,
    nextStation: 'Sealdah',
    eta: '14:22',
    fuelLevel: 94,
    passengerLoad: 'Low',
    engineTemp: 'Normal',
    routeType: 'Long',
    route: 'Tejas Express',
    x: 350,
    y: 120,
    angle: 45,
    speedHistory: [115, 120, 120, 120, 120, 120, 120]
  },
  {
    id: '1680',
    name: 'Train 1680',
    status: 'on-time',
    speed: 80,
    nextStation: 'West Hub',
    eta: '14:40',
    fuelLevel: 75,
    passengerLoad: 'Moderate',
    engineTemp: 'Normal',
    routeType: 'Short',
    route: 'Howrah Local',
    x: 220,
    y: 280,
    angle: 225,
    speedHistory: [80, 80, 78, 80, 80, 80, 80]
  },
  {
    id: '1558',
    name: 'Train 1558',
    status: 'on-time',
    speed: 102,
    nextStation: 'Central Station',
    eta: '14:48',
    fuelLevel: 88,
    passengerLoad: 'Moderate',
    engineTemp: 'Normal',
    routeType: 'Medium',
    route: 'Shatabdi Express',
    x: 430,
    y: 230,
    angle: 90,
    speedHistory: [95, 98, 100, 102, 102, 102, 102]
  },
  {
    id: '1308',
    name: 'Train 1308',
    status: 'delayed',
    speed: 15,
    nextStation: 'West Hub',
    eta: '15:15 (+15m)',
    fuelLevel: 55,
    passengerLoad: 'High',
    engineTemp: 'Normal',
    routeType: 'Short',
    route: 'Garib Rath Express',
    x: 350,
    y: 340,
    angle: 315,
    speedHistory: [60, 50, 40, 30, 20, 15, 15]
  },
  {
    id: '3308',
    name: 'Train 3308',
    status: 'warning',
    speed: 35,
    nextStation: 'East Terminal',
    eta: '15:02',
    fuelLevel: 40,
    passengerLoad: 'Moderate',
    engineTemp: 'Elevated',
    routeType: 'Medium',
    route: 'Duronto Express',
    x: 480,
    y: 380,
    angle: 45,
    speedHistory: [70, 65, 55, 45, 40, 35, 35]
  },
  {
    id: 'M67',
    name: 'Train M67',
    status: 'on-time',
    speed: 85,
    nextStation: 'South Park',
    eta: '14:55',
    fuelLevel: 79,
    passengerLoad: 'Low',
    engineTemp: 'Normal',
    routeType: 'Short',
    route: 'Double Decker Exp',
    x: 550,
    y: 410,
    angle: 225,
    speedHistory: [85, 85, 83, 85, 85, 85, 85]
  }
];

export const LIVE_FEED: LiveFeedItem[] = [
  {
    id: 'f1',
    type: 'alert',
    title: 'Alert: Train 1209 (Red)',
    message: 'Delayed due to signal issue near North Junction. ETA +20m.',
    time: '14:32'
  },
  {
    id: 'f2',
    type: 'update',
    title: 'Update: Train 1456 (Green)',
    message: 'On Time to Central Station.',
    time: '14:30'
  },
  {
    id: 'f3',
    type: 'warning',
    title: 'Warning: Train 3301 (Yellow)',
    message: 'Minor delay, power fluctuations reported.',
    time: '14:25'
  },
  {
    id: 'f4',
    type: 'update',
    title: 'Update: Train 1000 (Green)',
    message: 'Departed Kalyan JN, operating at full design speed (120 mph).',
    time: '14:18'
  },
  {
    id: 'f5',
    type: 'warning',
    title: 'Warning: Track Maintenance',
    message: 'Reduced speed limit (30 mph) active near West Hub line due to construction.',
    time: '14:10'
  }
];

export const STATION_TRAFFIC: StationTraffic[] = [
  { name: 'CST-MUMBAI', count: 2850 },
  { name: 'KALYAN JN', count: 2345 },
  { name: 'THANE', count: 1953 },
  { name: 'SEALDAH', count: 1653 },
  { name: 'NEW DELHI JN', count: 1563 },
  { name: 'HOWRAH JN', count: 1298 },
  { name: 'CHENNAI JN', count: 1008 },
  { name: 'SECUNDERABAD JN', count: 994 },
  { name: 'GORAKHPUR JN', count: 676 },
  { name: 'BALAR JN', count: 634 },
  { name: 'PUNE JN', count: 620 },
  { name: 'KANPUR JN', count: 403 },
  { name: 'SURAT JN', count: 473 }
].sort((a, b) => b.count - a.count);

export const ROUTE_TYPE_DISTRIBUTION = [
  { name: 'Short', percentage: 68.7, count: 5393, color: '#0f4c75' },
  { name: 'Medium', percentage: 15.9, count: 1248, color: '#f26a1b' },
  { name: 'Long', percentage: 15.4, count: 1209, color: '#1ba5a1' }
];

export const JOURNEY_DURATION_DISTRIBUTION: JourneyDurationBucket[] = [
  { label: '0-2h', count: 18 },
  { label: '2-4h', count: 47 },
  { label: '4.6h', count: 73 }, // Mean marked on this
  { label: '6-8h', count: 39 },
  { label: '8-10h', count: 24 },
  { label: '10-12h', count: 13 },
  { label: '12-14h', count: 7 },
  { label: '16-18h', count: 4 },
  { label: '20-22h', count: 2 },
  { label: '>22h', count: 1 }
];

export const ROUTE_PERFORMANCE: RoutePerformance[] = [
  { name: 'Route A-B', percentage: 98 },
  { name: 'Route C-D', percentage: 95 },
  { name: 'Route E-F', percentage: 92 },
  { name: 'Route G-H', percentage: 90 }
];

export const DELAY_ROOT_CAUSE: DelayRootCause[] = [
  { name: 'Mechanical', percentage: 40, color: '#3b82f6' },
  { name: 'Weather', percentage: 25, color: '#e2e8f0' },
  { name: 'Staffing', percentage: 20, color: '#1d4ed8' },
  { name: 'Other', percentage: 15, color: '#475569' }
];

export const MONTHLY_VOLUME_TRENDS: VolumeTrend[] = [
  { month: 'Jan', volume: 75000 },
  { month: 'Feb', volume: 98000 },
  { month: 'Mar', volume: 120000 },
  { month: 'Apr', volume: 150000 },
  { month: 'May', volume: 195000 }
];

// Generate synthetic scatter plot data for Speed vs Delay (Route Efficiency)
export const ROUTE_EFFICIENCY_DATA: RouteEfficiency[] = [
  // Efficient Zone (Green) - Higher speeds, lower delays
  { speed: 280, delay: 3, status: 'efficient', name: 'Exp 401' },
  { speed: 275, delay: 5, status: 'efficient', name: 'Exp 402' },
  { speed: 290, delay: 2, status: 'efficient', name: 'Exp 403' },
  { speed: 260, delay: 4, status: 'efficient', name: 'Exp 404' },
  { speed: 245, delay: 6, status: 'efficient', name: 'Exp 405' },
  { speed: 230, delay: 8, status: 'efficient', name: 'Exp 406' },
  { speed: 220, delay: 10, status: 'efficient', name: 'Exp 407' },
  { speed: 200, delay: 12, status: 'efficient', name: 'Exp 408' },
  { speed: 190, delay: 15, status: 'efficient', name: 'Exp 409' },
  { speed: 180, delay: 14, status: 'efficient', name: 'Exp 410' },
  { speed: 170, delay: 18, status: 'efficient', name: 'Exp 411' },
  { speed: 160, delay: 20, status: 'efficient', name: 'Exp 412' },
  { speed: 150, delay: 22, status: 'efficient', name: 'Exp 413' },
  { speed: 135, delay: 25, status: 'efficient', name: 'Exp 414' },
  { speed: 120, delay: 28, status: 'efficient', name: 'Exp 415' },
  { speed: 110, delay: 32, status: 'efficient', name: 'Exp 416' },
  { speed: 100, delay: 51, status: 'delayed', name: 'Exp 417' },
  { speed: 85, delay: 38, status: 'efficient', name: 'Exp 418' },
  { speed: 115, delay: 30, status: 'efficient', name: 'Exp 419' },
  { speed: 125, delay: 26, status: 'efficient', name: 'Exp 420' },

  // Delayed Zone (Orange/Red)
  { speed: 210, delay: 20, status: 'delayed', name: 'Exp 501' },
  { speed: 200, delay: 18, status: 'delayed', name: 'Exp 502' },
  { speed: 190, delay: 22, status: 'delayed', name: 'Exp 503' },
  { speed: 180, delay: 16, status: 'delayed', name: 'Exp 504' },
  { speed: 175, delay: 13, status: 'delayed', name: 'Exp 505' },
  { speed: 205, delay: 25, status: 'delayed', name: 'Exp 506' },
  { speed: 220, delay: 17, status: 'delayed', name: 'Exp 507' },
  { speed: 235, delay: 19, status: 'delayed', name: 'Exp 508' },
  { speed: 165, delay: 28, status: 'delayed', name: 'Exp 509' },
  { speed: 155, delay: 31, status: 'delayed', name: 'Exp 510' },
  { speed: 145, delay: 35, status: 'delayed', name: 'Exp 511' },
  { speed: 130, delay: 39, status: 'delayed', name: 'Exp 512' },
  { speed: 120, delay: 42, status: 'delayed', name: 'Exp 513' },
  { speed: 110, delay: 46, status: 'delayed', name: 'Exp 514' },
  { speed: 250, delay: 12, status: 'delayed', name: 'Exp 515' },
  { speed: 270, delay: 8, status: 'delayed', name: 'Exp 516' },
  { speed: 285, delay: 6, status: 'delayed', name: 'Exp 517' }
];

export const CONGESTION_HEATMAP: CongestionCell[] = [
  {
    station: 'Central Station',
    '06:00-09:00': 2.5,
    '09:00-12:00': 4.1,
    '12:00-15:00': 8.8,
    '15:00-18:00': 3.7,
    '18:00-21:00': 1.0
  },
  {
    station: 'North Junction',
    '06:00-09:00': 0.8,
    '09:00-12:00': 2.3,
    '12:00-15:00': 5.6,
    '15:00-18:00': 3.3,
    '18:00-21:00': 1.0
  },
  {
    station: 'East Terminal',
    '06:00-09:00': 1.0,
    '09:00-12:00': 2.7,
    '12:00-15:00': 3.1,
    '15:00-18:00': 3.5,
    '18:00-21:00': 2.3
  },
  {
    station: 'West Hub',
    '06:00-09:00': 1.0,
    '09:00-12:00': 1.5,
    '12:00-15:00': 2.3,
    '15:00-18:00': 3.0,
    '18:00-21:00': 2.5
  },
  {
    station: 'South Park',
    '06:00-09:00': 0.9,
    '09:00-12:00': 1.0,
    '12:00-15:00': 1.8,
    '15:00-18:00': 2.9,
    '18:00-21:00': 1.0
  }
];

export const MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 'm1',
    date: 'May 28',
    title: 'Engine Diagnostics',
    target: 'Train T120 (Scheduled)',
    status: 'scheduled',
    dateStr: 'May 28'
  },
  {
    id: 'm2',
    date: 'May 30',
    title: 'Brake System Check',
    target: 'Train M55 (Critical)',
    status: 'critical',
    dateStr: 'May 31'
  },
  {
    id: 'm3',
    date: 'Jun 02',
    title: 'Wheelset Inspection',
    target: 'Train L88 (Routine)',
    status: 'routine',
    dateStr: 'Jun 02'
  },
  {
    id: 'm4',
    date: 'Jun 05',
    title: 'HVAC System Service',
    target: 'Train C40 (Predicted)',
    status: 'predicted',
    dateStr: 'Jun 05'
  },
  {
    id: 'm5',
    date: 'Jun 08',
    title: 'Signal System Calibration',
    target: 'Network-wide (Predicted)',
    status: 'predicted',
    dateStr: 'Jun 08'
  }
];
