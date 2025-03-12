import { EarthquakeData, EarthquakePoint } from '../types/earthquake';

// Re-export types for convenience
export type { EarthquakeData, EarthquakePoint } from '../types/earthquake';

// USGS Earthquake API endpoints
const USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export const EarthquakeFeeds = {
  HOUR_ALL: `${USGS_API_BASE}/all_hour.geojson`,
  DAY_ALL: `${USGS_API_BASE}/all_day.geojson`,
  WEEK_ALL: `${USGS_API_BASE}/all_week.geojson`,
  MONTH_ALL: `${USGS_API_BASE}/all_month.geojson`,

  HOUR_M45: `${USGS_API_BASE}/4.5_hour.geojson`,
  DAY_M45: `${USGS_API_BASE}/4.5_day.geojson`,
  WEEK_M45: `${USGS_API_BASE}/4.5_week.geojson`,
  MONTH_M45: `${USGS_API_BASE}/4.5_month.geojson`,

  HOUR_M25: `${USGS_API_BASE}/2.5_hour.geojson`,
  DAY_M25: `${USGS_API_BASE}/2.5_day.geojson`,
  WEEK_M25: `${USGS_API_BASE}/2.5_week.geojson`,
  MONTH_M25: `${USGS_API_BASE}/2.5_month.geojson`,

  HOUR_M1: `${USGS_API_BASE}/1.0_hour.geojson`,
  DAY_M1: `${USGS_API_BASE}/1.0_day.geojson`,
  WEEK_M1: `${USGS_API_BASE}/1.0_week.geojson`,
  MONTH_M1: `${USGS_API_BASE}/1.0_month.geojson`,

  HOUR_SIG: `${USGS_API_BASE}/significant_hour.geojson`,
  DAY_SIG: `${USGS_API_BASE}/significant_day.geojson`,
  WEEK_SIG: `${USGS_API_BASE}/significant_week.geojson`,
  MONTH_SIG: `${USGS_API_BASE}/significant_month.geojson`,
};

export type EarthquakeFeedType = 'all' | 'm45' | 'm25' | 'm1' | 'significant';
export type EarthquakePeriod = 'hour' | 'day' | 'week' | 'month';

export async function fetchEarthquakes(
  period: EarthquakePeriod = 'day',
  type: EarthquakeFeedType = 'all'
): Promise<EarthquakeData> {
  const feedKey = `${period.toUpperCase()}_${type === 'all' ? 'ALL' : type === 'm45' ? 'M45' : type === 'm25' ? 'M25' : type === 'm1' ? 'M1' : 'SIG'}`;
  const url = EarthquakeFeeds[feedKey as keyof typeof EarthquakeFeeds];

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake data: ${response.statusText}`);
  }

  const data: EarthquakeData = await response.json();
  return data;
}

export function transformEarthquakeData(data: EarthquakeData): EarthquakePoint[] {
  return data.features.map(feature => ({
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    magnitude: feature.properties.mag,
    depth: feature.geometry.coordinates[2],
    place: feature.properties.place,
    time: feature.properties.time,
    tsunami: feature.properties.tsunami === 1,
    alert: feature.properties.alert,
  }));
}

export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return '#ff0000'; // Red - Major
  if (magnitude >= 6) return '#ff6600'; // Orange-Red - Strong
  if (magnitude >= 5) return '#ff9900'; // Orange - Moderate
  if (magnitude >= 4) return '#ffcc00'; // Yellow-Orange - Light
  if (magnitude >= 3) return '#ffff00'; // Yellow - Minor
  if (magnitude >= 2) return '#ccff00'; // Yellow-Green - Very Minor
  return '#66ff66'; // Green - Micro
}

export function getMagnitudeLabel(magnitude: number): string {
  if (magnitude >= 8) return 'Great';
  if (magnitude >= 7) return 'Major';
  if (magnitude >= 6) return 'Strong';
  if (magnitude >= 5) return 'Moderate';
  if (magnitude >= 4) return 'Light';
  if (magnitude >= 3) return 'Minor';
  if (magnitude >= 2) return 'Very Minor';
  return 'Micro';
}

export function formatEarthquakeTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function calculateEarthquakeStats(points: EarthquakePoint[]) {
  if (points.length === 0) {
    return {
      total: 0,
      maxMagnitude: 0,
      avgMagnitude: 0,
      majorCount: 0,
      strongCount: 0,
      moderateCount: 0,
      lightCount: 0,
      tsunamiCount: 0,
    };
  }

  const maxMagnitude = Math.max(...points.map(p => p.magnitude));
  const avgMagnitude = points.reduce((sum, p) => sum + p.magnitude, 0) / points.length;

  return {
    total: points.length,
    maxMagnitude,
    avgMagnitude,
    majorCount: points.filter(p => p.magnitude >= 7).length,
    strongCount: points.filter(p => p.magnitude >= 6 && p.magnitude < 7).length,
    moderateCount: points.filter(p => p.magnitude >= 5 && p.magnitude < 6).length,
    lightCount: points.filter(p => p.magnitude >= 4 && p.magnitude < 5).length,
    tsunamiCount: points.filter(p => p.tsunami).length,
  };
}
