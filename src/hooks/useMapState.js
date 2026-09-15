import { useState, useCallback } from 'react';
import { MAP_PROVIDERS, getMapboxTileConfig } from '../theme/themeConfig';
import { reverseGeocode } from '../services/geocodingService';
import { calculateRoute, findFastestRoute } from '../services/routingService';

export function useMapState() {
  // Map Viewport state (Default: San Francisco scenic start)
  const [viewport, setViewport] = useState({
    center: [37.7749, -122.4194],
    zoom: 13
  });

  // Map theme & layer provider
  const mapboxConfigs = getMapboxTileConfig();
  const availableProviders = {
    ...MAP_PROVIDERS,
    ...(mapboxConfigs || {})
  };

  const [activeProviderKey, setActiveProviderKey] = useState(
    mapboxConfigs ? 'mapboxDark' : 'cartoDark'
  );

  // App Theme state: 'dark' | 'light'
  const [themeMode, setThemeMode] = useState('dark');

  // Course Creation Draft State
  // 0: Idle (no points)
  // 1: Start point selected (waiting for end point click)
  // 2: Route calculated (both points set)
  const [creationStep, setCreationStep] = useState(0);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [travelMode, setTravelMode] = useState('foot');
  
  const [activeRoute, setActiveRoute] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Toggle dark/light theme
  const toggleTheme = useCallback(() => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (activeProviderKey === 'cartoDark' && next === 'light') {
        setActiveProviderKey('cartoVoyager');
      } else if (activeProviderKey === 'cartoVoyager' && next === 'dark') {
        setActiveProviderKey('cartoDark');
      }
      return next;
    });
  }, [activeProviderKey]);

  /**
   * Recalculate route between current start and end points
   */
  const computeRoute = useCallback(async (start, end, mode) => {
    if (!start || !end) return;
    setIsCalculatingRoute(true);
    setRouteError(null);

    try {
      const result = await calculateRoute(
        [start.lat, start.lng],
        [end.lat, end.lng],
        mode
      );
      setActiveRoute(result);
      setCreationStep(2);
      return result;
    } catch (err) {
      console.error('Route calculation error:', err);
      setRouteError(err.message || 'Failed to calculate route.');
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  /**
   * Handle map click logic for setting point A and point B
   */
  const handleMapClick = useCallback(async (lat, lng) => {
    if (creationStep === 0 || creationStep === 2) {
      const address = await reverseGeocode(lat, lng);
      const newStart = { lat, lng, address };
      setStartPoint(newStart);
      setEndPoint(null);
      setActiveRoute(null);
      setCreationStep(1);
    } 
    else if (creationStep === 1 && startPoint) {
      const address = await reverseGeocode(lat, lng);
      const newEnd = { lat, lng, address };
      setEndPoint(newEnd);
      setHoverPoint(null);
      await computeRoute(startPoint, newEnd, travelMode);
    }
  }, [creationStep, startPoint, travelMode, computeRoute]);

  /**
   * Handle travel mode switch (foot, bike, car)
   * Instantly updates ETA for active route and re-fetches route geometry
   */
  const changeTravelMode = useCallback((newMode) => {
    setTravelMode(newMode);
    
    // Instantly update duration in state if durationsByMode exists
    if (activeRoute && activeRoute.durationsByMode && activeRoute.durationsByMode[newMode]) {
      setActiveRoute(prev => ({
        ...prev,
        durationSeconds: prev.durationsByMode[newMode]
      }));
    }

    if (startPoint && endPoint) {
      computeRoute(startPoint, endPoint, newMode);
    }
  }, [activeRoute, startPoint, endPoint, computeRoute]);

  /**
   * Find fastest route and switch to fastest mode
   */
  const handleFindFastestRoute = useCallback(async () => {
    if (!startPoint || !endPoint) return null;
    setIsCalculatingRoute(true);

    try {
      const res = await findFastestRoute(
        [startPoint.lat, startPoint.lng],
        [endPoint.lat, endPoint.lng]
      );

      setTravelMode(res.fastestMode);
      setActiveRoute(res.route);
      setCreationStep(2);
      return res;
    } catch (err) {
      console.error('Find fastest route error:', err);
      return null;
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [startPoint, endPoint]);

  /**
   * Reset current course creation draft
   */
  const resetDraft = useCallback(() => {
    setCreationStep(0);
    setStartPoint(null);
    setEndPoint(null);
    setHoverPoint(null);
    setActiveRoute(null);
    setRouteError(null);
  }, []);

  /**
   * Load an existing course object onto the map
   */
  const loadExistingCourse = useCallback((course) => {
    setStartPoint(course.start);
    setEndPoint(course.end);
    setTravelMode(course.mode || 'foot');
    setActiveRoute(course.route);
    setCreationStep(2);

    if (course.start && course.start.lat) {
      setViewport({
        center: [course.start.lat, course.start.lng],
        zoom: 14
      });
    }
  }, []);

  return {
    viewport,
    setViewport,
    activeProvider: availableProviders[activeProviderKey] || MAP_PROVIDERS.cartoDark,
    activeProviderKey,
    setActiveProviderKey,
    availableProviders,
    themeMode,
    toggleTheme,
    
    creationStep,
    startPoint,
    setStartPoint,
    endPoint,
    setEndPoint,
    hoverPoint,
    setHoverPoint,
    travelMode,
    changeTravelMode,
    handleFindFastestRoute,
    
    activeRoute,
    isCalculatingRoute,
    routeError,
    
    handleMapClick,
    resetDraft,
    loadExistingCourse
  };
}
