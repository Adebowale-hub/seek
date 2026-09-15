import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Trash2,
  Download,
  Footprints,
  Bike,
  Car,
  Search,
  CheckCircle2
} from 'lucide-react';
import { TRAVEL_MODES } from '../../theme/themeConfig';

export default function CourseList({
  courses,
  selectedCourseId,
  onSelectCourse,
  onDeleteCourse,
  onExportGPX,
  onExportGeoJSON,
  themeMode
}) {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.start?.address?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-3 animate-fade-in">
      
      {/* Search Filter input */}
      <div className="relative">
        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none top-2.5" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter saved courses..."
          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl space-y-2">
          <p className="text-xs font-semibold text-slate-400">No saved courses found</p>
          <p className="text-[11px] text-slate-500">Create a course on the map and click "Save Course" to store it here.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredCourses.map((course) => {
            const isSelected = selectedCourseId === course.id;
            const mode = TRAVEL_MODES[course.mode || 'foot'];
            const distKm = (course.route?.distanceMeters / 1000).toFixed(2);
            const totalSecs = course.route?.durationSeconds || 0;
            const mins = Math.floor((totalSecs % 3600) / 60);

            const ModeIcon = course.mode === 'bike' ? Bike : course.mode === 'car' ? Car : Footprints;

            return (
              <div
                key={course.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {course.name}
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {course.start?.address?.split(',')[0]} &rarr; {course.end?.address?.split(',')[0]}
                    </p>
                  </div>

                  {/* Mode Badge */}
                  <span
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                    style={{ backgroundColor: `${mode?.color}20`, color: mode?.color }}
                  >
                    <ModeIcon className="w-3 h-3" />
                    {mode?.name.split(' ')[0]}
                  </span>
                </div>

                {/* Metrics Pill */}
                <div className="flex items-center gap-3 text-xs text-slate-300 font-mono py-1 border-y border-slate-800/60 my-2">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-400" /> {distKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> ~{mins} mins
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
                    }`}
                  >
                    {isSelected ? 'Active on Map' : 'Load on Map'}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* GPX Export */}
                    <button
                      onClick={() => onExportGPX(course)}
                      title="Export GPX"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[10px] font-mono flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> GPX
                    </button>

                    {/* GeoJSON Export */}
                    <button
                      onClick={() => onExportGeoJSON(course)}
                      title="Export GeoJSON"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-[10px] font-mono flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> GeoJSON
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteCourse(course.id, course.name)}
                      title="Delete Course"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
