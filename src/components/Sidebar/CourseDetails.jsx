import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  Save,
  Download,
  Activity,
  Footprints,
  Bike,
  Car,
  Loader2,
  Trash2,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TRAVEL_MODES } from '../../theme/themeConfig';

export default function CourseDetails({
  startPoint,
  endPoint,
  route,
  travelMode,
  onChangeTravelMode,
  onFindFastestRoute,
  isCalculating,
  onSaveCourse,
  onResetDraft,
  themeMode
}) {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  if (isCalculating) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <div>
          <h3 className="font-bold text-base text-slate-100">Pathfinding Route...</h3>
          <p className="text-xs text-slate-400 mt-1">Calculating optimal trail distance & elevation profile</p>
        </div>
      </div>
    );
  }

  if (!startPoint) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <MapPin className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-100">No Course Active</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Click any point on the map to set <span className="text-emerald-400 font-semibold">Start Point A</span> and begin defining your course.
          </p>
        </div>
      </div>
    );
  }

  if (startPoint && !endPoint) {
    return (
      <div className="p-6 space-y-4 border border-amber-500/30 rounded-2xl bg-amber-950/20 text-amber-100 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Navigation className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-300">Point A Selected!</h3>
            <p className="text-xs text-amber-200/80">Now click Point B on the map to calculate route</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Start Address</p>
          <p className="font-semibold text-slate-200 truncate">{startPoint.address}</p>
        </div>

        <button
          onClick={onResetDraft}
          className="w-full py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Cancel Selection
        </button>
      </div>
    );
  }

  // Course Stats
  const distKm = (route.distanceMeters / 1000).toFixed(2);
  const distMiles = (route.distanceMeters * 0.000621371).toFixed(2);
  
  // Calculate active mode duration
  const activeDurationSec = (route.durationsByMode && route.durationsByMode[travelMode]) 
    ? route.durationsByMode[travelMode] 
    : (route.durationSeconds || 0);

  const formatSecs = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveCourse({
      name: courseName.trim() || `Course ${distKm}km (${startPoint.address.split(',')[0]} to ${endPoint.address.split(',')[0]})`,
      description,
      mode: travelMode,
      start: startPoint,
      end: endPoint,
      route: {
        ...route,
        durationSeconds: activeDurationSec
      }
    });
    setCourseName('');
    setDescription('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Distance Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono tracking-wider text-[10px] uppercase">Distance</span>
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white">{distKm}</span>
            <span className="text-xs font-semibold text-emerald-400 ml-1">km</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{distMiles} mi</p>
          </div>
        </div>

        {/* Duration Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono tracking-wider text-[10px] uppercase">Est. Time ({TRAVEL_MODES[travelMode]?.name.split(' ')[0]})</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-emerald-400">{formatSecs(activeDurationSec)}</span>
            <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-mono text-[10px]">
              ETA by {TRAVEL_MODES[travelMode]?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Fastest Route Action Button */}
      <button
        type="button"
        onClick={onFindFastestRoute}
        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wide transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4 text-slate-950 fill-current animate-pulse" />
        <span>Find Fastest Route</span>
      </button>

      {/* Transport Mode & ETA Comparison Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          Compare ETAs by Transport Mode
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(TRAVEL_MODES).map(([key, mode]) => {
            const isActive = travelMode === key;
            const modeSec = (route.durationsByMode && route.durationsByMode[key])
              ? route.durationsByMode[key]
              : activeDurationSec;
            
            const IconComp = key === 'foot' ? Footprints : key === 'bike' ? Bike : Car;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeTravelMode(key)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5 text-xs">
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">{mode.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  {formatSecs(modeSec)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start & End Addresses */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 ring-4 ring-emerald-500/20" />
          <div className="overflow-hidden">
            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Start (Point A)</p>
            <p className="text-xs font-semibold text-slate-200 truncate">{startPoint.address}</p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-2.5 flex items-start gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0 ring-4 ring-rose-500/20" />
          <div className="overflow-hidden">
            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Finish (Point B)</p>
            <p className="text-xs font-semibold text-slate-200 truncate">{endPoint.address}</p>
          </div>
        </div>
      </div>

      {/* Elevation Sparkline Chart */}
      {route.elevationProfile && route.elevationProfile.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono tracking-wider text-[10px] uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Elevation Profile
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              ~{Math.max(...route.elevationProfile.map(e => e.elevationM))}m peak
            </span>
          </div>

          <div className="h-16 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {(() => {
                const maxE = Math.max(...route.elevationProfile.map(e => e.elevationM)) || 1;
                const minE = Math.min(...route.elevationProfile.map(e => e.elevationM)) || 0;
                const range = maxE - minE || 1;
                
                const points = route.elevationProfile.map((pt, i) => {
                  const x = (i / (route.elevationProfile.length - 1)) * 100;
                  const y = 28 - ((pt.elevationM - minE) / range) * 22;
                  return `${x},${y}`;
                }).join(' ');

                const areaPoints = `0,30 ${points} 100,30`;

                return (
                  <>
                    <polygon points={areaPoints} fill="url(#elevGrad)" />
                    <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* Step Instructions Toggle */}
      {route.steps && route.steps.length > 0 && (
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
          <button
            type="button"
            onClick={() => setShowSteps(prev => !prev)}
            className="w-full px-4 py-2.5 text-xs font-semibold text-slate-300 flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <span>Waypoints & Directions ({route.steps.length})</span>
            {showSteps ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showSteps && (
            <ul className="px-4 pb-3 pt-1 space-y-1.5 text-[11px] text-slate-300 divide-y divide-slate-800/40 max-h-40 overflow-y-auto">
              {route.steps.map((st, idx) => (
                <li key={idx} className="pt-1.5 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Save Course Form */}
      <form onSubmit={handleSave} className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 shadow-xl">
        <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
          <Save className="w-3.5 h-3.5 text-emerald-400" /> Save Course to Library
        </h4>

        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder={`Name course (e.g., "${startPoint.address.split(',')[0]} Trail")`}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" /> Save Course
          </button>

          <button
            type="button"
            onClick={onResetDraft}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Reset
          </button>
        </div>
      </form>

    </div>
  );
}
