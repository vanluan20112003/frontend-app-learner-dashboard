import React from 'react';
import { getConfig } from '@edx/frontend-platform';

import { reduxHooks } from 'hooks';
import { RequestKeys } from 'data/constants/requests';
import SelectSessionModal from 'containers/SelectSessionModal';
import UserProfileModal from 'containers/UserProfileModal';
import CoursesPanel from 'containers/CoursesPanel';
import DashboardModalSlot from 'plugin-slots/DashboardModalSlot';

import LoadingView from './LoadingView';
import DashboardLayout from './DashboardLayout';
import hooks from './hooks';
import './index.scss';

export const Dashboard = () => {
  hooks.useInitializeDashboard();
  const { pageTitle } = hooks.useDashboardMessages();
  const hasCourses = reduxHooks.useHasCourses();
  const initIsPending = reduxHooks.useRequestIsPending(RequestKeys.initialize);
  const showSelectSessionModal = reduxHooks.useShowSelectSessionModal();
  const userProfileModal = reduxHooks.useUserProfileModalData();
  const closeUserProfileModal = reduxHooks.useCloseUserProfileModal();
  const setUserProfileCompleted = reduxHooks.useSetUserProfileCompleted();

  // State để theo dõi việc đã kiểm tra quyền
  const [hasCheckedPermission, setHasCheckedPermission] = React.useState(false);
  // State để theo dõi modal đã từng được mở chưa
  const [hasModalBeenOpened, setHasModalBeenOpened] = React.useState(false);
  // State để lưu thông tin user và quyền
  const [userPermission, setUserPermission] = React.useState({
    canCreateCourse: false,
    isStaff: false,
    isAdmin: false,
    shouldShowButton: false,
  });

  // const [showThankYou, setShowThankYou] = React.useState(false);
  // State để quản lý user profile preferences
  // const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  // const [profileSubmitError, setProfileSubmitError] = React.useState(null);

  // Check if we should show the user profile modal
  const shouldShowUserProfileModal = !initIsPending
    && userProfileModal.isOpen
    // && !userProfileModal.hasCompletedProfile;

  const handleUserProfileSubmit = (data) => {
    // Here you can send the data to your backend API
    console.log('User profile data submitted:', data);
    // TODO: Send data to backend API
    // api.submitUserProfile(data);

    // Mark profile as completed
    setUserProfileCompleted();

    // setShowThankYou(true)
    // localStorage.setItem('hasSeenProfileModal', 'true');
    // closeUserProfileModal();
  };

  // const handleUserProfileSubmit = async (data) => {
  //   try {
  //     setIsSubmittingProfile(true);
  //     setProfileSubmitError(null);

  //     console.log('Submitting user profile data:', data);

  //     // Call backend API to save profile
  //     await saveUserProfile(data);

  //     console.log('Profile saved successfully');

  //     // Mark profile as completed in Redux
  //     setUserProfileCompleted();
  //     localStorage.setItem('hasSeenProfileModal', 'true');

  //     // Close modal
  //     closeUserProfileModal();
  //   } catch (error) {
  //     console.error('Error saving profile:', error);
  //     setProfileSubmitError(error.message);
  //     // Modal stays open so user can retry
  //   } finally {
  //     setIsSubmittingProfile(false);
  //   }
  // };

  const handleUserProfileClose = () => {
    // setShowThankYou(false);
    closeUserProfileModal();
    // localStorage.setItem('hasSeenProfileModal', 'true');
  };

  // Track khi modal được mở
  React.useEffect(() => {
    if (userProfileModal.isOpen && !hasModalBeenOpened) {
      setHasModalBeenOpened(true);
    }
  }, [userProfileModal.isOpen, hasModalBeenOpened]);

  // Kiểm tra quyền tạo khóa học sau khi modal đóng hoặc không cần hiện
  React.useEffect(() => {
    // Chỉ chạy khi:
    // 1. Modal không còn mở
    // 2. Chưa kiểm tra quyền
    // 3. Đã hoàn thành initialization
    // 4. Modal đã từng được mở (user đã đóng) HOẶC profile đã complete (không cần mở modal)
    const shouldCheckPermission = !userProfileModal.isOpen
      && !hasCheckedPermission
      && !initIsPending
      && (hasModalBeenOpened || userProfileModal.hasCompletedProfile);

    if (!shouldCheckPermission) {
      return;
    }

    const checkPermissionAndRedirect = async () => {
      try {
        const lmsBaseUrl = getConfig().LMS_BASE_URL;
        const studioBaseUrl = getConfig().STUDIO_BASE_URL;

        console.log('LMS URL:', lmsBaseUrl);
        console.log('Studio URL:', studioBaseUrl);

        // Bước 1: Kiểm tra user role từ API /me
        let userRole = { isStaff: false, isAdmin: false };
        try {
          const userResponse = await fetch(`${lmsBaseUrl}/api/custom/v1/users/me/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.success && userData.data) {
              userRole = {
                isStaff: userData.data.is_staff || false,
                isAdmin: userData.data.is_superuser || false,
              };
              console.log('User role:', userRole);
            }
          }
        } catch (error) {
          console.warn('Failed to fetch user role:', error);
        }

        // Bước 2: Kiểm tra quyền tạo course
        const response = await fetch(`${lmsBaseUrl}/api/check-course-permission/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Nếu có quyền tạo course (can_create_course = 1)
          if (data.can_create_course === 1) {
            // Logic mới: Kiểm tra role
            if (userRole.isStaff || userRole.isAdmin) {
              // Admin/Staff: Hiện nút thay vì redirect tự động
              console.log('Admin/Staff với quyền tạo course - Hiển thị nút');
              setUserPermission({
                canCreateCourse: true,
                isStaff: userRole.isStaff,
                isAdmin: userRole.isAdmin,
                shouldShowButton: true,
              });
            } else {
              // User thường có quyền: Redirect ngay
              const redirectUrl = studioBaseUrl;
              console.log('User thường có quyền - Redirecting to studio:', redirectUrl);
              window.location.href = redirectUrl;
              return;
            }
          }
        } else {
          console.warn('Permission check failed:', response.status, response.statusText);
        }

        // Đánh dấu đã kiểm tra quyền
        setHasCheckedPermission(true);
      } catch (error) {
        console.error('Error checking course permission:', error);
        setHasCheckedPermission(true);
      }
    };

    checkPermissionAndRedirect();
  }, [
    userProfileModal.isOpen,
    userProfileModal.hasCompletedProfile,
    hasCheckedPermission,
    hasModalBeenOpened,
    initIsPending,
  ]);

  return (
    <div id="dashboard-container" className="d-flex flex-column p-2 pt-0">
      <h1 className="sr-only">{pageTitle}</h1>
      {!initIsPending && (
        <>
          <DashboardModalSlot />
          {(hasCourses && showSelectSessionModal) && <SelectSessionModal />}
          {shouldShowUserProfileModal && (
            <UserProfileModal
              isOpen={userProfileModal.isOpen}
              onClose={handleUserProfileClose}
              onSubmit={handleUserProfileSubmit}
              // showThankYou={showThankYou}
              // isLoading={isSubmittingProfile}
              // error={profileSubmitError}
            />
          )}
        </>
      )}
      <div id="dashboard-content" data-testid="dashboard-content">
        {initIsPending
          ? (<LoadingView />)
          : (
            <DashboardLayout>
              <CoursesPanel userPermission={userPermission} />
            </DashboardLayout>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
