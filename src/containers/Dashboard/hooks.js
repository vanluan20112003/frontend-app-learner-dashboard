import React from 'react';
import { useWindowSize, breakpoints } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { apiHooks, reduxHooks } from 'hooks';
import { StrictDict } from 'utils';

import appMessages from 'messages';
import * as module from './hooks';

export const state = StrictDict({
  sidebarShowing: (val) => React.useState(val), // eslint-disable-line
});

export const useInitializeDashboard = () => {
  const initialize = apiHooks.useInitializeApp();
  const openUserProfileModal = reduxHooks.useOpenUserProfileModal();
  const userProfileModal = reduxHooks.useUserProfileModalData();

  React.useEffect(() => {
    initialize();
  }, []); // eslint-disable-line

  // Auto-open user profile modal on first visit
  React.useEffect(() => {
    // Check if user has not completed profile yet
    // You can also check localStorage or user settings from API
    const hasSeenProfileModal = localStorage.getItem('hasSeenProfileModal');

    if (!hasSeenProfileModal && !userProfileModal.hasCompletedProfile) {
      // Wait a bit for the dashboard to load
      const timer = setTimeout(() => {
        openUserProfileModal();
      }, 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, []); // eslint-disable-line
};

export const useDashboardMessages = () => {
  const { formatMessage } = useIntl();
  return {
    spinnerScreenReaderText: formatMessage(appMessages.loadingSR),
    pageTitle: formatMessage(appMessages.pageTitle),
  };
};

export const useDashboardLayoutData = () => {
  const { width } = useWindowSize();

  const [sidebarShowing, setSidebarShowing] = module.state.sidebarShowing(true);
  return {
    isDashboardCollapsed: width < breakpoints.large.maxWidth,
    sidebarShowing,
    setSidebarShowing,
  };
};

export default {
  useDashboardLayoutData,
  useInitializeDashboard,
  useDashboardMessages,
};
