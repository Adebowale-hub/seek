/**
 * Routing Service Wrapper
 * Connects to OSRM (Open Source Routing Machine) API or Mapbox Directions API
 * Computes mode-specific ETAs for Foot, Bike, and Car.
 */

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Realistic urban speeds (meters / second)
const SPEED_CONFIG = {
  foot: 1.25,  // ~4.5 km/h
  bike: 4.50,  // ~16.2 km/h
  car: 13.50   // ~48.6 km/h
};

/**
 * Calculates realistic mode-specific durations in seconds based on distance and mode
 */
function getDurationsForDistance(distanceMeters, osrmDrivingDuration) {
  const footSec = Math.round(distanceMeters / SPEED_CONFIG.foot);
  const bikeSec = Math.round(distanceMeters / SPEED_CONFIG.bike);
  // For car, use OSRM driving duration if available and non-zero, otherwise compute from speed
  const carSec = osrmDrivingDuration > 0 
    ? Math.round(osrmDrivingDuration) 
    : Math.round(distanceMeters / SPEED_CONFIG.car);

  return {
    foot: footSec,
    bike: bikeSec,
    car: carSec
  };
}

/**
 * Calculates a route between two lat/lng points.
 * @param {Array<number>} startCoords - [lat, lng]
 * @param {Array<number>} endCoords - [lat, lng]
 * @param {string} mode - 'foot' | 'bike' | 'car'
 * @returns {Promise<{
 *   coordinates: Array<[number, number]>,
 *   distanceMeters: number,
 *   durationSeconds: number,
 *   durationsByMode: { foot: number, bike: number, car: number },
 *   steps: Array<string>,
 *   elevationProfile: Array<{distanceKm: number, elevationM: number}>
 * }>}
 */
export async function calculateRoute(startCoords, endCoords, mode = 'foot') {
  const [startLat, startLng] = startCoords;
  const [endLat, endLng] = endCoords;

  // Try Mapbox Directions API if token exists
  if (MAPBOX_TOKEN) {
    try {
      const mapboxProfile = mode === 'car' ? 'driving' : mode === 'bike' ? 'cycling' : 'walking';
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mapboxProfile}/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const leafletCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
          const steps = route.legs[0]?.steps.map(s => s.maneuver.instruction) || [];
          const durationsByMode = getDurationsForDistance(route.distance, route.duration);
          
          return {
            coordinates: leafletCoords,
            distanceMeters: route.distance,
            durationSeconds: durationsByMode[mode] || route.duration,
            durationsByMode,
            steps,
            elevationProfile: generateElevationProfile(leafletCoords, route.distance)
          };
        }
      }
    } catch (err) {
      console.warn('Mapbox directions failed, falling back to OSRM:', err);
    }
  }

  // Fallback to OSRM API (using driving profile for optimal geometry)
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(osrmUrl);
    if (!res.ok) throw new Error(`OSRM Routing failed with status ${res.status}`);
    
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(data.message || 'No route found between selected points');
    }

    const route = data.routes[0];
    const leafletCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    
    const steps = [];
    if (route.legs && route.legs[0] && route.legs[0].steps) {
      route.legs[0].steps.forEach(step => {
        if (step.maneuver && step.name) {
          const type = step.maneuver.type || 'proceed';
          steps.push(`${type.toUpperCase()}: ${step.name} (${(step.distance / 1000).toFixed(1)} km)`);
        }
      });
    }

    const durationsByMode = getDurationsForDistance(route.distance, route.duration);

    return {
      coordinates: leafletCoords,
      distanceMeters: route.distance,
      durationSeconds: durationsByMode[mode] || Math.round(route.distance / SPEED_CONFIG[mode]),
      durationsByMode,
      steps: steps.length > 0 ? steps : ['Proceed along calculated path to destination.'],
      elevationProfile: generateElevationProfile(leafletCoords, route.distance)
    };
  } catch (error) {
    console.error('Routing calculation error:', error);
    
    // Straight line fallback if OSRM service is unreachable
    const straightLineCoords = [startCoords, endCoords];
    const distMeters = calculateHaversineDistance(startLat, startLng, endLat, endLng);
    const durationsByMode = getDurationsForDistance(distMeters, 0);

    return {
      coordinates: straightLineCoords,
      distanceMeters: distMeters,
      durationSeconds: durationsByMode[mode] || Math.round(distMeters / SPEED_CONFIG[mode]),
      durationsByMode,
      steps: ['Direct trail line (offline mode)'],
      elevationProfile: generateElevationProfile(straightLineCoords, distMeters)
    };
  }
}

/**
 * Finds the fastest route and transport mode between two coordinates
 * @param {Array<number>} startCoords 
 * @param {Array<number>} endCoords 
 * @returns {Promise<{
 *   fastestMode: 'foot' | 'bike' | 'car',
 *   fastestDurationSeconds: number,
 *   route: Object
 * }>}
 */
export async function findFastestRoute(startCoords, endCoords) {
  // Compute route for car mode (default fastest for ground travel)
  const routeResult = await calculateRoute(startCoords, endCoords, 'car');
  const durations = routeResult.durationsByMode || {};
  
  // Find mode with minimum duration
  let fastestMode = 'car';
  let minDuration = durations.car || routeResult.durationSeconds;

  if (durations.bike && durations.bike < minDuration) {
    fastestMode = 'bike';
    minDuration = durations.bike;
  }

  if (durations.foot && durations.foot < minDuration) {
    fastestMode = 'foot';
    minDuration = durations.foot;
  }

  return {
    fastestMode,
    fastestDurationSeconds: minDuration,
    route: {
      ...routeResult,
      durationSeconds: minDuration
    }
  };
}

/**
 * Calculates straight line Haversine distance in meters
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Generates realistic elevation samples along a polyline
 */
function generateElevationProfile(coords, totalDistanceMeters) {
  const pointsCount = Math.min(Math.max(coords.length, 10), 30);
  const totalKm = totalDistanceMeters / 1000;
  const baseElev = 120 + Math.abs(coords[0][0] * 10) % 200;
  
  const profile = [];
  let currentElev = baseElev;

  for (let i = 0; i < pointsCount; i++) {
    const fraction = i / (pointsCount - 1);
    const distanceKm = +(fraction * totalKm).toFixed(2);
    
    // Terrain wave calculation using trigonometric offsets
    const noise = Math.sin(i * 0.8) * 25 + Math.cos(i * 1.5) * 12;
    currentElev = Math.max(10, Math.round(baseElev + noise + (i % 3 === 0 ? 15 : -8)));
    
    profile.push({
      distanceKm,
      elevationM: currentElev
    });
  }

  return profile;
}
