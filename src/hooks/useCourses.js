import { useState, useEffect, useCallback } from 'react';
import {
  getSavedCourses,
  saveCourseToStorage,
  deleteCourseFromStorage,
  exportCourseGPX,
  exportCourseGeoJSON
} from '../services/storageService';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load saved courses on initial mount
  useEffect(() => {
    const loaded = getSavedCourses();
    setCourses(loaded);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  /**
   * Save course to list & storage
   */
  const handleSaveCourse = useCallback((courseData) => {
    const newCourse = {
      id: courseData.id || `course-${Date.now()}`,
      name: courseData.name || 'Custom Outdoor Course',
      description: courseData.description || '',
      mode: courseData.mode || 'foot',
      createdAt: new Date().toISOString(),
      start: courseData.start,
      end: courseData.end,
      route: courseData.route
    };

    const updated = saveCourseToStorage(newCourse);
    setCourses(updated);
    setSelectedCourseId(newCourse.id);
    showToast(`Saved course: "${newCourse.name}"`);
    return newCourse;
  }, [showToast]);

  /**
   * Delete course
   */
  const handleDeleteCourse = useCallback((id, name) => {
    const updated = deleteCourseFromStorage(id);
    setCourses(updated);
    if (selectedCourseId === id) {
      setSelectedCourseId(null);
    }
    showToast(`Deleted course: "${name || 'Course'}"`);
  }, [selectedCourseId, showToast]);

  /**
   * Export handlers
   */
  const handleExportGPX = useCallback((course) => {
    exportCourseGPX(course);
    showToast(`Exporting "${course.name}" as GPX...`);
  }, [showToast]);

  const handleExportGeoJSON = useCallback((course) => {
    exportCourseGeoJSON(course);
    showToast(`Exporting "${course.name}" as GeoJSON...`);
  }, [showToast]);

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    handleSaveCourse,
    handleDeleteCourse,
    handleExportGPX,
    handleExportGeoJSON,
    toastMessage
  };
}
