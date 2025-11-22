/**
 * Room Notifications - Track unread messages for chat rooms
 * Helps admin/staff see which rooms have new messages
 */

const STORAGE_PREFIX = 'chat_room_last_visited_';

/**
 * Get last visited timestamp for a room
 * @param {string} roomId - Room ID
 * @returns {number} Timestamp in milliseconds (or 0 if never visited)
 */
export const getLastVisitedTime = (roomId) => {
  const key = `${STORAGE_PREFIX}${roomId}`;
  const timestamp = localStorage.getItem(key);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

/**
 * Update last visited timestamp for a room (to current time)
 * @param {string} roomId - Room ID
 */
export const updateLastVisitedTime = (roomId) => {
  const key = `${STORAGE_PREFIX}${roomId}`;
  localStorage.setItem(key, Date.now().toString());
};

/**
 * Clear all last visited timestamps (useful for logout/reset)
 */
export const clearAllVisitedTimes = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};

/**
 * Count messages that are newer than last visited time
 * @param {Array} messages - Array of message objects
 * @param {number} lastVisitedTime - Timestamp to compare against
 * @returns {number} Count of unread messages
 */
export const countUnreadMessages = (messages, lastVisitedTime) => {
  if (!messages || !Array.isArray(messages)) {
    return 0;
  }

  if (!lastVisitedTime || lastVisitedTime === 0) {
    // Never visited this room, count all messages
    return messages.length;
  }

  return messages.filter((msg) => {
    // Use timestamp (server time) or createdAt (ISO string)
    const messageTime = msg.timestamp || new Date(msg.createdAt).getTime();
    return messageTime > lastVisitedTime;
  }).length;
};
