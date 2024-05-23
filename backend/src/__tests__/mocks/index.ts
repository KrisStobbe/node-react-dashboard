import { JobLocation, JobStatus } from "../../models";

export const mockJob = {
  id: "1",
  datetime: "2024-01-01T00:00:00Z",
  status: JobStatus.SCHEDULED,
  provider_id: "provider1",
  avg_cost_per_page: "0.10",
  materials_turned_in_at: "2024-01-02T00:00:00Z",
  provider_rating: "4.5",
  location_type: JobLocation.LOCATION_BASED,
  latitude: "34.0522",
  longitude: "-118.2437",
};

export const mockProvider = {
  id: "1",
  full_name: "Provider A",
  latitude: "34.0522",
  longitude: "-118.2437",
  averageCostScore: 0.9,
  averageRatingScore: 0.5,
  averageTurnoverTimeScore: 1,
};

export const mockPreferences = {
  costWeight: 1,
  ratingWeight: 1,
  turnoverWeight: 1,
  proximityWeight: 1,
};

export const maxDistance = 100;
