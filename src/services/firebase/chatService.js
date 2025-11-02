import { getFirebaseDatabase } from './config';

/**
 * Send a message to the general chat
 * @param {string} message - The message text
 * @param {Object} user - User object with name, id, and role
 * @returns {Promise} - Promise that resolves when message is sent
 */
export const sendMessage = async (message, user) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    // Check if user is blocked
    const userId = user.id || user.username || 'guest';
    const blocked = await isUserBlocked(userId);
    if (blocked) {
      return { success: false, error: 'You have been blocked from the chat' };
    }

    const { ref, push, serverTimestamp } = await import('firebase/database');
    const messagesRef = ref(database, 'generalChat/messages');

    const newMessage = {
      text: message,
      userName: user.name || 'Anonymous',
      userId,
      userRole: user.role || 'student',
      isStaff: user.isStaff || false,
      isAdmin: user.isAdmin || false,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    };

    await push(messagesRef, newMessage);
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error };
  }
};

/**
 * Delete a message (users can delete own messages, admin/staff can delete any)
 * @param {string} messageId - Message ID to delete
 * @param {Object} user - User attempting to delete
 * @param {string} messageOwnerId - ID of the message owner
 * @returns {Promise} - Promise that resolves when message is deleted
 */
export const deleteMessage = async (messageId, user, messageOwnerId = null) => {
  try {
    // Check permissions: admin/staff can delete any, users can delete their own
    const isOwnMessage = messageOwnerId && (messageOwnerId === user.id || messageOwnerId === user.username);
    const hasPermission = user.isStaff || user.isAdmin || isOwnMessage;

    if (!hasPermission) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, remove } = await import('firebase/database');
    const messageRef = ref(database, `generalChat/messages/${messageId}`);

    await remove(messageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error };
  }
};

/**
 * Listen to chat messages in real-time
 * @param {function} callback - Callback function to handle new messages
 * @param {number} limit - Number of recent messages to fetch
 * @returns {Promise<function>} - Promise that resolves to unsubscribe function
 */
export const subscribeToMessages = async (callback, limit = 50) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      callback([]);
      return () => {};
    }

    const { ref, onValue, off, query, orderByChild, limitToLast } = await import('firebase/database');

    const messagesRef = ref(database, 'generalChat/messages');
    const messagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      limitToLast(limit)
    );

    const handleMessages = (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      // Sort messages by timestamp (oldest first)
      messages.sort((a, b) => {
        const timeA = a.timestamp || new Date(a.createdAt).getTime();
        const timeB = b.timestamp || new Date(b.createdAt).getTime();
        return timeA - timeB;
      });

      callback(messages);
    };

    const handleError = (error) => {
      console.error('Error subscribing to messages:', error);
      callback([]);
    };

    onValue(messagesQuery, handleMessages, handleError);

    // Return unsubscribe function
    return () => off(messagesQuery, 'value', handleMessages);
  } catch (error) {
    console.error('Error setting up message subscription:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Block a user and delete all their messages (admin/staff only)
 * @param {string} userId - User ID to block
 * @param {Object} user - User attempting to block
 * @returns {Promise} - Promise that resolves when user is blocked
 */
export const blockUser = async (userId, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, set, get, remove, query, orderByChild, equalTo } = await import('firebase/database');

    // Add user to blocked list
    const blockedRef = ref(database, `generalChat/blockedUsers/${userId}`);
    await set(blockedRef, {
      blockedAt: new Date().toISOString(),
      blockedBy: user.id || user.username,
      blockedByName: user.name,
    });

    // Delete all messages from this user
    const messagesRef = ref(database, 'generalChat/messages');
    const userMessagesQuery = query(messagesRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userMessagesQuery);

    if (snapshot.exists()) {
      const deletePromises = [];
      snapshot.forEach((childSnapshot) => {
        const messageRef = ref(database, `generalChat/messages/${childSnapshot.key}`);
        deletePromises.push(remove(messageRef));
      });
      await Promise.all(deletePromises);
    }

    return { success: true };
  } catch (error) {
    console.error('Error blocking user:', error);
    return { success: false, error };
  }
};

/**
 * Unblock a user (admin/staff only)
 * @param {string} userId - User ID to unblock
 * @param {Object} user - User attempting to unblock
 * @returns {Promise} - Promise that resolves when user is unblocked
 */
export const unblockUser = async (userId, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, remove } = await import('firebase/database');
    const blockedRef = ref(database, `generalChat/blockedUsers/${userId}`);

    await remove(blockedRef);
    return { success: true };
  } catch (error) {
    console.error('Error unblocking user:', error);
    return { success: false, error };
  }
};

/**
 * Check if a user is blocked
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} - True if user is blocked
 */
export const isUserBlocked = async (userId) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      return false;
    }

    const { ref, get } = await import('firebase/database');
    const blockedRef = ref(database, `generalChat/blockedUsers/${userId}`);
    const snapshot = await get(blockedRef);

    return snapshot.exists();
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    return false;
  }
};

/**
 * Get list of blocked users (admin/staff only)
 * @returns {Promise<Array>} - Array of blocked user IDs
 */
export const getBlockedUsers = async () => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      return [];
    }

    const { ref, get } = await import('firebase/database');
    const blockedRef = ref(database, 'generalChat/blockedUsers');
    const snapshot = await get(blockedRef);

    const blockedUsers = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        blockedUsers.push({
          userId: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
    }

    return blockedUsers;
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }
};

/**
 * Pin a message to the top (admin/staff only)
 * @param {string} messageId - Message ID to pin
 * @param {Object} messageData - Message data
 * @param {Object} user - User attempting to pin
 * @returns {Promise} - Promise that resolves when message is pinned
 */
export const pinMessage = async (messageId, messageData, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, set, serverTimestamp } = await import('firebase/database');
    const pinnedRef = ref(database, 'generalChat/pinnedMessage');

    await set(pinnedRef, {
      messageId,
      text: messageData.text,
      userName: messageData.userName,
      userId: messageData.userId,
      isAdmin: messageData.isAdmin,
      isStaff: messageData.isStaff,
      pinnedAt: serverTimestamp(),
      pinnedBy: user.id || user.username,
      pinnedByName: user.name,
    });

    return { success: true };
  } catch (error) {
    console.error('Error pinning message:', error);
    return { success: false, error };
  }
};

/**
 * Unpin the current pinned message (admin/staff only)
 * @param {Object} user - User attempting to unpin
 * @returns {Promise} - Promise that resolves when message is unpinned
 */
export const unpinMessage = async (user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, remove } = await import('firebase/database');
    const pinnedRef = ref(database, 'generalChat/pinnedMessage');

    await remove(pinnedRef);
    return { success: true };
  } catch (error) {
    console.error('Error unpinning message:', error);
    return { success: false, error };
  }
};

/**
 * Subscribe to pinned message updates
 * @param {function} callback - Callback function to handle pinned message
 * @returns {Promise<function>} - Promise that resolves to unsubscribe function
 */
export const subscribeToPinnedMessage = async (callback) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      callback(null);
      return () => {};
    }

    const { ref, onValue, off } = await import('firebase/database');
    const pinnedRef = ref(database, 'generalChat/pinnedMessage');

    const handlePinnedMessage = (snapshot) => {
      if (snapshot.exists()) {
        callback({
          id: snapshot.key,
          ...snapshot.val(),
        });
      } else {
        callback(null);
      }
    };

    onValue(pinnedRef, handlePinnedMessage);

    return () => off(pinnedRef, 'value', handlePinnedMessage);
  } catch (error) {
    console.error('Error subscribing to pinned message:', error);
    callback(null);
    return () => {};
  }
};

/**
 * Get user info from the current session
 * This is a placeholder - you should integrate with your actual user service
 * @returns {object} - User information
 */
export const getCurrentUser = () => {
  // TODO: Integrate with your actual authentication service
  // For now, we'll use a simple localStorage-based approach
  let user = localStorage.getItem('chatUser');

  if (!user) {
    // Generate a random guest ID
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    const guestName = `Guest ${Math.floor(Math.random() * 1000)}`;
    user = JSON.stringify({ id: guestId, name: guestName });
    localStorage.setItem('chatUser', user);
  }

  return JSON.parse(user);
};
