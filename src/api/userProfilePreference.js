// /**
//  * API client for user profile preference endpoints
//  * Follows edX frontend-platform conventions
//  */
// import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
// import { getConfig } from '@edx/frontend-platform';
// import { logError } from '@edx/frontend-platform/logging';

// /**
//  * Build full API URL
//  */
// function getApiUrl(endpoint) {
//   const baseUrl = getConfig().LMS_BASE_URL || process.env.REACT_APP_LMS_API_BASE;
//   return `${baseUrl}${endpoint}`;
// }

// /**
//  * Get authenticated request headers
//  */
// function getHeaders() {
//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   // Add CSRF token for session auth
//   const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value
//     || getCookie('csrftoken');
//   if (csrfToken) {
//     headers['X-CSRFToken'] = csrfToken;
//   }

//   return headers;
// }

// /**
//  * Get CSRF token from cookies
//  */
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }

// /**
//  * Check if user has completed profile preference
//  * @returns {Promise} { hasCompletedProfile: bool, profileData: object }
//  */
// export async function checkUserProfile() {
//   const user = getAuthenticatedUser();
//   if (!user) {
//     logError('User not authenticated when checking profile');
//     throw new Error('User not authenticated');
//   }

//   try {
//     const url = getApiUrl('/api/user-profile-preferences/check/');
//     const response = await fetch(url, {
//       method: 'GET',
//       credentials: 'include',
//       headers: getHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     logError(`Error checking user profile: ${error.message}`);
//     throw error;
//   }
// }

// /**
//  * Save user profile preference
//  * @param {Object} payload - Profile data
//  * @returns {Promise} saved profile data
//  */
// export async function saveUserProfile(payload) {
//   const user = getAuthenticatedUser();
//   if (!user) {
//     logError('User not authenticated when saving profile');
//     throw new Error('User not authenticated');
//   }

//   try {
//     const url = getApiUrl('/api/user-profile-preferences/');
//     const response = await fetch(url, {
//       method: 'POST',
//       credentials: 'include',
//       headers: getHeaders(),
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorBody}`);
//     }

//     return response.json();
//   } catch (error) {
//     logError(`Error saving user profile: ${error.message}`);
//     throw error;
//   }
// }

// /**
//  * Get full user profile preference details
//  * @returns {Promise} full profile data
//  */
// export async function getUserProfile() {
//   const user = getAuthenticatedUser();
//   if (!user) {
//     logError('User not authenticated when fetching profile');
//     throw new Error('User not authenticated');
//   }

//   try {
//     const url = getApiUrl('/api/user-profile-preferences/');
//     const response = await fetch(url, {
//       method: 'GET',
//       credentials: 'include',
//       headers: getHeaders(),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     logError(`Error fetching user profile: ${error.message}`);
//     throw error;
//   }
// }

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Check if user has completed profile preference
 * @returns {Promise<{hasCompletedProfile: boolean, profileData: object|null}>}
 */
export async function checkUserProfile() {
  try {
    const client = getAuthenticatedHttpClient();
    // FIXED: Added /profile/ prefix to match backend URLs
    const response = await client.get(
      `${getConfig().LMS_BASE_URL}/api/user-profile-preferences/profile/check/`
    );
    
    console.log('Profile check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking user profile:', error);
    
    // If API call fails, assume profile not completed
    return {
      hasCompletedProfile: false,
      profileData: null,
    };
  }
}

/**
 * Save user profile preference
 * @param {object} profileData - User profile data
 * @returns {Promise<object>} Saved profile data
 */
export async function saveUserProfile(profileData) {
  try {
    const client = getAuthenticatedHttpClient();
    // FIXED: Added /profile/ prefix to match backend URLs
    const response = await client.post(
      `${getConfig().LMS_BASE_URL}/api/user-profile-preferences/profile/`,
      profileData,
    );
    
    console.log('Profile save response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user profile:', error);
    
    // Parse error details
    let errorMessage = 'Failed to save profile. Please try again.';
    
    if (error.response?.data) {
      const data = error.response.data;
      
      if (data.error) {
        errorMessage = data.error;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.details) {
        // Handle Django validation errors
        errorMessage = Object.entries(data.details)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
      }
    } else if (error.response?.status) {
      errorMessage = `Server error (${error.response.status}): ${error.message}`;
    } else if (error.request) {
      errorMessage = 'Network error: Could not reach server';
    } else {
      errorMessage = error.message || 'Unknown error occurred';
    }
    
    throw new Error(errorMessage);
  }
}

export default {
  checkUserProfile,
  saveUserProfile,
};