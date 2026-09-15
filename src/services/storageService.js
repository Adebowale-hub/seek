/**
 * LocalStorage Service & GPX/GeoJSON Data Exporter
 */

const STORAGE_KEY = 'seek_saved_courses_v1';

// Initial scenic sample courses
export const PRESET_COURSES = [
  {
    id: 'preset-1',
    name: 'Emerald Coast Ridge Walk',
    description: 'Breathtaking ocean views along coastal trail paths.',
    mode: 'foot',
    createdAt: new Date().toISOString(),
    start: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Market St & 5th St, San Francisco, CA'
    },
    end: {
      lat: 37.8085,
      lng: -122.4098,
      address: 'Coit Tower, Telegraph Hill, San Francisco, CA'
    },
    route: {
      distanceMeters: 4850,
      durationSeconds: 3800,
      coordinates: [
        [37.7749, -122.4194],
        [37.7833, -122.4167],
        [37.7915, -122.4090],
        [37.8085, -122.4098]
      ],
      steps: [
        'START: Market Street Trailhead',
        'Head north towards Chinatown Gates',
        'Ascend Filbert Street Steps',
        'FINISH: Coit Tower Observation Deck'
      ],
      elevationProfile: [
        { distanceKm: 0, elevationM: 15 },
        { distanceKm: 1.2, elevationM: 45 },
        { distanceKm: 2.8, elevationM: 85 },
        { distanceKm: 4.85, elevationM: 160 }
      ]
    }
  },
  {
    id: 'preset-2',
    name: 'Metropolitan Park Loop',
    description: 'Scenic urban greenery loop with paved cycling paths.',
    mode: 'bike',
    createdAt: new Date().toISOString(),
    start: {
      lat: 40.785091,
      lng: -73.968285,
      address: 'Central Park West & 81st St, New York, NY'
    },
    end: {
      lat: 40.764356,
      lng: -73.973034,
      address: 'Grand Army Plaza, New York, NY'
    },
    route: {
      distanceMeters: 6200,
      durationSeconds: 1240,
      coordinates: [
        [40.785091, -73.968285],
        [40.796000, -73.955000],
        [40.775000, -73.960000],
        [40.764356, -73.973034]
      ],
      steps: [
        'START: Central Park West Entrance',
        'Ride along Reservoir Drive',
        'Pass Conservatory Water',
        'FINISH: 59th St Entrance'
      ],
      elevationProfile: [
        { distanceKm: 0, elevationM: 25 },
        { distanceKm: 2.1, elevationM: 42 },
        { distanceKm: 4.5, elevationM: 30 },
        { distanceKm: 6.2, elevationM: 20 }
      ]
    }
  }
];

/**
 * Retrieve saved courses from localStorage
 */
export function getSavedCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial presets if first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_COURSES));
      return PRESET_COURSES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load courses from localStorage:', err);
    return PRESET_COURSES;
  }
}

/**
 * Save a new course or update an existing one
 */
export function saveCourseToStorage(course) {
  try {
    const current = getSavedCourses();
    const existingIndex = current.findIndex(c => c.id === course.id);
    let updated;
    
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = course;
    } else {
      updated = [course, ...current];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save course to localStorage:', err);
    return [];
  }
}

/**
 * Delete a course by ID
 */
export function deleteCourseFromStorage(id) {
  try {
    const current = getSavedCourses();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete course:', err);
    return [];
  }
}

/**
 * Export course as a GPX file download
 */
export function exportCourseGPX(course) {
  if (!course || !course.route || !course.route.coordinates) return;

  const trkpts = course.route.coordinates
    .map(([lat, lng]) => `      <trkpt lat="${lat}" lon="${lng}"><ele>0</ele></trkpt>`)
    .join('\n');

  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SEEK Pathfinding App" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(course.name)}</name>
    <desc>${escapeXml(course.description || 'Created with SEEK Map App')}</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(course.name)}</name>
    <type>${course.mode.toUpperCase()}</type>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  downloadFile(`${slugify(course.name)}.gpx`, gpxContent, 'application/gpx+xml');
}

/**
 * Export course as a GeoJSON file download
 */
export function exportCourseGeoJSON(course) {
  if (!course || !course.route || !course.route.coordinates) return;

  // GeoJSON uses [lng, lat] order
  const geojsonCoords = course.route.coordinates.map(([lat, lng]) => [lng, lat]);

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: course.name,
          mode: course.mode,
          distanceMeters: course.route.distanceMeters,
          durationSeconds: course.route.durationSeconds,
          startAddress: course.start.address,
          endAddress: course.end.address
        },
        geometry: {
          type: 'LineString',
          coordinates: geojsonCoords
        }
      },
      {
        type: 'Feature',
        properties: { role: 'start', address: course.start.address },
        geometry: { type: 'Point', coordinates: [course.start.lng, course.start.lat] }
      },
      {
        type: 'Feature',
        properties: { role: 'end', address: course.end.address },
        geometry: { type: 'Point', coordinates: [course.end.lng, course.end.lat] }
      }
    ]
  };

  downloadFile(`${slugify(course.name)}.geojson`, JSON.stringify(geojson, null, 2), 'application/json');
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
