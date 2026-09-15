/**
 * SEEK Theme and Map Configuration
 */

export const MAP_PROVIDERS = {
  cartoDark: {
    id: 'cartoDark',
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    theme: 'dark'
  },
  cartoVoyager: {
    id: 'cartoVoyager',
    name: 'CartoDB Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    theme: 'light'
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    theme: 'light'
  },
  esriSatellite: {
    id: 'esriSatellite',
    name: 'Esri Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    theme: 'dark'
  }
};

export const TRAVEL_MODES = {
  foot: {
    id: 'foot',
    osrmProfile: 'foot',
    name: 'Walk / Hike',
    icon: 'Footprints',
    color: '#10b981', // emerald-500
    avgSpeedKmh: 4.5
  },
  bike: {
    id: 'bike',
    osrmProfile: 'bike',
    name: 'Cycling',
    icon: 'Bike',
    color: '#3b82f6', // blue-500
    avgSpeedKmh: 18.0
  },
  car: {
    id: 'car',
    osrmProfile: 'driving',
    name: 'Drive',
    icon: 'Car',
    color: '#f59e0b', // amber-500
    avgSpeedKmh: 50.0
  }
};

/**
 * Gets Mapbox tile URL if token is defined in environment variables
 */
export const getMapboxTileConfig = () => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) return null;

  return {
    mapboxDark: {
      id: 'mapboxDark',
      name: 'Mapbox Dark',
      url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${token}`,
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 20,
      tileSize: 512,
      zoomOffset: -1
    },
    mapboxOutdoors: {
      id: 'mapboxOutdoors',
      name: 'Mapbox Outdoors',
      url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=${token}`,
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 20,
      tileSize: 512,
      zoomOffset: -1
    }
  };
};
