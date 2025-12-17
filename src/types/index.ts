// Asset Types for Public Water Systems
export type AssetCategory =
  | 'source'           // Wells, springs, surface water intakes
  | 'treatment'        // Treatment plants, chemical feed systems
  | 'storage'          // Tanks, reservoirs, standpipes
  | 'distribution'     // Pipes, mains
  | 'pumping'          // Pump stations, booster pumps
  | 'metering'         // Flow meters, customer meters
  | 'hydrants'         // Fire hydrants
  | 'valves'           // Gate valves, PRVs, air release valves
  | 'electrical'       // SCADA, control systems, generators
  | 'other';

export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceType =
  | 'preventive'
  | 'corrective'
  | 'emergency'
  | 'inspection'
  | 'replacement';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  location: string;
  installDate: string;
  expectedLifespan: number; // years
  condition: AssetCondition;
  lastInspection: string | null;
  nextInspection: string | null;
  replacementCost: number;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConditionAssessment {
  id: string;
  assetId: string;
  assetName: string;
  assessmentDate: string;
  previousCondition: AssetCondition;
  newCondition: AssetCondition;
  assessor: string;
  findings: string;
  recommendations?: string;
  photos?: string[];
  createdAt: string;
}

export interface SystemMetrics {
  totalAssets: number;
  assetsByCategory: Record<AssetCategory, number>;
  assetsByCondition: Record<AssetCondition, number>;
  totalReplacementValue: number;
  upcomingMaintenance: number;
  overdueMaintenance: number;
  assetsNeedingAttention: number;
}

export interface WaterSystemInfo {
  id: string;
  name: string;
  pwsId: string; // Public Water System ID
  population: number;
  serviceConnections: number;
  systemType: 'community' | 'non-transient' | 'transient';
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

// Category display names and icons
export const categoryLabels: Record<AssetCategory, string> = {
  source: 'Water Source',
  treatment: 'Treatment',
  storage: 'Storage',
  distribution: 'Distribution',
  pumping: 'Pumping',
  metering: 'Metering',
  hydrants: 'Fire Hydrants',
  valves: 'Valves',
  electrical: 'Electrical/SCADA',
  other: 'Other',
};

export const conditionColors: Record<AssetCondition, string> = {
  excellent: 'bg-success-500',
  good: 'bg-success-600',
  fair: 'bg-warning-500',
  poor: 'bg-warning-600',
  critical: 'bg-danger-500',
};

export const conditionTextColors: Record<AssetCondition, string> = {
  excellent: 'text-success-700',
  good: 'text-success-600',
  fair: 'text-warning-600',
  poor: 'text-warning-700',
  critical: 'text-danger-600',
};

export const priorityColors: Record<MaintenancePriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-primary-100 text-primary-700',
  high: 'bg-warning-100 text-warning-700',
  urgent: 'bg-danger-100 text-danger-700',
};

export const statusColors: Record<MaintenanceStatus, string> = {
  scheduled: 'bg-primary-100 text-primary-700',
  in_progress: 'bg-water-100 text-water-700',
  completed: 'bg-success-100 text-success-700',
  overdue: 'bg-danger-100 text-danger-700',
  cancelled: 'bg-gray-100 text-gray-500',
};
