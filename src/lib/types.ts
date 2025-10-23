// src/lib/types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  chartType: 'line' | 'bar' | 'area';
  refreshInterval: number;
  theme: 'light' | 'dark';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growth: number;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  category?: string;
}

export interface TableRow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  value: number;
  date: string;
}