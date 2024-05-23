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

/**
 * Interface representing a job.
 */
export interface Job {
  id: string;
  datetime: string;
  status: JobStatus;
  provider_id: string;
  avg_cost_per_page: string;
  materials_turned_in_at: string;
  provider_rating: string;
  location_type: string;
  latitude: string;
  longitude: string;
}

/**
 * Interface representing a provider.
 */
export interface Provider {
  id: string;
  full_name: string;
  latitude: string;
  longitude: string;
  averageCostScore: number;
  averageRatingScore: number;
  averageTurnoverTimeScore: number;
  totalScore?: number;
}

/**
 * Interface representing the weighted preferences for selecting providers.
 */
export interface Preferences {
  costWeight: number;
  ratingWeight: number;
  turnoverWeight: number;
  proximityWeight: number;
}
