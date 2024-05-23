import { Job, Provider } from "../models";

/**
 * Calculates the Haversine distance between two geographic coordinates.
 * This formula is used to find the great-circle distance between two points
 * on the surface of a sphere.
 *
 * @param coords1 - The first coordinate with latitude and longitude as numbers.
 * @param coords2 - The second coordinate with latitude and longitude as numbers.
 * @returns The distance between the two points in miles.
 *
 * @link https://www.movable-type.co.uk/scripts/latlong.html For more details on the Haversine formula.
 */
export function haversineDistance(
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number },
): number {
  function toRad(x: number): number {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d * 0.621371; // Conversion from kilometers to miles
}

/**
 * Calculates the maximum distance between all job and all providers.
 *
 * @param jobs - An array of Job objects.
 * @param providers - An array of Provider objects with latitude and longitude properties.
 * @returns The maximum distance in miles between any job and any provider.
 */
export function calculateMaxDistance(
  jobs: Job[],
  providers: Provider[],
): number {
  return jobs.reduce((maxDistance, job) => {
    if (!job.latitude || !job.longitude) {
      return maxDistance;
    }

    const jobLatLon = {
      lat: parseFloat(job.latitude),
      lon: parseFloat(job.longitude),
    };

    const currentMax = providers.reduce((providerMax, provider) => {
      if (!provider.latitude || !provider.longitude) {
        return providerMax;
      }

      const providerLatLon = {
        lat: parseFloat(provider.latitude),
        lon: parseFloat(provider.longitude),
      };

      const distance = haversineDistance(jobLatLon, providerLatLon);
      return Math.max(providerMax, distance);
    }, 0);

    return Math.max(maxDistance, currentMax);
  }, 0);
}
