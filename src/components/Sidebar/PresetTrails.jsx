import React from 'react';
import { Sparkles, MapPin, Navigation, Footprints, Bike } from 'lucide-react';
import { PRESET_COURSES } from '../../services/storageService';

export default function PresetTrails({ onSelectPreset }) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Featured scenic courses ready to explore in 1-click:</span>
      </div>

      <div className="space-y-2.5">
        {PRESET_COURSES.map((preset) => (
          <div
            key={preset.id}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{preset.description}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider shrink-0">
                {preset.mode}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <span className="font-mono text-slate-300">
                {(preset.route.distanceMeters / 1000).toFixed(1)} km
              </span>

              <button
                onClick={() => onSelectPreset(preset)}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
              >
                Explore Trail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
