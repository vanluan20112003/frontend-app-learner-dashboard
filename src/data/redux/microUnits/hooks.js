import { useSelector, useDispatch } from 'react-redux';

import * as selectors from './selectors';
import { actions } from './reducer';

// Data selectors
export const useMicroUnitsData = () => useSelector(selectors.simpleSelectors.microUnitsData);

export const useAllMicroUnitsArray = () => useSelector(selectors.allMicroUnitsArray);

export const useGroupedByCourse = () => useSelector(selectors.simpleSelectors.groupedByCourse);

export const useIsLoading = () => useSelector(selectors.simpleSelectors.isLoading);

export const useError = () => useSelector(selectors.simpleSelectors.error);

export const useFilters = () => useSelector(selectors.simpleSelectors.filters);

export const useSortBy = () => useSelector(selectors.simpleSelectors.sortBy);

export const useFilteredAndSortedMicroUnits = () => useSelector(
  selectors.filteredAndSortedMicroUnits,
);

export const useMicroUnitsGroupedByCourse = (courses) => useSelector(
  (state) => selectors.microUnitsGroupedByCourse(state, courses),
);

export const useTotalMicroUnitsCount = () => useSelector(selectors.totalMicroUnitsCount);

export const useFilteredMicroUnitsCount = () => useSelector(selectors.filteredMicroUnitsCount);

export const useHasMicroUnits = () => useSelector(selectors.hasMicroUnits);

export const useHasActiveMicroUnits = () => useSelector(selectors.hasActiveMicroUnits);

export const useMicroUnitById = (microUnitId) => useSelector(
  (state) => selectors.getMicroUnitById(state, microUnitId),
);

export const useMicroUnitsByCourseId = (courseId) => useSelector(
  (state) => selectors.getMicroUnitsByCourseId(state, courseId),
);

// Action dispatchers
export const useLoadMicroUnits = () => {
  const dispatch = useDispatch();
  return (microUnits) => dispatch(actions.loadMicroUnits({ microUnits }));
};

export const useLoadMicroUnitsByCourse = () => {
  const dispatch = useDispatch();
  return (courseId, microUnits) => dispatch(
    actions.loadMicroUnitsByCourse({ courseId, microUnits }),
  );
};

export const useSetLoading = () => {
  const dispatch = useDispatch();
  return (isLoading) => dispatch(actions.setLoading(isLoading));
};

export const useSetError = () => {
  const dispatch = useDispatch();
  return (error) => dispatch(actions.setError(error));
};

export const useSetFilters = () => {
  const dispatch = useDispatch();
  return (filters) => dispatch(actions.setFilters(filters));
};

export const useSetSearch = () => {
  const dispatch = useDispatch();
  return (search) => dispatch(actions.setSearch(search));
};

export const useSetDifficultyFilter = () => {
  const dispatch = useDispatch();
  return (difficulty) => dispatch(actions.setDifficultyFilter(difficulty));
};

export const useSetActiveFilter = () => {
  const dispatch = useDispatch();
  return (isActive) => dispatch(actions.setActiveFilter(isActive));
};

export const useSetSortBy = () => {
  const dispatch = useDispatch();
  return (sortBy) => dispatch(actions.setSortBy(sortBy));
};

export const useClearFilters = () => {
  const dispatch = useDispatch();
  return () => dispatch(actions.clearFilters());
};

export const useResetMicroUnits = () => {
  const dispatch = useDispatch();
  return () => dispatch(actions.resetMicroUnits());
};
