import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchPlaces } from '../../services/geocodingService';

export default function SearchBar({ onSelectLocation, themeMode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced place search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchPlaces(query);
      setResults(res);
      setIsLoading(false);
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectLocation(item.lat, item.lng, item.address || item.name);
    setQuery(item.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search place, city, or trail..."
          className={`w-full pl-10 pr-9 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            themeMode === 'light'
              ? 'bg-white text-slate-800 placeholder-slate-400 border border-slate-300 shadow-sm'
              : 'bg-slate-900/90 text-slate-100 placeholder-slate-500 border border-slate-700/80 shadow-inner'
          }`}
        />
        
        {isLoading ? (
          <Loader2 className="absolute right-3 w-4 h-4 text-emerald-400 animate-spin" />
        ) : query ? (
          <button
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Dropdown Autosuggest Results */}
      {isOpen && results.length > 0 && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-xl overflow-hidden border shadow-2xl backdrop-blur-xl animate-fade-in ${
            themeMode === 'light'
              ? 'bg-white/95 border-slate-200 text-slate-800'
              : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
          }`}
        >
          <ul className="max-h-60 overflow-y-auto divide-y divide-slate-800/20">
            {results.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left flex items-start gap-3 hover:bg-emerald-500/10 hover:text-emerald-400 transition"
                >
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 truncate">{item.address}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
