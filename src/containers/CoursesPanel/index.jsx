import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Button } from '@openedx/paragon';
import { Add } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';
import {
  CourseFilterControls,
} from 'containers/CourseFilterControls';
import CourseListSlot from 'plugin-slots/CourseListSlot';
import NoCoursesViewSlot from 'plugin-slots/NoCoursesViewSlot';
import CourseSearchBar from './CourseSearchBar';

import { useCourseListData } from './hooks';

import messages from './messages';

import './index.scss';

/**
 * Renders the list of CourseCards, as well as the controls (CourseFilterControls) for modifying the list.
 * Also houses the NoCoursesView to display if the user hasn't enrolled in any courses.
 * @returns List of courses as CourseCards or empty state
*/
export const CoursesPanel = ({ userPermission }) => {
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const courseListData = useCourseListData();
  const [searchQuery, setSearchQuery] = useState('');

  const handleGoToStudio = () => {
    const studioBaseUrl = getConfig().STUDIO_BASE_URL;
    window.location.href = studioBaseUrl;
  };

  // Helper function to normalize Vietnamese text for search
  const normalizeVietnamese = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd');
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter courses based on search query
  const filteredCourseListData = useMemo(() => {
    if (!searchQuery || !courseListData.courses) {
      return courseListData;
    }

    const filteredCourses = courseListData.courses.filter((course) => {
      // Original searchable text with diacritics
      const searchableText = [
        course.title,
        course.courseId,
        course.org,
        course.number,
      ].filter(Boolean).join(' ').toLowerCase();

      // Normalized searchable text (without diacritics) for Vietnamese support
      const normalizedSearchableText = normalizeVietnamese(searchableText);
      const normalizedQuery = normalizeVietnamese(searchQuery);

      // Match against both original (with diacritics) and normalized (without diacritics)
      // This allows users to search with or without Vietnamese diacritics
      return searchableText.includes(searchQuery) ||
             normalizedSearchableText.includes(normalizedQuery);
    });

    return {
      ...courseListData,
      courses: filteredCourses,
      numPages: Math.ceil(filteredCourses.length / (courseListData.pageSize || 1)),
    };
  }, [courseListData, searchQuery]);

  // Check if we have filtered courses or original courses
  const hasFilteredCourses = searchQuery
    ? (filteredCourseListData.courses && filteredCourseListData.courses.length > 0)
    : true;

  return (
    <div className="course-list-container">
      <div className="course-list-heading-container">
        <h2 className="course-list-title">{formatMessage(messages.myCourses)}</h2>
        <div className="course-filter-controls-container">
          {userPermission?.shouldShowButton && (
            <Button
              variant="primary"
              size="sm"
              iconBefore={Add}
              onClick={handleGoToStudio}
              className="mr-2"
            >
              Go to Studio
            </Button>
          )}
          <CourseFilterControls {...courseListData.filterOptions} />
        </div>
      </div>

      {/* Course Search Bar */}
      {/* {hasCourses && (
        <div className="course-search-container mb-3">
          <CourseSearchBar onSearch={handleSearch} />
        </div>
      )} */}

      {/* Show filtered results or no courses view */}
      {hasCourses ? (
        hasFilteredCourses ? (
          <CourseListSlot courseListData={filteredCourseListData} />
        ) : (
          <div className="no-search-results">
            <p>{formatMessage(messages.noSearchResults, { query: searchQuery })}</p>
          </div>
        )
      ) : (
        <NoCoursesViewSlot />
      )}
    </div>
  );
};

CoursesPanel.propTypes = {
  userPermission: PropTypes.shape({
    canCreateCourse: PropTypes.bool,
    isStaff: PropTypes.bool,
    isAdmin: PropTypes.bool,
    shouldShowButton: PropTypes.bool,
  }),
};

CoursesPanel.defaultProps = {
  userPermission: {
    canCreateCourse: false,
    isStaff: false,
    isAdmin: false,
    shouldShowButton: false,
  },
};

export default CoursesPanel;
