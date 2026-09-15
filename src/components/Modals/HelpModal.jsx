import React from 'react';
import { X, MapPin, Navigation, Save, Compass, Sparkles, Footprints, Bike, Car } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white">How to Create a Course</h2>
              <p className="text-xs text-slate-400">Master pathfinding & course creation in SEEK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Pick a Start Location (Point A)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Click anywhere on the map or use the location search bar to drop your green start pin.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Pick a Finish Point (Point B)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Click a second location on the map. SEEK will automatically calculate the route and display full distance, time, and elevation metrics.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> Customize & Save Course
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Switch activity modes (
                <span className="inline-flex items-center gap-1 text-emerald-400"><Footprints className="w-3 h-3"/> Walk</span>, 
                <span className="inline-flex items-center gap-1 text-blue-400"><Bike className="w-3 h-3"/> Bike</span>, or 
                <span className="inline-flex items-center gap-1 text-amber-400"><Car className="w-3 h-3"/> Drive</span>
                ), name your course, and save it locally or export as GPX/GeoJSON.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>
              <strong>Pro Tip:</strong> Click any saved course in the side panel to instantly re-display its high-resolution route on the map!
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Got it, Let's Explore
          </button>
        </div>

      </div>
    </div>
  );
}
