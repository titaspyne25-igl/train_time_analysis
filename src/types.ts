export type ActiveTab = 'overview' | 'tracker' | 'command' | 'interactive';

export interface Train {
  id: string;
  name: string;
  status: 'on-time' | 'delayed' | 'warning';
  speed: number;
  nextStation: string;
  eta: string;
  fuelLevel: number;
  passengerLoad: 'Low' | 'Moderate' | 'High';
  engineTemp: 'Normal' | 'Elevated' | 'Cool';
  routeType: 'Short' | 'Medium' | 'Long';
  route: string;
  // X, Y coordinates for SVG map positioning
  x: number;
  y: number;
  angle: number; // For rendering direction arrow
  speedHistory: number[];
}

export interface LiveFeedItem {
  id: string;
  type: 'alert' | 'update' | 'warning';
  title: string;
  message: string;
  time: string;
}

export interface StationTraffic {
  name: string;
  count: number;
}

export interface JourneyDurationBucket {
  label: string;
  count: number;
}

export interface RoutePerformance {
  name: string;
  percentage: number;
}

export interface DelayRootCause {
  name: string;
  percentage: number;
  color: string;
}

export interface VolumeTrend {
  month: string;
  volume: number;
}

export interface RouteEfficiency {
  speed: number; // km/h
  delay: number; // min
  status: 'efficient' | 'delayed';
  name: string;
}

export interface CongestionCell {
  station: string;
  '06:00-09:00': number;
  '09:00-12:00': number;
  '12:00-15:00': number;
  '15:00-18:00': number;
  '18:00-21:00': number;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  title: string;
  target: string;
  status: 'scheduled' | 'critical' | 'routine' | 'predicted';
  dateStr: string;
}
