/**
 * Geocoding and Reverse Geocoding Service Wrappers
 * Defaults to OpenStreetMap Nominatim API, automatically uses Mapbox if token exists.
 */

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Search places by name query
 * @param {string} query 
 * @returns {Promise<Array<{name: string, lat: number, lng: number, address: string}>>}
 */
export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return [];

  // Use Mapbox if key is provided
  if (MAPBOX_TOKEN) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        return data.features.map(feat => ({
          name: feat.text || feat.place_name,
          address: feat.place_name,
          lat: feat.center[1],
          lng: feat.center[0]
        }));
      }
    } catch (err) {
      console.warn('Mapbox geocoding error, falling back to Nominatim:', err);
    }
  }

  // Fallback to OSM Nominatim API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'SeekMapApp/1.0'
        }
      }
    );
    if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
    const data = await res.json();
    return data.map(item => ({
      name: item.name || item.display_name.split(',')[0],
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Nominatim search failed:', error);
    return [];
  }
}

/**
 * Reverse geocode latitude/longitude to street address
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<string>} Human-readable address
 */
export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return 'Unknown Location';

  // Use Mapbox if token available
  if (MAPBOX_TOKEN) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features[0].place_name;
        }
      }
    } catch (err) {
      console.warn('Mapbox reverse geocoding failed, trying Nominatim:', err);
    }
  }

  // OSM Nominatim Reverse Geocoding
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'SeekMapApp/1.0'
        }
      }
    );
    if (!res.ok) throw new Error(`Reverse Geocoding HTTP ${res.status}`);
    const data = await res.json();
    
    if (data.display_name) {
      // Simplify very long addresses
      const parts = data.display_name.split(', ');
      if (parts.length > 4) {
        return parts.slice(0, 4).join(', ');
      }
      return data.display_name;
    }
    
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  }
}
