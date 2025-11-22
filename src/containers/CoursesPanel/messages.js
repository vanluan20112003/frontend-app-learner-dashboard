import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  myCourses: {
    id: 'dashboard.mycourses',
    defaultMessage: 'My Courses',
    description: 'Course list heading',
  },
  searchCourses: {
    id: 'dashboard.searchCourses',
    defaultMessage: 'Search courses...',
    description: 'Placeholder for course search input',
  },
  noSearchResults: {
    id: 'dashboard.noSearchResults',
    defaultMessage: 'No courses found matching "{query}"',
    description: 'Message when search returns no results',
  },
});

export default messages;
