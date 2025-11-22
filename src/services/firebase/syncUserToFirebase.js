import { getFirebaseDatabase } from './config';

/**
 * Sync current user info to Firebase Realtime Database
 * This creates/updates the users/{uid} node that Firebase Rules check
 *
 * @param {Object} userInfo - User info from getCurrentUserInfo
 */
export const syncUserToFirebase = async (userInfo) => {
  try {
    if (!userInfo || !userInfo.isAuthenticated) {
      console.log('[syncUserToFirebase] User not authenticated, skipping sync');
      return;
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      console.error('[syncUserToFirebase] Firebase not initialized');
      return;
    }

    // Get Firebase Auth user
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      console.log('[syncUserToFirebase] No Firebase Auth user found');
      return;
    }

    const { ref, set } = await import('firebase/database');
    const userRef = ref(database, `users/${firebaseUser.uid}`);

    // Sync user data to Firebase
    await set(userRef, {
      isStaff: userInfo.isStaff || false,
      isAdmin: userInfo.isAdmin || false,
      username: userInfo.username || '',
      name: userInfo.name || '',
      lastSync: new Date().toISOString(),
    });

    console.log(`[syncUserToFirebase] User ${firebaseUser.uid} synced successfully`);
  } catch (error) {
    console.error('[syncUserToFirebase] Error syncing user:', error);
  }
};
