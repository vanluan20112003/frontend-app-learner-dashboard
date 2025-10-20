import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';

import ConfirmEmailBanner from './ConfirmEmailBanner';
import LanguageSelector from './LanguageSelector';

import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';

import './index.scss';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });

  return (
    <>
      <ConfirmEmailBanner />
      <div style={{ position: 'relative' }}>
        <Header
          mainMenuItems={learnerHomeHeaderMenu.mainMenu}
          secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
          userMenuItems={learnerHomeHeaderMenu.userMenu}
        />
        <div className="language-selector-in-header">
          <LanguageSelector />
        </div>
      </div>
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
