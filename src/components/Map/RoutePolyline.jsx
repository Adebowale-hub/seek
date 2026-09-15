import React from 'react';
import { Polyline } from 'react-leaflet';
import { TRAVEL_MODES } from '../../theme/themeConfig';

export default function RoutePolyline({
  route,
  travelMode = 'foot',
  startPoint,
  endPoint,
  hoverPoint
}) {
  const modeColor = TRAVEL_MODES[travelMode]?.color || '#10b981';

  // Preview dashed line while picking second point
  const showPreviewLine = startPoint && !endPoint && hoverPoint;

  return (
    <>
      {/* Draft cursor preview line */}
      {showPreviewLine && (
        <Polyline
          positions={[
            [startPoint.lat, startPoint.lng],
            [hoverPoint.lat, hoverPoint.lng]
          ]}
          pathOptions={{
            color: '#10b981',
            weight: 3,
            dashArray: '8, 12',
            opacity: 0.75,
            className: 'animated-polyline'
          }}
        />
      )}

      {/* Main Calculated Route Polyline */}
      {route && route.coordinates && route.coordinates.length > 0 && (
        <>
          {/* Outer Glowing Background Polyline */}
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: modeColor,
              weight: 9,
              opacity: 0.35,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />

          {/* Inner Sharp Polyline */}
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: modeColor,
              weight: 5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        </>
      )}
    </>
  );
}
