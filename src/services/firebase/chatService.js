import { getFirebaseDatabase, getFullDatabasePath } from './config';
import { getCurrentRoom } from './chatRooms';

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
    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const messagesRef = ref(database, `${dbPath}/messages`);

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
    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const messageRef = ref(database, `${dbPath}/messages/${messageId}`);

    await remove(messageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error };
  }
};

/**
 * Subscribe to messages in a specific room
 * @param {string} roomId - Room ID to subscribe to
 * @param {Function} callback - Callback function to receive messages
 * @param {number} limit - Maximum number of messages to fetch
 * @returns {Promise<Function>} - Unsubscribe function
 */
export const subscribeToRoomMessages = async (roomId, callback, limit = 50) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      callback([]);
      return () => {};
    }

    const { ref, onValue, off, query, orderByChild, limitToLast } = await import('firebase/database');

    const dbPath = getFullDatabasePath(roomId);
    const messagesRef = ref(database, `${dbPath}/messages`);
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
      console.error(`Error subscribing to room ${roomId} messages:`, error);
      callback([]);
    };

    onValue(messagesQuery, handleMessages, handleError);

    // Return unsubscribe function
    return () => off(messagesQuery, 'value', handleMessages);
  } catch (error) {
    console.error(`Error setting up subscription for room ${roomId}:`, error);
    callback([]);
    return () => {};
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

    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const messagesRef = ref(database, `${dbPath}/messages`);
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
 * @param {string} userName - User name to block
 * @param {Object} user - User attempting to block
 * @returns {Promise} - Promise that resolves when user is blocked
 */
export const blockUser = async (userId, userName, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, set, get, remove, query, orderByChild, equalTo } = await import('firebase/database');
    const { getDatabasePath } = await import('./config');
    const { CHAT_ROOMS } = await import('./chatRooms');

    const dbPath = getDatabasePath();
    // Add user to blocked list (global, not room-specific)
    const blockedRef = ref(database, `${dbPath}/blockedUsers/${userId}`);
    await set(blockedRef, {
      userId,
      userName,
      blockedAt: new Date().toISOString(),
      blockedBy: user.id || user.username,
      blockedByName: user.name,
    });

    // Delete all messages from this user in ALL rooms
    const deletePromises = [];
    for (const room of Object.values(CHAT_ROOMS)) {
      const roomPath = `${dbPath}/${room.id}`;
      const messagesRef = ref(database, `${roomPath}/messages`);
      const userMessagesQuery = query(messagesRef, orderByChild('userId'), equalTo(userId));
      const snapshot = await get(userMessagesQuery);

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageRef = ref(database, `${roomPath}/messages/${childSnapshot.key}`);
          deletePromises.push(remove(messageRef));
        });
      }
    }

    await Promise.all(deletePromises);

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
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const blockedRef = ref(database, `${dbPath}/blockedUsers/${userId}`);

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
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const blockedRef = ref(database, `${dbPath}/blockedUsers/${userId}`);
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
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const blockedRef = ref(database, `${dbPath}/blockedUsers`);
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
    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const pinnedRef = ref(database, `${dbPath}/pinnedMessage`);

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
    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const pinnedRef = ref(database, `${dbPath}/pinnedMessage`);

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
    const currentRoom = getCurrentRoom();
    const dbPath = getFullDatabasePath(currentRoom);
    const pinnedRef = ref(database, `${dbPath}/pinnedMessage`);

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

// ==================== BANNED WORDS MANAGEMENT ====================

/**
 * Add a banned word or phrase (admin/staff only)
 * @param {string} word - Word or phrase to ban
 * @param {Object} user - User attempting to add banned word
 * @returns {Promise} - Promise that resolves when word is added
 */
export const addBannedWord = async (word, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, push } = await import('firebase/database');
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const bannedWordsRef = ref(database, `${dbPath}/bannedWords`);

    await push(bannedWordsRef, {
      word: word.toLowerCase().trim(),
      addedBy: user.id || user.username,
      addedByName: user.name,
      addedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding banned word:', error);
    return { success: false, error };
  }
};

/**
 * Remove a banned word (admin/staff only)
 * @param {string} wordId - ID of banned word to remove
 * @param {Object} user - User attempting to remove
 * @returns {Promise} - Promise that resolves when word is removed
 */
export const removeBannedWord = async (wordId, user) => {
  try {
    if (!user.isStaff && !user.isAdmin) {
      return { success: false, error: 'Permission denied' };
    }

    const database = await getFirebaseDatabase();
    if (!database) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const { ref, remove } = await import('firebase/database');
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const wordRef = ref(database, `${dbPath}/bannedWords/${wordId}`);

    await remove(wordRef);
    return { success: true };
  } catch (error) {
    console.error('Error removing banned word:', error);
    return { success: false, error };
  }
};

/**
 * Get all banned words
 * @returns {Promise<Array>} - Array of banned words
 */
export const getBannedWords = async () => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      return [];
    }

    const { ref, get } = await import('firebase/database');
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const bannedWordsRef = ref(database, `${dbPath}/bannedWords`);
    const snapshot = await get(bannedWordsRef);

    const bannedWords = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        bannedWords.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
    }

    return bannedWords;
  } catch (error) {
    console.error('Error getting banned words:', error);
    return [];
  }
};

/**
 * Subscribe to banned words updates
 * @param {function} callback - Callback function to handle banned words
 * @returns {Promise<function>} - Promise that resolves to unsubscribe function
 */
export const subscribeToBannedWords = async (callback) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      callback([]);
      return () => {};
    }

    const { ref, onValue, off } = await import('firebase/database');
    const { getDatabasePath } = await import('./config');
    const dbPath = getDatabasePath();
    const bannedWordsRef = ref(database, `${dbPath}/bannedWords`);

    const handleBannedWords = (snapshot) => {
      const words = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          words.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
      }
      callback(words);
    };

    onValue(bannedWordsRef, handleBannedWords);

    return () => off(bannedWordsRef, 'value', handleBannedWords);
  } catch (error) {
    console.error('Error subscribing to banned words:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Check if text contains banned words and mask them
 * @param {string} text - Text to check
 * @param {Array} bannedWords - Array of banned word objects
 * @returns {Object} - { hasBannedWords: boolean, maskedText: string, foundWords: Array }
 */
export const checkAndMaskBannedWords = (text, bannedWords) => {
  let maskedText = text;
  const foundWords = [];

  bannedWords.forEach((bannedWord) => {
    const word = bannedWord.word;
    const regex = new RegExp(word, 'gi');
    if (regex.test(maskedText)) {
      foundWords.push(word);
      maskedText = maskedText.replace(regex, '*'.repeat(word.length));
    }
  });

  return {
    hasBannedWords: foundWords.length > 0,
    maskedText,
    foundWords,
  };
};

