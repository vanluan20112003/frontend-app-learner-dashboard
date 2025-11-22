/**
 * Chat Rooms Configuration
 * Defines available chat rooms and provides room management functions
 */

// Available chat rooms
export const CHAT_ROOMS = {
  GENERAL: {
    id: '', // Empty string để sử dụng path cũ (backward compatible)
    name: 'Chung',
    description: 'Phòng chat tổng quát',
    icon: 'Forum',
  },
  QA: {
    id: 'hoidap',
    name: 'Hỏi & Đáp',
    description: 'Phòng hỏi đáp học tập',
    icon: 'HelpOutline',
  },
  TECHNICAL: {
    id: 'kithuat',
    name: 'Kỹ thuật',
    description: 'Phòng thảo luận kỹ thuật',
    icon: 'Code',
  },
};

// Default room
const DEFAULT_ROOM = CHAT_ROOMS.GENERAL.id;

// Current active room (default to GENERAL)
let currentRoom = DEFAULT_ROOM;

// Load saved room preference from localStorage
const STORAGE_KEY = 'firebase_chat_room';
const savedRoom = localStorage.getItem(STORAGE_KEY);
// Allow empty string for GENERAL room (backward compatible)
if (savedRoom !== null && Object.values(CHAT_ROOMS).some(room => room.id === savedRoom)) {
  currentRoom = savedRoom;
}

/**
 * Get current active chat room
 * @returns {string} Current room ID
 */
export const getCurrentRoom = () => currentRoom;

/**
 * Set active chat room and persist to localStorage
 * @param {string} roomId - Room ID to switch to
 * @returns {boolean} True if successful
 */
export const setCurrentRoom = (roomId) => {
  // Validate room ID
  const isValidRoom = Object.values(CHAT_ROOMS).some(room => room.id === roomId);
  if (!isValidRoom) {
    console.error(`[chatRooms] Invalid room ID: ${roomId}`);
    return false;
  }

  currentRoom = roomId;
  localStorage.setItem(STORAGE_KEY, roomId);
  console.log(`[chatRooms] Switched to room: ${roomId}`);
  return true;
};

/**
 * Get room info by ID
 * @param {string} roomId - Room ID
 * @returns {Object|null} Room info or null if not found
 */
export const getRoomInfo = (roomId) => {
  const room = Object.values(CHAT_ROOMS).find(r => r.id === roomId);
  return room || null;
};

/**
 * Get all available rooms
 * @returns {Array} Array of room objects
 */
export const getAllRooms = () => Object.values(CHAT_ROOMS);

/**
 * Get current room info
 * @returns {Object} Current room info
 */
export const getCurrentRoomInfo = () => {
  return getRoomInfo(currentRoom) || CHAT_ROOMS.GENERAL;
};
