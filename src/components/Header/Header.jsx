import React from 'react';
import { Compass, Sun, Moon, HelpCircle, MapPin, Sparkles } from 'lucide-react';
import SearchBar from '../Sidebar/SearchBar';

export default function Header({
  themeMode,
  onToggleTheme,
  onOpenHelp,
  onSelectSearchLocation,
  creationStep
}) {
  return (
    <header
      className={`h-16 px-4 lg:px-6 flex items-center justify-between border-b relative z-30 transition-colors ${
        themeMode === 'light'
          ? 'bg-slate-100/90 border-slate-200 text-slate-800 backdrop-blur-md'
          : 'bg-slate-950/90 border-slate-800 text-slate-100 backdrop-blur-md'
      }`}
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold tracking-wider text-base lg:text-lg bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
              SEEK
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PATHFINDER
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400 font-medium">
            Geographic Course Builder & Exploration
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-sm lg:max-w-md mx-3 lg:mx-6">
        <SearchBar onSelectLocation={onSelectSearchLocation} themeMode={themeMode} />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Creation Step Badge (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              creationStep === 1
                ? 'bg-amber-400 animate-ping'
                : creationStep === 2
                ? 'bg-emerald-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-300">
            {creationStep === 0 && 'Mode: Select Start Point'}
            {creationStep === 1 && 'Step 2: Select Finish Point'}
            {creationStep === 2 && 'Course Ready'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
            themeMode === 'light'
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
          }`}
        >
          {themeMode === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Help Tooltip Button */}
        <button
          onClick={onOpenHelp}
          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Guide</span>
        </button>
      </div>
    </header>
  );
}
