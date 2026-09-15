import React, { useState } from 'react';
import {
  Layers,
  LocateFixed,
  Maximize2,
  Trash2,
  Footprints,
  Bike,
  Car,
  Check,
  Zap
} from 'lucide-react';
import { TRAVEL_MODES } from '../../theme/themeConfig';

export default function MapControls({
  availableProviders,
  activeProviderKey,
  onSelectProvider,
  onRecenterMap,
  onLocateUser,
  onResetDraft,
  onFindFastestRoute,
  travelMode,
  onChangeTravelMode,
  creationStep,
  themeMode
}) {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
      
      {/* Travel Mode Selector Pill */}
      <div
        className={`p-1.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-center gap-1 ${
          themeMode === 'light'
            ? 'bg-white/90 border-slate-200 text-slate-800'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}
      >
        {Object.entries(TRAVEL_MODES).map(([key, mode]) => {
          const isActive = travelMode === key;
          const IconComponent =
            key === 'foot' ? Footprints : key === 'bike' ? Bike : Car;

          return (
            <button
              key={key}
              onClick={() => onChangeTravelMode(key)}
              title={`Switch mode to ${mode.name}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{mode.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Control Buttons Cluster */}
      <div
        className={`p-1.5 rounded-2xl border shadow-xl backdrop-blur-xl flex flex-col gap-1 ${
          themeMode === 'light'
            ? 'bg-white/90 border-slate-200 text-slate-800'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}
      >
        {/* Find Fastest Route Button (when route is active) */}
        {creationStep === 2 && (
          <button
            onClick={onFindFastestRoute}
            title="Find Fastest Route & Mode"
            className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition flex items-center justify-center border border-amber-500/40"
          >
            <Zap className="w-4 h-4 fill-current animate-pulse" />
          </button>
        )}

        {/* Layer Selector Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(prev => !prev)}
            title="Map Tile Style"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2 text-xs font-semibold"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Layer Menu Dropdown */}
          {isLayerMenuOpen && (
            <div
              className={`absolute right-full top-0 mr-2 w-48 rounded-2xl border shadow-2xl backdrop-blur-xl p-2 z-30 ${
                themeMode === 'light'
                  ? 'bg-white/95 border-slate-200 text-slate-800'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
              }`}
            >
              <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 px-3 py-1 mb-1 border-b border-slate-800">
                Map Tile Engine
              </p>
              <div className="space-y-1">
                {Object.entries(availableProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectProvider(key);
                      setIsLayerMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-xl text-xs font-medium flex items-center justify-between transition ${
                      activeProviderKey === key
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{provider.name}</span>
                    {activeProviderKey === key && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recenter Fit Bounds Button */}
        <button
          onClick={onRecenterMap}
          title="Fit Map to Route"
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
        >
          <Maximize2 className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Locate User GPS Button */}
        <button
          onClick={onLocateUser}
          title="My Location"
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
        >
          <LocateFixed className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Clear Draft Course Button */}
        {creationStep > 0 && (
          <button
            onClick={onResetDraft}
            title="Reset Draft Course"
            className="p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition border-t border-slate-800/60 mt-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
