import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Get current authenticated user information
 * @returns {Promise<Object>} User data including role information
 */
export const getCurrentUserInfo = async () => {
  try {
    const baseUrl = getConfig().LMS_BASE_URL;
    const apiUrl = `${baseUrl}/api/custom/v1/users/me/`;

    const client = getAuthenticatedHttpClient();
    const response = await client.get(apiUrl);

    if (response.data && response.data.success) {
      const userData = response.data.data;

      // Determine user role
      let role = 'student';
      if (userData.is_superuser) {
        role = 'admin';
      } else if (userData.is_staff) {
        role = 'staff';
      }

      return {
        success: true,
        id: userData.username,
        username: userData.username,
        name: userData.full_name || userData.username,
        email: userData.email,
        role,
        isAdmin: userData.is_superuser,
        isStaff: userData.is_staff || userData.is_superuser,
        isAuthenticated: true,
        profile: userData.profile,
      };
    }

    return {
      success: false,
      isAuthenticated: false,
      error: 'Failed to fetch user data',
    };
  } catch (error) {
    console.error('Error fetching user info:', error);

    // Check if it's an authentication error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return {
        success: false,
        isAuthenticated: false,
        error: 'User not authenticated',
      };
    }

    return {
      success: false,
      isAuthenticated: false,
      error: error.message || 'Unknown error',
    };
  }
};

/**
 * Get user display name with role badge
 * @param {Object} user - User object
 * @returns {string} Display name with role
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Anonymous';

  const roleBadge = {
    admin: '👑',
    staff: '⭐',
    student: '',
  };

  const badge = roleBadge[user.role] || '';
  return badge ? `${badge} ${user.name}` : user.name;
};
