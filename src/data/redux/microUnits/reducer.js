import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const initialState = {
  microUnitsData: {},
  groupedByCourse: {},
  isLoading: false,
  error: null,
  filters: {
    search: '',
    difficulty: '',
    isActive: true, // Only show active micro units by default
  },
  sortBy: 'title',
};

/**
 * Creates a redux slice with actions to load micro units data and manage filters
 */
const microUnits = createSlice({
  name: 'microUnits',
  initialState,
  reducers: {
    loadMicroUnits: (state, { payload: { microUnits: data } }) => {
      const microUnitsData = data.reduce(
        (obj, curr) => ({
          ...obj,
          [curr.id]: curr,
        }),
        {},
      );

      return {
        ...state,
        microUnitsData,
        isLoading: false,
        error: null,
      };
    },

    loadMicroUnitsByCourse: (state, { payload: { courseId, microUnits: data } }) => {
      const existingData = { ...state.microUnitsData };

      data.forEach((microUnit) => {
        existingData[microUnit.id] = microUnit;
      });

      const groupedByCourse = {
        ...state.groupedByCourse,
        [courseId]: data.map(mu => mu.id),
      };

      return {
        ...state,
        microUnitsData: existingData,
        groupedByCourse,
        isLoading: false,
        error: null,
      };
    },

    setLoading: (state, { payload }) => ({
      ...state,
      isLoading: payload,
    }),

    setError: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),

    setFilters: (state, { payload }) => ({
      ...state,
      filters: { ...state.filters, ...payload },
    }),

    setSearch: (state, { payload }) => ({
      ...state,
      filters: { ...state.filters, search: payload },
    }),

    setDifficultyFilter: (state, { payload }) => ({
      ...state,
      filters: { ...state.filters, difficulty: payload },
    }),

    setActiveFilter: (state, { payload }) => ({
      ...state,
      filters: { ...state.filters, isActive: payload },
    }),

    setSortBy: (state, { payload }) => ({
      ...state,
      sortBy: payload,
    }),

    clearFilters: (state) => ({
      ...state,
      filters: {
        search: '',
        difficulty: '',
        isActive: true,
      },
    }),

    resetMicroUnits: () => initialState,
  },
});

const actions = StrictDict(microUnits.actions);

const { reducer } = microUnits;

export {
  actions,
  initialState,
  reducer,
};
