import React from 'react';
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

  const handleGoToStudio = () => {
    const studioBaseUrl = getConfig().STUDIO_BASE_URL;
    window.location.href = studioBaseUrl;
  };

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
      {hasCourses ? <CourseListSlot courseListData={courseListData} /> : <NoCoursesViewSlot />}
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
