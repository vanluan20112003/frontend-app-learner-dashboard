import React from 'react';
import { useWindowSize, breakpoints } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { apiHooks, reduxHooks } from 'hooks';
import { StrictDict } from 'utils';
import { checkUserProfile } from '../../api/userProfilePreference';

import appMessages from 'messages';
import * as module from './hooks';

export const state = StrictDict({
  sidebarShowing: (val) => React.useState(val), // eslint-disable-line
});

export const useInitializeDashboard = () => {
  const initialize = apiHooks.useInitializeApp();
  const openUserProfileModal = reduxHooks.useOpenUserProfileModal();
  const userProfileModal = reduxHooks.useUserProfileModalData();
  const setUserProfileCompleted = reduxHooks.useSetUserProfileCompleted();

  React.useEffect(() => {
    initialize();
  }, []); // eslint-disable-line

  // Auto-open user profile modal on first visit
  // React.useEffect(() => {
  //   // Check if user has not completed profile yet
  //   // You can also check localStorage or user settings from API
  //   const hasSeenProfileModal = localStorage.getItem('hasSeenProfileModal');

  //   if (!hasSeenProfileModal && !userProfileModal.hasCompletedProfile) {
  //     // Wait a bit for the dashboard to load
  //     const timer = setTimeout(() => {
  //       openUserProfileModal();
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   }
  //   return undefined;
  // }, []); // eslint-disable-line
  React.useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const checkAndOpenModal = async () => {
      try {
        console.log('Checking user profile completion status...');
        const data = await checkUserProfile();
        
        if (!mounted) return;

        console.log('Profile check result:', data);

        if (data.hasCompletedProfile) {
          // User already completed profile - sync Redux state
          console.log('Profile already completed, updating Redux state');
          setUserProfileCompleted();
        } else if (!userProfileModal.isOpen) {
          // Profile not completed and modal not already open
          console.log('Profile not completed, opening modal');
          timeoutId = setTimeout(() => {
            if (mounted) {
              openUserProfileModal();
            }
          }, 500);
        }
      } catch (err) {
        console.error('Profile check error:', err);
        // On error, show modal to ensure user can set profile
        if (mounted && !userProfileModal.isOpen) {
          console.log('Error during check, opening modal anyway');
          timeoutId = setTimeout(() => {
            if (mounted) {
              openUserProfileModal();
            }
          }, 500);
        }
      }
    };

    checkAndOpenModal();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // FIXED: Empty deps to prevent infinite loop
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

// Unused func, consider later
/**
 * Hook to manage user profile modal state and submission
 * Checks on mount if user completed profile; shows modal if not
 */
// export function useUserProfileModal() {
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [loadingCheck, setLoadingCheck] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         const data = await checkUserProfile();
        
//         if (mounted) {
//           // Show modal only if profile not completed
//           if (data.hasCompletedProfile === false) {
//             setShowProfileModal(true);
//           }
//           setError(null);
//         }
//       } catch (err) {
//         if (mounted) {
//           console.error('Profile check error:', err);
//           setError(err.message);
//           // Optionally show modal on error to ensure user sets profile
//           // setShowProfileModal(true);
//         }
//       } finally {
//         if (mounted) {
//           setLoadingCheck(false);
//         }
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const submitProfile = async (formData) => {
//     try {
//       // Backend expects camelCase field names that match serializer
//       const payload = {
//         userType: formData.userType,
//         gender: formData.gender || null,
//         ageGroup: formData.ageGroup || null,
//         school: formData.school || null,
//         faculty: formData.faculty || null,
//         major: formData.major || null,
//         educationLevel: formData.educationLevel || null,
//         academicYear: formData.academicYear || null,
//         gpa: formData.gpa || null,
//         fieldsOfInterest: formData.fieldsOfInterest || [],
//         previousCourses: formData.previousCourses || null,
//         studentGoals: formData.studentGoals || [],
//         currentJob: formData.currentJob || null,
//         professionalField: formData.professionalField || null,
//         professionalGoals: formData.professionalGoals || [],
//         teachingSubject: formData.teachingSubject || null,
//         teachingSchool: formData.teachingSchool || null,
//       };

//       await saveUserProfile(payload);
//       setShowProfileModal(false);
//       setError(null);
//     } catch (err) {
//       console.error('Profile submit error:', err);
//       setError(err.message);
//       // Don't close modal on error so user can retry
//     }
//   };

//   return {
//     showProfileModal,
//     setShowProfileModal,
//     submitProfile,
//     loadingCheck,
//     error,
//   };
// }

export default {
  useDashboardLayoutData,
  useInitializeDashboard,
  useDashboardMessages,
};
