import { getConfig } from '@edx/frontend-platform';

import urls from 'data/services/lms/urls';

import messages from './messages';

const getLearnerHeaderMenu = (
  formatMessage,
  courseSearchUrl,
  authenticatedUser,
  exploreCoursesClick,
) => {
  // Check current path to set active state
  const currentPath = window.location.pathname;
  const isMicroUnitPage = currentPath.includes('/learner-dashboard/micro-unit');
  const isCoursesPage = currentPath === '/learner-dashboard/' || currentPath === '/' || (!isMicroUnitPage && !currentPath.includes('/dashboard/programs'));

  return {
    mainMenu: [
      {
        type: 'item',
        href: '/learner-dashboard/',
        content: formatMessage(messages.course),
        isActive: isCoursesPage,
      },
      ...(getConfig().ENABLE_PROGRAMS ? [{
        type: 'item',
        href: `${urls.programsUrl()}`,
        content: formatMessage(messages.program),
      }] : []),
      {
        type: 'item',
        href: `${urls.baseAppUrl(courseSearchUrl)}`,
        content: formatMessage(messages.discoverNew),
        onClick: (e) => {
          exploreCoursesClick(e);
        },
      },
      {
        type: 'item',
        href: '/learner-dashboard/micro-unit',
        content: formatMessage(messages.microUnit),
        isActive: isMicroUnitPage,
      },
    ],
    secondaryMenu: [
      ...(getConfig().SUPPORT_URL ? [{
        type: 'item',
        href: `${getConfig().SUPPORT_URL}`,
        content: formatMessage(messages.help),
      }] : []),
    ],
    userMenu: [
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser?.username}`,
            content: formatMessage(messages.profile),
          },
          {
            type: 'item',
            href: `${getConfig().ACCOUNT_SETTINGS_URL}`,
            content: formatMessage(messages.account),
          },
          ...(getConfig().ORDER_HISTORY_URL ? [{
            type: 'item',
            href: getConfig().ORDER_HISTORY_URL,
            content: formatMessage(messages.orderHistory),
          }] : []),
        ],
      },
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: `${getConfig().LOGOUT_URL}`,
            content: formatMessage(messages.signOut),
          },
        ],
      },
    ],
  };
};

export default getLearnerHeaderMenu;
