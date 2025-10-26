import { StrictDict } from 'utils';

import { getConfig } from '@edx/frontend-platform';

export const getEcommerceUrl = () => getConfig().ECOMMERCE_BASE_URL;

const getBaseUrl = () => getConfig().LMS_BASE_URL;

export const getApiUrl = () => (`${getConfig().LMS_BASE_URL}/api`);

const getInitApiUrl = () => (`${getApiUrl()}/learner_home/init`);

const event = () => `${getBaseUrl()}/event`;
const courseUnenroll = () => `${getBaseUrl()}/change_enrollment`;
const updateEmailSettings = () => `${getApiUrl()}/change_email_settings`;
const entitlementEnrollment = (uuid) => `${getApiUrl()}/entitlements/v1/entitlements/${uuid}/enrollments`;

// if url is null or absolute, return it as is
export const updateUrl = (base, url) => ((url == null || url.startsWith('http://') || url.startsWith('https://')) ? url : `${base}${url}`);

export const baseAppUrl = (url) => updateUrl(getBaseUrl(), url);
export const learningMfeUrl = (url) => updateUrl(getConfig().LEARNING_BASE_URL, url);

// static view url
const programsUrl = () => baseAppUrl('/dashboard/programs');

// micro unit urls
const microUnitsApiUrl = () => `${getApiUrl()}/micro_unit/v1`;
const microUnitsList = () => `${microUnitsApiUrl()}/micro-units/`;
const microUnitDetail = (microUnitId) => `${microUnitsApiUrl()}/micro-units/${microUnitId}/`;
const microUnitBlocks = (microUnitId) => `${microUnitsApiUrl()}/micro-units/${microUnitId}/blocks/`;
const courseMicroUnits = (courseId) => `${microUnitsApiUrl()}/courses/${courseId}/micro-units/`;
const courseUnits = (courseId) => `${microUnitsApiUrl()}/units/${courseId}`;

export const creditPurchaseUrl = (courseId) => `${getEcommerceUrl()}/credit/checkout/${courseId}/`;
export const creditRequestUrl = (providerId) => `${getApiUrl()}/credit/v1/providers/${providerId}/request/`;

export default StrictDict({
  getApiUrl,
  baseAppUrl,
  courseUnenroll,
  courseMicroUnits,
  courseUnits,
  creditPurchaseUrl,
  creditRequestUrl,
  entitlementEnrollment,
  event,
  getInitApiUrl,
  learningMfeUrl,
  microUnitsApiUrl,
  microUnitsList,
  microUnitDetail,
  microUnitBlocks,
  programsUrl,
  updateEmailSettings,
});
