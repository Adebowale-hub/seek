import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import LocationMarker from './LocationMarker';
import RoutePolyline from './RoutePolyline';
import MapControls from './MapControls';
import { Sparkles, Navigation, MapPin } from 'lucide-react';

/**
 * Sub-component for handling map interaction events (clicks, mouse moves)
 */
function MapEventHandler({ onMapClick, setHoverPoint, creationStep }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    mousemove(e) {
      if (creationStep === 1) {
        setHoverPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

/**
 * Sub-component for updating map viewport center and fitting bounds
 */
function MapBoundsUpdater({ viewport, route, startPoint, endPoint }) {
  const map = useMap();

  useEffect(() => {
    if (route && route.coordinates && route.coordinates.length > 0) {
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
    } else if (startPoint && !endPoint) {
      map.flyTo([startPoint.lat, startPoint.lng], 14, { animate: true });
    }
  }, [route, startPoint, endPoint, map]);

  useEffect(() => {
    if (viewport && viewport.center) {
      map.setView(viewport.center, viewport.zoom);
    }
  }, [viewport, map]);

  return null;
}

export default function MapView({
  viewport,
  setViewport,
  activeProvider,
  activeProviderKey,
  availableProviders,
  onSelectProvider,
  themeMode,
  creationStep,
  startPoint,
  endPoint,
  hoverPoint,
  setHoverPoint,
  travelMode,
  onChangeTravelMode,
  onFindFastestRoute,
  activeRoute,
  onMapClick,
  onResetDraft
}) {
  const mapRef = useRef(null);

  const handleRecenter = () => {
    if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(activeRoute.coordinates);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (startPoint && mapRef.current) {
      mapRef.current.flyTo([startPoint.lat, startPoint.lng], 14, { animate: true });
    } else if (mapRef.current) {
      mapRef.current.flyTo([37.7749, -122.4194], 13, { animate: true });
    }
  };

  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15, { animate: true });
          }
          onMapClick(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('Geolocation unavailable or permission denied.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none">
      
      {/* Dynamic Floating Instruction Banner over Map */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-xs sm:max-w-md">
        <div
          className={`px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-center gap-3 transition-all animate-fade-in ${
            creationStep === 1
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              : creationStep === 2
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${
              creationStep === 1
                ? 'bg-amber-500/20 text-amber-400'
                : creationStep === 2
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-emerald-400'
            }`}
          >
            {creationStep === 1 ? (
              <Navigation className="w-4 h-4 animate-bounce" />
            ) : creationStep === 2 ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </div>
          <div className="text-xs">
            <p className="font-bold tracking-wide">
              {creationStep === 0 && 'Click map to set START location'}
              {creationStep === 1 && 'Click map to set DESTINATION location'}
              {creationStep === 2 && 'Course Route Calculated'}
            </p>
            <p className="text-[11px] opacity-80 font-medium">
              {creationStep === 0 && 'Point A start pin will be dropped'}
              {creationStep === 1 && 'Point B finish pin will trigger route'}
              {creationStep === 2 && 'Save or export details in side panel'}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Map Controls */}
      <MapControls
        availableProviders={availableProviders}
        activeProviderKey={activeProviderKey}
        onSelectProvider={onSelectProvider}
        onRecenterMap={handleRecenter}
        onLocateUser={handleLocateUser}
        onResetDraft={onResetDraft}
        onFindFastestRoute={onFindFastestRoute}
        travelMode={travelMode}
        onChangeTravelMode={onChangeTravelMode}
        creationStep={creationStep}
        themeMode={themeMode}
      />

      {/* Leaflet Map Engine Container */}
      <MapContainer
        ref={mapRef}
        center={viewport.center}
        zoom={viewport.zoom}
        zoomControl={true}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Active Map Tile Provider */}
        <TileLayer
          key={activeProvider.id}
          url={activeProvider.url}
          attribution={activeProvider.attribution}
          maxZoom={activeProvider.maxZoom || 19}
        />

        {/* Map Click & Mouse Events Handler */}
        <MapEventHandler
          onMapClick={onMapClick}
          setHoverPoint={setHoverPoint}
          creationStep={creationStep}
        />

        {/* Dynamic Bounds Updater */}
        <MapBoundsUpdater
          viewport={viewport}
          route={activeRoute}
          startPoint={startPoint}
          endPoint={endPoint}
        />

        {/* Start Point Pin */}
        {startPoint && (
          <LocationMarker
            position={startPoint}
            type="start"
            title="Start Point A"
            address={startPoint.address}
          />
        )}

        {/* End Point Pin */}
        {endPoint && (
          <LocationMarker
            position={endPoint}
            type="end"
            title="Finish Point B"
            address={endPoint.address}
          />
        )}

        {/* Calculated Polyline Route */}
        <RoutePolyline
          route={activeRoute}
          travelMode={travelMode}
          startPoint={startPoint}
          endPoint={endPoint}
          hoverPoint={hoverPoint}
        />
      </MapContainer>
    </div>
  );
}
