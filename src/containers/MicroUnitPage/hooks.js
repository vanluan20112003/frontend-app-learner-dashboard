import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import { microUnitsHooks } from 'data/redux/hooks';
import { selectors } from 'data/redux';
import * as apiHooks from 'hooks/api';
import api from 'data/services/lms/api';

import messages from './messages';

/**
 * Hook to initialize and fetch micro units data
 * Fetches micro units for all enrolled courses
 */
export const useInitializeMicroUnits = () => {
  const courseData = useSelector(selectors.app.courseData);
  const loadMicroUnitsByCourse = microUnitsHooks.useLoadMicroUnitsByCourse();
  const setLoading = microUnitsHooks.useSetLoading();
  const setError = microUnitsHooks.useSetError();

  const initializeApp = apiHooks.useInitializeApp();

  // Track if we've already initialized to prevent infinite loops
  const hasInitializedRef = React.useRef(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

  const initializeMicroUnits = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const courses = Object.values(courseData || {});
      console.log(`[MicroUnits] Found ${courses.length} enrolled courses`);

      // If no courses enrolled, finish loading immediately
      if (courses.length === 0) {
        setLoading(false);
        setIsInitializing(false);
        return;
      }

      // Fetch micro units for each enrolled course using direct API call
      const promises = courses.map(async (course) => {
        const courseId = course.courseRun?.courseId;
        if (!courseId) {
          console.warn('[MicroUnits] Course missing courseId:', course);
          return;
        }

        try {
          console.log(`[MicroUnits] Fetching for course: ${courseId}`);

          // Direct API call
          const response = await api.fetchCourseMicroUnits(courseId);
          console.log(`[MicroUnits] Response for ${courseId}:`, response);

          if (response && response.data) {
            // API returns paginated response with results array
            const microUnits = response.data.results || response.data;
            console.log(`[MicroUnits] Loading ${microUnits.length} micro units for ${courseId}`);
            loadMicroUnitsByCourse(courseId, microUnits);
          }
        } catch (err) {
          console.error(`[MicroUnits] Error fetching micro units for course ${courseId}:`, err);
        }
      });

      await Promise.all(promises);
      setLoading(false);
      setIsInitializing(false);
      console.log('[MicroUnits] Initialization complete');
    } catch (error) {
      console.error('[MicroUnits] Error initializing micro units:', error);
      setError(error.message || 'Failed to load micro units');
      setLoading(false);
      setIsInitializing(false);
    }
  }, [courseData, loadMicroUnitsByCourse, setLoading, setError]);

  // Initialize app data (courseData) first
  React.useEffect(() => {
    initializeApp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Then fetch micro units when courseData is ready (only once)
  React.useEffect(() => {
    if (!hasInitializedRef.current && Object.keys(courseData || {}).length > 0) {
      hasInitializedRef.current = true;
      console.log('[MicroUnits] Starting initialization...');
      initializeMicroUnits();
    }
  }, [courseData]); // eslint-disable-line react-hooks/exhaustive-deps

  return { initializeMicroUnits, isInitializing };
};

/**
 * Hook to get filter and sort options with handlers
 */
export const useFilterControls = () => {
  const filters = microUnitsHooks.useFilters();
  const sortBy = microUnitsHooks.useSortBy();
  const setSearch = microUnitsHooks.useSetSearch();
  const setDifficultyFilter = microUnitsHooks.useSetDifficultyFilter();
  const setSortBy = microUnitsHooks.useSetSortBy();
  const clearFilters = microUnitsHooks.useClearFilters();

  const handleSearchChange = React.useCallback((value) => {
    setSearch(value);
  }, [setSearch]);

  const handleDifficultyChange = React.useCallback((value) => {
    setDifficultyFilter(value);
  }, [setDifficultyFilter]);

  const handleSortChange = React.useCallback((value) => {
    setSortBy(value);
  }, [setSortBy]);

  const handleClearFilters = React.useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  return {
    filters,
    sortBy,
    handleSearchChange,
    handleDifficultyChange,
    handleSortChange,
    handleClearFilters,
  };
};

/**
 * Hook to get micro units data organized by course
 */
export const useMicroUnitsData = () => {
  const courseData = useSelector(selectors.app.courseData);
  const courses = React.useMemo(() => Object.values(courseData || {}), [courseData]);
  const groupedMicroUnits = microUnitsHooks.useMicroUnitsGroupedByCourse(courses);
  const isLoading = microUnitsHooks.useIsLoading();
  const error = microUnitsHooks.useError();
  const hasActiveMicroUnits = microUnitsHooks.useHasActiveMicroUnits();
  const filteredCount = microUnitsHooks.useFilteredMicroUnitsCount();

  return {
    groupedMicroUnits,
    isLoading,
    error,
    hasActiveMicroUnits,
    filteredCount,
  };
};

/**
 * Hook to get formatted messages
 */
export const useMicroUnitMessages = () => {
  const { formatMessage } = useIntl();

  return {
    pageTitle: formatMessage(messages.pageTitle),
    searchPlaceholder: formatMessage(messages.searchPlaceholder),
    filterButton: formatMessage(messages.filterButton),
    sortBy: formatMessage(messages.sortBy),
    sortOptions: [
      { value: 'title', label: formatMessage(messages.sortByTitle) },
      { value: 'duration', label: formatMessage(messages.sortByDuration) },
      { value: 'difficulty', label: formatMessage(messages.sortByDifficulty) },
      { value: 'order', label: formatMessage(messages.sortByOrder) },
    ],
    difficultyOptions: [
      { value: '', label: formatMessage(messages.difficultyAll) },
      { value: 'easy', label: formatMessage(messages.difficultyEasy) },
      { value: 'medium', label: formatMessage(messages.difficultyMedium) },
      { value: 'hard', label: formatMessage(messages.difficultyHard) },
    ],
    startLearning: formatMessage(messages.startLearning),
    viewDetails: formatMessage(messages.viewDetails),
    emptyStateTitle: formatMessage(messages.emptyStateTitle),
    emptyStateDescription: formatMessage(messages.emptyStateDescription),
    emptyStateAction: formatMessage(messages.emptyStateAction),
    noResultsTitle: formatMessage(messages.noResultsTitle),
    noResultsDescription: formatMessage(messages.noResultsDescription),
    clearFilters: formatMessage(messages.clearFilters),
    loading: formatMessage(messages.loading),
    errorTitle: formatMessage(messages.errorTitle),
    errorDescription: formatMessage(messages.errorDescription),
    retryButton: formatMessage(messages.retryButton),
  };
};

/**
 * Hook to format micro unit metadata
 */
export const useFormatMicroUnitMeta = () => {
  const { formatMessage } = useIntl();

  const formatDuration = (duration) => formatMessage(messages.estimatedDuration, { duration });

  const formatBlocksCount = (count) => formatMessage(messages.blocksCount, { count });

  const formatMicroUnitsCount = (count) => formatMessage(messages.microUnitsCount, { count });

  return {
    formatDuration,
    formatBlocksCount,
    formatMicroUnitsCount,
  };
};
