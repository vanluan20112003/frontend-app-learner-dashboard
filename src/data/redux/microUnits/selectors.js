import { createSelector } from 'reselect';
import { StrictDict } from 'utils';

import * as module from './selectors';

export const microUnitsSelector = (state) => state.microUnits;
const mkSimpleSelector = (cb) => createSelector([module.microUnitsSelector], cb);

// Simple selectors
export const simpleSelectors = StrictDict({
  microUnitsData: mkSimpleSelector(microUnits => microUnits.microUnitsData),
  groupedByCourse: mkSimpleSelector(microUnits => microUnits.groupedByCourse),
  isLoading: mkSimpleSelector(microUnits => microUnits.isLoading),
  error: mkSimpleSelector(microUnits => microUnits.error),
  filters: mkSimpleSelector(microUnits => microUnits.filters),
  sortBy: mkSimpleSelector(microUnits => microUnits.sortBy),
});

// Get all micro units as array
export const allMicroUnitsArray = createSelector(
  [module.simpleSelectors.microUnitsData],
  (microUnitsData) => Object.values(microUnitsData),
);

// Get micro unit by ID
export const getMicroUnitById = (state, microUnitId) => (
  module.simpleSelectors.microUnitsData(state)[microUnitId] || null
);

// Get micro units for a specific course
export const getMicroUnitsByCourseId = (state, courseId) => {
  const groupedByCourse = module.simpleSelectors.groupedByCourse(state);
  const microUnitsData = module.simpleSelectors.microUnitsData(state);
  const microUnitIds = groupedByCourse[courseId] || [];

  return microUnitIds
    .map(id => microUnitsData[id])
    .filter(Boolean);
};

// Filter micro units by search term
const filterBySearch = (microUnits, search) => {
  if (!search || search.trim() === '') {
    return microUnits;
  }
  const searchLower = search.toLowerCase();
  return microUnits.filter(mu => (
    mu.title.toLowerCase().includes(searchLower)
    || (mu.description && mu.description.toLowerCase().includes(searchLower))
  ));
};

// Filter micro units by difficulty
const filterByDifficulty = (microUnits, difficulty) => {
  if (!difficulty || difficulty === '') {
    return microUnits;
  }
  return microUnits.filter(mu => mu.difficulty_level === difficulty);
};

// Filter micro units by active status
const filterByActive = (microUnits, isActive) => {
  if (isActive === null || isActive === undefined) {
    return microUnits;
  }
  return microUnits.filter(mu => mu.is_active === isActive);
};

// Sort micro units
const sortMicroUnits = (microUnits, sortBy) => {
  const sorted = [...microUnits];

  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'duration':
      return sorted.sort((a, b) => (a.estimated_duration || 0) - (b.estimated_duration || 0));
    case 'difficulty':
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      return sorted.sort((a, b) => (
        (difficultyOrder[a.difficulty_level] || 0) - (difficultyOrder[b.difficulty_level] || 0)
      ));
    case 'order':
      return sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
    default:
      return sorted;
  }
};

// Get filtered and sorted micro units
export const filteredAndSortedMicroUnits = createSelector(
  [
    module.allMicroUnitsArray,
    module.simpleSelectors.filters,
    module.simpleSelectors.sortBy,
  ],
  (microUnits, filters, sortBy) => {
    let filtered = microUnits;

    // Apply filters
    filtered = filterBySearch(filtered, filters.search);
    filtered = filterByDifficulty(filtered, filters.difficulty);
    filtered = filterByActive(filtered, filters.isActive);

    // Apply sorting
    return sortMicroUnits(filtered, sortBy);
  },
);

// Get micro units grouped by course with filtering and sorting
export const microUnitsGroupedByCourse = (state, courses = []) => {
  const groupedByCourse = module.simpleSelectors.groupedByCourse(state);
  const microUnitsData = module.simpleSelectors.microUnitsData(state);
  const filters = module.simpleSelectors.filters(state);
  const sortBy = module.simpleSelectors.sortBy(state);

  const result = {};

  courses.forEach(course => {
    const courseId = course.courseRun?.courseId || course.course_id;
    if (!courseId) return;

    const microUnitIds = groupedByCourse[courseId] || [];
    let microUnits = microUnitIds
      .map(id => microUnitsData[id])
      .filter(Boolean);

    // Apply filters
    microUnits = filterBySearch(microUnits, filters.search);
    microUnits = filterByDifficulty(microUnits, filters.difficulty);
    microUnits = filterByActive(microUnits, filters.isActive);

    // Apply sorting
    microUnits = sortMicroUnits(microUnits, sortBy);

    if (microUnits.length > 0) {
      result[courseId] = {
        course,
        microUnits,
        count: microUnits.length,
      };
    }
  });

  return result;
};

// Get total count of micro units
export const totalMicroUnitsCount = createSelector(
  [module.allMicroUnitsArray],
  (microUnits) => microUnits.length,
);

// Get filtered count
export const filteredMicroUnitsCount = createSelector(
  [module.filteredAndSortedMicroUnits],
  (microUnits) => microUnits.length,
);

// Check if has any micro units
export const hasMicroUnits = createSelector(
  [module.totalMicroUnitsCount],
  (count) => count > 0,
);

// Check if has any active micro units
export const hasActiveMicroUnits = createSelector(
  [module.allMicroUnitsArray],
  (microUnits) => microUnits.filter(mu => mu.is_active === true).length > 0,
);

export default simpleSelectors;
