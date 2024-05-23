export interface Job {
  id: string;
  datetime: string;
  status: string;
  provider_id: string;
  avg_cost_per_page: number;
  materials_turned_in_at: string;
  provider_rating: string;
  location_type: string;
  latitude: number;
  longitude: number;
}

export interface Provider {
  id: string;
  full_name: string;
  latitude: number;
  longitude: number;
  averageCostScore: number;
  averageRatingScore: number;
  averageTurnoverTimeScore: number;
  totalScore: number;
}

/**
 * Enum for job status types.
 */
export enum JobStatus {
  COMPLETE = "COMPLETE",
  AWAITING = "AWAITING MATERIALS",
  SCHEDULED = "SCHEDULED",
}

/**
 * Enum for job location types.
 */
export enum JobLocation {
  REMOTE = "REMOTE",
  LOCATION_BASED = "LOCATION_BASED",
}
