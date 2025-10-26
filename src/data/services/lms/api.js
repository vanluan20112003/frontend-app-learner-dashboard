import eventNames from 'tracking/constants';
import {
  client,
  get,
  post,
  stringifyUrl,
} from './utils';
import {
  apiKeys,
  unenrollmentAction,
  enableEmailsAction,
} from './constants';
import urls from './urls';
import * as module from './api';

/*********************************************************************************
 * GET Actions
 *********************************************************************************/
export const initializeList = ({ user } = {}) => get(
  stringifyUrl(urls.getInitApiUrl(), { [apiKeys.user]: user }),
);

export const updateEntitlementEnrollment = ({ uuid, courseId }) => post(
  urls.entitlementEnrollment(uuid),
  { [apiKeys.courseRunId]: courseId },
);

export const deleteEntitlementEnrollment = ({ uuid, isRefundable }) => client()
  .delete(
    stringifyUrl(
      urls.entitlementEnrollment(uuid),
      { [apiKeys.isRefund]: isRefundable },
    ),
  );

export const updateEmailSettings = ({ courseId, enable }) => post(
  urls.updateEmailSettings(),
  { [apiKeys.courseId]: courseId, ...(enable && enableEmailsAction) },
);

export const unenrollFromCourse = ({ courseId }) => post(
  urls.courseUnenroll(),
  { [apiKeys.courseId]: courseId, ...unenrollmentAction },
);

export const logEvent = ({ eventName, data, courseId }) => post(urls.event(), {
  courserun_key: courseId,
  event_type: eventName,
  page: window.location.href,
  event: JSON.stringify(data),
});

export const logShare = ({ courseId, site }) => module.logEvent({
  eventName: eventNames.shareClicked,
  courseId,
  data: {
    course_id: courseId,
    social_media_site: site,
    location: 'dashboard',
  },
});

export const createCreditRequest = ({ providerId, courseId, username }) => post(
  urls.creditRequestUrl(providerId),
  { course_key: courseId, username },
);

/*********************************************************************************
 * Micro Unit API Actions
 *********************************************************************************/

/**
 * Fetch all micro units with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.difficulty - Filter by difficulty (easy, medium, hard)
 * @param {boolean} params.isActive - Filter by active status
 * @param {string} params.search - Search in title and description
 */
export const fetchMicroUnits = ({ difficulty, isActive, search } = {}) => {
  const params = {};
  if (difficulty) params.difficulty = difficulty;
  if (isActive !== undefined && isActive !== null) params.is_active = isActive;
  if (search) params.search = search;

  return get(stringifyUrl(urls.microUnitsList(), params));
};

/**
 * Fetch a single micro unit detail by ID
 * @param {number} microUnitId - The micro unit ID
 */
export const fetchMicroUnitDetail = (microUnitId) => get(
  urls.microUnitDetail(microUnitId),
);

/**
 * Fetch all blocks/units for a micro unit
 * @param {number} microUnitId - The micro unit ID
 */
export const fetchMicroUnitBlocks = (microUnitId) => get(
  urls.microUnitBlocks(microUnitId),
);

/**
 * Fetch all micro units for a specific course
 * @param {string} courseId - The course ID (e.g., course-v1:edX+DemoX+Demo_Course)
 */
export const fetchCourseMicroUnits = (courseId) => get(
  urls.courseMicroUnits(courseId),
);

/**
 * Fetch all units/verticals for a course
 * @param {string} courseId - The course ID
 */
export const fetchCourseUnits = (courseId) => get(
  urls.courseUnits(courseId),
);

export default {
  initializeList,
  unenrollFromCourse,
  updateEmailSettings,
  updateEntitlementEnrollment,
  deleteEntitlementEnrollment,
  logEvent,
  logShare,
  createCreditRequest,
  fetchMicroUnits,
  fetchMicroUnitDetail,
  fetchMicroUnitBlocks,
  fetchCourseMicroUnits,
  fetchCourseUnits,
};
