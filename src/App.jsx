import React, { useState } from 'react';
import Header from './components/Header/Header';
import MapView from './components/Map/MapView';
import Sidebar from './components/Sidebar/Sidebar';
import HelpModal from './components/Modals/HelpModal';
import { useMapState } from './hooks/useMapState';
import { useCourses } from './hooks/useCourses';
import { CheckCircle2, Zap } from 'lucide-react';
import { TRAVEL_MODES } from './theme/themeConfig';

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [fastestToast, setFastestToast] = useState(null);

  const {
    viewport,
    setViewport,
    activeProvider,
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

    handleMapClick,
    resetDraft,
    loadExistingCourse
  } = useMapState();

  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    handleSaveCourse,
    handleDeleteCourse,
    handleExportGPX,
    handleExportGeoJSON,
    toastMessage
  } = useCourses();

  // Search Bar location selection
  const handleSelectSearchLocation = (lat, lng, address) => {
    setViewport({ center: [lat, lng], zoom: 15 });
    handleMapClick(lat, lng);
  };

  // Handle saving current course draft
  const onSaveActiveCourse = (courseData) => {
    const saved = handleSaveCourse(courseData);
    if (saved) {
      loadExistingCourse(saved);
    }
  };

  // Handle "Find Fastest Route" trigger
  const triggerFindFastestRoute = async () => {
    const res = await handleFindFastestRoute();
    if (res) {
      const modeName = TRAVEL_MODES[res.fastestMode]?.name || res.fastestMode;
      const mins = Math.max(1, Math.round(res.fastestDurationSeconds / 60));
      setFastestToast(`⚡ Fastest Route Found: ${modeName} (~${mins} mins)`);
      setTimeout(() => setFastestToast(null), 4000);
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden ${themeMode === 'light' ? 'light-mode bg-slate-100 text-slate-900' : 'dark bg-slate-950 text-slate-100'}`}>
      
      {/* Top Header Bar */}
      <Header
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onOpenHelp={() => setIsHelpOpen(true)}
        onSelectSearchLocation={handleSelectSearchLocation}
        creationStep={creationStep}
      />

      {/* Main Content Area (70% Map / 30% Sidebar on Desktop) */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* Map Viewport Area (~70% on Desktop) */}
        <MapView
          viewport={viewport}
          setViewport={setViewport}
          activeProvider={activeProvider}
          activeProviderKey={activeProviderKey}
          availableProviders={availableProviders}
          onSelectProvider={setActiveProviderKey}
          themeMode={themeMode}
          creationStep={creationStep}
          startPoint={startPoint}
          endPoint={endPoint}
          hoverPoint={hoverPoint}
          setHoverPoint={setHoverPoint}
          travelMode={travelMode}
          onChangeTravelMode={changeTravelMode}
          onFindFastestRoute={triggerFindFastestRoute}
          activeRoute={activeRoute}
          onMapClick={handleMapClick}
          onResetDraft={resetDraft}
        />

        {/* Side Panel / Bottom Drawer Area (~30% on Desktop) */}
        <Sidebar
          startPoint={startPoint}
          endPoint={endPoint}
          activeRoute={activeRoute}
          travelMode={travelMode}
          onChangeTravelMode={changeTravelMode}
          onFindFastestRoute={triggerFindFastestRoute}
          isCalculatingRoute={isCalculatingRoute}
          onSaveCourse={onSaveActiveCourse}
          onResetDraft={resetDraft}

          savedCourses={courses}
          selectedCourseId={selectedCourseId}
          onSelectSavedCourse={(course) => {
            setSelectedCourseId(course.id);
            loadExistingCourse(course);
          }}
          onDeleteSavedCourse={handleDeleteCourse}
          onExportGPX={handleExportGPX}
          onExportGeoJSON={handleExportGeoJSON}
          onSelectPreset={(preset) => {
            setSelectedCourseId(preset.id);
            loadExistingCourse(preset);
          }}

          themeMode={themeMode}
        />
      </main>

      {/* Toast Feedback Notification */}
      {(toastMessage || fastestToast) && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-bounce">
          {fastestToast ? (
            <Zap className="w-4 h-4 text-amber-400 shrink-0 fill-current" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{fastestToast || toastMessage}</span>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
