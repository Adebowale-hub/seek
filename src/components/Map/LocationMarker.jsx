import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Flag, Compass } from 'lucide-react';

/**
 * Creates custom SVG Leaflet DivIcons
 */
function createCustomIcon(type) {
  if (type === 'start') {
    return L.divIcon({
      className: 'custom-leaflet-marker-start',
      html: `
        <div class="relative flex items-center justify-center w-9 h-9 bg-emerald-500 text-slate-950 rounded-full shadow-lg border-2 border-white pulse-marker-start">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  }

  // End Pin
  return L.divIcon({
    className: 'custom-leaflet-marker-end',
    html: `
      <div class="relative flex items-center justify-center w-9 h-9 bg-rose-500 text-white rounded-full shadow-lg border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

const startIcon = createCustomIcon('start');
const endIcon = createCustomIcon('end');

export default function LocationMarker({ position, type, title, address }) {
  if (!position || !position.lat || !position.lng) return null;

  const icon = type === 'start' ? startIcon : endIcon;

  return (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      <Popup className="custom-leaflet-popup" autoPan={false}>
        <div className="p-2 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            {type === 'start' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Start Point A
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                Finish Point B
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-slate-100">{title || (type === 'start' ? 'Start Location' : 'Finish Location')}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-snug">{address || `${position.lat.toFixed(4)}°, ${position.lng.toFixed(4)}°`}</p>
        </div>
      </Popup>
    </Marker>
  );
}
