import React, { useState } from 'react';
import CourseDetails from './CourseDetails';
import CourseList from './CourseList';
import PresetTrails from './PresetTrails';
import { Compass, Navigation, Bookmark, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

export default function Sidebar({
  startPoint,
  endPoint,
  activeRoute,
  travelMode,
  onChangeTravelMode,
  onFindFastestRoute,
  isCalculatingRoute,
  onSaveCourse,
  onResetDraft,
  
  savedCourses,
  selectedCourseId,
  onSelectSavedCourse,
  onDeleteSavedCourse,
  onExportGPX,
  onExportGeoJSON,
  onSelectPreset,
  
  themeMode
}) {
  const [activeTab, setActiveTab] = useState('builder');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <aside
      className={`w-full lg:w-[30%] lg:max-w-md flex flex-col border-t lg:border-t-0 lg:border-l relative z-20 transition-all ${
        themeMode === 'light'
          ? 'bg-slate-50/95 border-slate-200 text-slate-800'
          : 'bg-slate-950/95 border-slate-800 text-slate-100'
      } ${
        isMobileExpanded ? 'h-[75vh]' : 'h-[360px] lg:h-full'
      }`}
    >
      {/* Mobile Touch Drag Handle Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800 cursor-pointer" onClick={() => setIsMobileExpanded(prev => !prev)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto" />
          <span className="text-xs font-bold text-slate-300">Course Controls & Info</span>
        </div>
        <button className="text-slate-400 p-1">
          {isMobileExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Tabs Bar Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedCourses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === 'builder' && (
          <CourseDetails
            startPoint={startPoint}
            endPoint={endPoint}
            route={activeRoute}
            travelMode={travelMode}
            onChangeTravelMode={onChangeTravelMode}
            onFindFastestRoute={onFindFastestRoute}
            isCalculating={isCalculatingRoute}
            onSaveCourse={onSaveCourse}
            onResetDraft={onResetDraft}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'saved' && (
          <CourseList
            courses={savedCourses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={(course) => {
              onSelectSavedCourse(course);
              setActiveTab('builder');
            }}
            onDeleteCourse={onDeleteSavedCourse}
            onExportGPX={onExportGPX}
            onExportGeoJSON={onExportGeoJSON}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'presets' && (
          <PresetTrails
            onSelectPreset={(preset) => {
              onSelectPreset(preset);
              setActiveTab('builder');
            }}
          />
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1 text-slate-400">
          <Compass className="w-3 h-3 text-emerald-400" /> SEEK // 70% Viewport Map
        </span>
        <span className="text-slate-500">OSRM & OSM Powered</span>
      </div>

    </aside>
  );
}
