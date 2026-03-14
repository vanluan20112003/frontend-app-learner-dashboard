import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Card, Button, Icon, IconButton, Spinner, Alert, Dropdown, Modal,
} from '@openedx/paragon';
import {
  Chat,
  Close,
  Send,
  Delete,
  Block,
  PushPin,
  MoreVert,
  InsertEmoticon,
  ExpandLess,
  ExpandMore,
  Person,
} from '@openedx/paragon/icons';
import EmojiPicker from 'emoji-picker-react';

import {
  sendMessage,
  subscribeToMessages,
  subscribeToRoomMessages,
  deleteMessage,
  blockUser,
  unblockUser,
  getBlockedUsers,
  pinMessage,
  unpinMessage,
  subscribeToPinnedMessage,
  checkAndMaskBannedWords,
  subscribeToBannedWords,
  toggleReaction,
  cleanupOldMessages,
} from 'services/firebase/chatService';
import { getCurrentUserInfo, getUserDisplayName } from 'services/userService';
import { syncUserToFirebase } from 'services/firebase/syncUserToFirebase';
import { CHAT_ROOMS } from 'services/firebase/chatRooms';
import {
  getLastVisitedTime,
  updateLastVisitedTime,
  countUnreadMessages,
} from 'services/firebase/roomNotifications';
import BannedWordsManager from './BannedWordsManager';
import DatabaseSwitcher from './DatabaseSwitcher';
import RoomSwitcher from './RoomSwitcher';
import messages from './messages';
import './index.scss';

// Load test function in development
if (process.env.NODE_ENV === 'development') {
  import('services/firebase/testConnection').catch(() => {
    console.log('Firebase test connection not available');
  });
}

const REACTION_EMOJIS = [
  { emoji: '❤️', label: 'heart' },
  { emoji: '😂', label: 'haha' },
  { emoji: '👍', label: 'like' },
  { emoji: '😮', label: 'wow' },
  { emoji: '😢', label: 'sad' },
  { emoji: '😡', label: 'angry' },
];

export const GeneralChatWidget = () => {
  const { formatMessage } = useIntl();

  // Get saved state from sessionStorage
  const savedChatOpen = sessionStorage.getItem('chatWidgetOpen') !== 'false'; // Default true

  const [isChatOpen, setIsChatOpen] = useState(savedChatOpen);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [bannedWords, setBannedWords] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const [activeReactionPicker, setActiveReactionPicker] = useState(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const roomSubscriptionsRef = useRef({});

  // Load user info on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserInfo();
        if (userInfo.success && userInfo.isAuthenticated) {
          setCurrentUser(userInfo);
          setAuthError(null);

          // Sync user to Firebase for rules checking
          syncUserToFirebase(userInfo);
        } else {
          setAuthError('Please login to send messages');
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setAuthError('Failed to load user info');
      } finally {
        setUserLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const toggleChat = () => {
    const newChatOpen = !isChatOpen;
    setIsChatOpen(newChatOpen);
    sessionStorage.setItem('chatWidgetOpen', newChatOpen);
  };

  // Handle room change
  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
    // Clear current messages to show loading state
    setChatMessages([]);
    setPinnedMessage(null);
  };

  // Subscribe to real-time messages when chat is open or room changes
  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    let unsubscribe;
    setIsLoading(true);

    const setupSubscription = async () => {
      unsubscribe = await subscribeToMessages((newMessages) => {
        setChatMessages(newMessages);
        setIsLoading(false);
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isChatOpen, currentRoom]);

  // Subscribe to pinned message (re-subscribe when room changes)
  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    let unsubscribe;

    const setupPinnedSubscription = async () => {
      unsubscribe = await subscribeToPinnedMessage((pinned) => {
        setPinnedMessage(pinned);
      });
    };

    setupPinnedSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isChatOpen, currentRoom]);

  // Subscribe to banned words
  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    let unsubscribe;

    const setupBannedWordsSubscription = async () => {
      unsubscribe = await subscribeToBannedWords((words) => {
        setBannedWords(words);
      });
    };

    setupBannedWordsSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isChatOpen]);

  // Load blocked users for admin/staff
  useEffect(() => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }

    const loadBlockedUsers = async () => {
      const blocked = await getBlockedUsers();
      setBlockedUsers(blocked);
    };

    loadBlockedUsers();
  }, [currentUser, isChatOpen]);

  // Subscribe to all rooms for unread count (admin/staff only)
  useEffect(() => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return undefined;
    }

    if (!isChatOpen) {
      return undefined;
    }

    const setupRoomSubscriptions = async () => {
      const rooms = Object.values(CHAT_ROOMS);

      // eslint-disable-next-line no-restricted-syntax
      for (const room of rooms) {
        const { id: roomId } = room;

        // Skip current room (already subscribed in main effect)
        if (roomId === currentRoom) {
          // eslint-disable-next-line no-continue
          continue;
        }

        // Subscribe to this room's messages
        // eslint-disable-next-line no-await-in-loop
        const unsubscribe = await subscribeToRoomMessages(roomId, (roomMessages) => {
          const lastVisited = getLastVisitedTime(roomId);
          const unreadCount = countUnreadMessages(roomMessages, lastVisited);

          setUnreadCounts((prev) => ({
            ...prev,
            [roomId]: unreadCount,
          }));
        }, 100); // Get more messages to count properly

        // Store unsubscribe function
        roomSubscriptionsRef.current[roomId] = unsubscribe;
      }
    };

    setupRoomSubscriptions();

    return () => {
      // Cleanup all room subscriptions
      Object.values(roomSubscriptionsRef.current).forEach((unsubscribe) => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
      roomSubscriptionsRef.current = {};
    };
  }, [currentUser, isChatOpen, currentRoom]);

  // Update last visited time when switching rooms
  useEffect(() => {
    if (currentRoom !== null && currentUser && (currentUser.isStaff || currentUser.isAdmin)) {
      updateLastVisitedTime(currentRoom);
      // Clear unread count for current room
      setUnreadCounts((prev) => ({
        ...prev,
        [currentRoom]: 0,
      }));
    }
  }, [currentRoom, currentUser]);

  // Close emoji picker and reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (!event.target.closest('.reaction-picker-container')) {
        setActiveReactionPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasScrolledInitially = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (smooth = false) => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        const container = messagesEndRef.current.closest('.chat-messages');
        if (container) {
          if (smooth) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          } else {
            container.scrollTop = container.scrollHeight;
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!isChatOpen || chatMessages.length === 0) return;
    if (!hasScrolledInitially.current) {
      // Lần đầu: scroll ngay + thêm 1 lần nữa sau 500ms để chắc chắn
      scrollToBottom(false);
      setTimeout(() => scrollToBottom(false), 500);
      hasScrolledInitially.current = true;
    } else {
      // Tin nhắn mới: scroll smooth
      scrollToBottom(true);
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) {
      return;
    }

    if (!currentUser || !currentUser.isAuthenticated) {
      // eslint-disable-next-line no-alert
      alert('Please login to send messages');
      return;
    }

    setIsSending(true);

    // Check for banned words and mask them
    const bannedWordCheck = checkAndMaskBannedWords(inputMessage.trim(), bannedWords);

    if (bannedWordCheck.hasBannedWords) {
      // eslint-disable-next-line no-alert
      alert(`Your message contains banned words: ${bannedWordCheck.foundWords.join(', ')}. They have been masked with asterisks.`);
    }

    const messageToSend = bannedWordCheck.hasBannedWords
      ? bannedWordCheck.maskedText
      : inputMessage.trim();

    const result = await sendMessage(messageToSend, currentUser);

    if (result.success) {
      setInputMessage('');
    } else {
      console.error('Failed to send message:', result.error);
      let errorMsg;

      // Check specific error types
      if (result.error === 'Firebase not initialized') {
        errorMsg = formatMessage(messages.firebaseError);
      } else if (result.error === 'You have been blocked from the chat') {
        errorMsg = formatMessage(messages.blockedError);
      } else if (typeof result.error === 'string') {
        errorMsg = result.error;
      } else {
        errorMsg = `Failed to send message: ${result.error?.message || 'Unknown error'}. Please check Firebase Database Rules.`;
      }

      // eslint-disable-next-line no-alert
      alert(errorMsg);
    }
    setIsSending(false);
  };

  const handleDeleteMessage = async (messageId, messageOwnerId) => {
    if (!currentUser) {
      return;
    }

    // Check if user has permission (own message, staff, or admin)
    const isOwnMessage = messageOwnerId === currentUser.id || messageOwnerId === currentUser.username;
    const hasPermission = currentUser.isStaff || currentUser.isAdmin || isOwnMessage;

    if (!hasPermission) {
      return;
    }

    // eslint-disable-next-line no-alert
    if (window.confirm(formatMessage(messages.deleteConfirm))) {
      const result = await deleteMessage(messageId, currentUser, messageOwnerId);
      if (!result.success) {
        // eslint-disable-next-line no-alert
        alert(`Failed to delete message: ${result.error}`);
      }
    }
  };

  const handleBlockUser = async (userId, userName) => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }

    // eslint-disable-next-line no-alert
    if (window.confirm(formatMessage(messages.blockConfirm))) {
      const result = await blockUser(userId, userName, currentUser);
      if (result.success) {
        // Reload blocked users list
        const blocked = await getBlockedUsers();
        setBlockedUsers(blocked);
      } else {
        // eslint-disable-next-line no-alert
        const errorMessage = result.error?.code === 'PERMISSION_DENIED'
          ? 'Permission denied. Please check Firebase Database Rules or contact administrator.'
          : `Failed to block user: ${result.error}`;
        alert(errorMessage);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }

    const result = await unblockUser(userId, currentUser);
    if (result.success) {
      // Reload blocked users list
      const blocked = await getBlockedUsers();
      setBlockedUsers(blocked);
    } else {
      // eslint-disable-next-line no-alert
      alert(`Failed to unblock user: ${result.error}`);
    }
  };

  const handleViewUserInfo = (msg) => {
    if (!currentUser) {
      return;
    }

    setSelectedUserInfo({
      userId: msg.userId,
      userName: msg.userName,
      role: msg.userRole || 'student',
      isStaff: msg.isStaff || false,
      isAdmin: msg.isAdmin || false,
    });
    setShowUserInfoModal(true);
  };

  const handlePinMessage = async (msg) => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }

    const result = await pinMessage(msg.id, msg, currentUser);
    if (!result.success) {
      // eslint-disable-next-line no-alert
      alert(`Failed to pin message: ${result.error}`);
    }
  };

  const handleUnpinMessage = async () => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm(formatMessage(messages.unpinConfirm))) {
      return;
    }

    const result = await unpinMessage(currentUser);
    if (!result.success) {
      // eslint-disable-next-line no-alert
      alert(`Failed to unpin message: ${result.error}`);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputMessage(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1);

      // Get unique users from messages
      const usersMap = new Map();
      chatMessages.forEach((msg) => {
        if (!usersMap.has(msg.userId)) {
          usersMap.set(msg.userId, { id: msg.userId, name: msg.userName });
        }
      });
      const uniqueUsers = Array.from(usersMap.values());

      // Check if afterAt already matches a full username (mention completed with trailing space)
      const matchedFull = uniqueUsers.find(
        (u) => value.substring(lastAtIndex + 1) === `${u.name} `,
      );
      if (matchedFull) {
        setShowMentionSuggestions(false);
        return;
      }

      const searchTerm = afterAt.toLowerCase();
      if (searchTerm.length === 0) {
        setMentionSuggestions(uniqueUsers);
        setShowMentionSuggestions(uniqueUsers.length > 0);
      } else {
        const filtered = uniqueUsers.filter((user) => user.name.toLowerCase().startsWith(searchTerm));
        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const handleMentionSelect = (userName) => {
    const lastAtIndex = inputMessage.lastIndexOf('@');
    const newMessage = `${inputMessage.substring(0, lastAtIndex)}@${userName} `;
    setInputMessage(newMessage);
    setShowMentionSuggestions(false);
    // Smart cursor: focus and place cursor at end after mention
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = newMessage.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  // Handle click on username to tag them
  const handleUserClick = (userName) => {
    const newValue = `${inputMessage}@${userName} `;
    setInputMessage(newValue);
    setShowMentionSuggestions(false);
    // Smart cursor: focus and place cursor at end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = newValue.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  const handleReaction = async (messageId, emoji) => {
    if (!currentUser || !currentUser.isAuthenticated) {
      return;
    }
    await toggleReaction(messageId, emoji, currentUser);
    setActiveReactionPicker(null);
  };

  const handleCleanupOldMessages = async () => {
    if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
      return;
    }
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete all messages older than 4 months? This cannot be undone.')) {
      return;
    }
    setIsCleaningUp(true);
    const result = await cleanupOldMessages();
    setIsCleaningUp(false);
    if (result.success) {
      // eslint-disable-next-line no-alert
      alert(`Cleanup complete. Deleted ${result.deletedCount} old messages.`);
    } else {
      // eslint-disable-next-line no-alert
      alert(`Cleanup failed: ${result.error}`);
    }
  };

  const getReactionSummary = (reactions) => {
    if (!reactions) {
      return [];
    }
    return Object.entries(reactions).map(([emoji, users]) => ({
      emoji,
      count: Object.keys(users).length,
      users: Object.keys(users),
      userNames: Object.values(users).map((u) => u.userName).join(', '),
    }));
  };

  const hasUserReacted = (reactions, emoji) => {
    if (!reactions || !reactions[emoji]) {
      return false;
    }
    const userId = currentUser?.id || currentUser?.username;
    return !!reactions[emoji][userId];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isUserBlocked = (userId) => blockedUsers.some((blocked) => blocked.userId === userId);

  const formatMessageTime = (timestamp, createdAt) => {
    const date = timestamp ? new Date(timestamp) : new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) { return 'Just now'; }
    if (diffInMinutes < 60) { return `${diffInMinutes}m ago`; }
    if (diffInMinutes < 1440) { return `${Math.floor(diffInMinutes / 60)}h ago`; }
    return date.toLocaleDateString();
  };

  const getMessageClasses = (msg) => {
    const classes = ['chat-message'];

    // Own vs other message
    if (msg.userId === currentUser?.id || msg.userId === currentUser?.username) {
      classes.push('own-message');
    } else {
      classes.push('other-message');
    }

    // Role-based styling
    if (msg.isAdmin) {
      classes.push('admin-message');
    } else if (msg.isStaff) {
      classes.push('staff-message');
    }

    return classes.join(' ');
  };

  const getRoleBadge = (msg) => {
    if (msg.isAdmin) {
      return <span className="role-badge">{String.fromCodePoint(0x1F451)} Admin</span>;
    }
    if (msg.isStaff) {
      return <span className="role-badge">{String.fromCodePoint(0x2B50)} Staff</span>;
    }
    return null;
  };

  // Render message text with colored @mentions
  const renderMessageText = (text) => {
    if (!text || !text.includes('@')) {
      return text;
    }

    // Build list of known usernames from messages (sorted longest first to avoid partial match)
    const usersMap = new Map();
    chatMessages.forEach((msg) => {
      if (!usersMap.has(msg.userId)) {
        usersMap.set(msg.userId, msg.userName);
      }
    });
    const knownNames = Array.from(usersMap.values()).sort((a, b) => b.length - a.length);

    if (knownNames.length === 0) return text;

    // Build regex that matches @KnownName exactly
    const escapedNames = knownNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const mentionRegex = new RegExp(`(@(?:${escapedNames.join('|')}))`, 'g');

    const parts = text.split(mentionRegex);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const mentionName = part.slice(1);
        const isCurrentUser = currentUser && (
          mentionName === currentUser.name
          || mentionName === currentUser.username
        );
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={`mention-highlight ${isCurrentUser ? 'mention-self' : 'mention-other'}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card id="general-chat-widget" className="mt-3">
      <Card.Body>
        {/* eslint-disable react/jsx-indent, indent */}
        {!isChatOpen ? (
            <div className="chat-preview">
              <p className="text-muted mb-3">
                {formatMessage(messages.chatDescription)}
              </p>
              <Button
                variant="brand"
                onClick={toggleChat}
                iconBefore={Chat}
                block
              >
                {formatMessage(messages.openChat)}
              </Button>
            </div>
          ) : (
            <div className="chat-container">
              <div className="chat-header d-flex justify-content-between align-items-center mb-2">
                <span className="font-weight-bold">
                  {formatMessage(messages.generalChat)}
                  {currentUser && (
                    <small className="ml-2 text-muted">
                      ({getUserDisplayName(currentUser)})
                    </small>
                  )}
                </span>
                <div className="d-flex align-items-center gap-1">
                  {currentUser && (currentUser.isStaff || currentUser.isAdmin) && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleCleanupOldMessages}
                      disabled={isCleaningUp}
                      title="Delete messages older than 4 months"
                      className="mr-1"
                    >
                      {isCleaningUp ? '...' : String.fromCodePoint(0x1F9F9)}
                    </Button>
                  )}
                  <IconButton
                    src={Close}
                    iconAs={Icon}
                    alt={formatMessage(messages.closeChat)}
                    onClick={toggleChat}
                    variant="tertiary"
                    size="sm"
                  />
                </div>
              </div>

              {authError && !userLoading && (
                <Alert variant="warning" className="mb-2">
                  {authError}
                </Alert>
              )}

              {/* Database Switcher - Dev Mode Only */}
              <DatabaseSwitcher />

              {/* Room Switcher - Always Visible */}
              <RoomSwitcher
                onRoomChange={handleRoomChange}
                unreadCounts={unreadCounts}
                isStaffOrAdmin={currentUser && (currentUser.isStaff || currentUser.isAdmin)}
              />

              {pinnedMessage && (
                <div className="pinned-message-container">
                  <div className="pinned-message-header">
                    <div className="d-flex align-items-center">
                      <Icon src={PushPin} className="mr-1" style={{ fontSize: '0.875rem' }} />
                      <span className="font-weight-bold">{formatMessage(messages.pinnedMessage)}</span>
                    </div>
                    {currentUser && (currentUser.isStaff || currentUser.isAdmin) && (
                      <IconButton
                        src={Close}
                        iconAs={Icon}
                        alt={formatMessage(messages.unpinMessage)}
                        onClick={handleUnpinMessage}
                        variant="tertiary"
                        size="sm"
                      />
                    )}
                  </div>
                  <div className="pinned-message-content">
                    <span className="pinned-user">{pinnedMessage.userName}: </span>
                    <span>{pinnedMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Banned Words Manager - Admin/Staff only */}
              <BannedWordsManager currentUser={currentUser} />

              {/* Blocked Users List - Admin/Staff only */}
              {currentUser && (currentUser.isStaff || currentUser.isAdmin) && (
                <Card className="blocked-users-section mb-2">
                  <Card.Body className="p-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowBlockedUsers(!showBlockedUsers)}
                      block
                    >
                      <Icon src={Block} className="mr-2" />
                      {formatMessage(messages.blockedUsers)} ({blockedUsers.length})
                      <Icon src={showBlockedUsers ? ExpandLess : ExpandMore} className="ml-2" />
                    </Button>

                    {showBlockedUsers && (
                      <div className="mt-2">
                        {blockedUsers.length === 0 ? (
                          <div className="text-center text-muted p-2">
                            <small>{formatMessage(messages.noBlockedUsers)}</small>
                          </div>
                        ) : (
                          <div className="blocked-users-list">
                            {blockedUsers.map((blockedUser) => (
                              <div key={blockedUser.userId} className="blocked-user-item">
                                <div className="blocked-user-info">
                                  <div className="blocked-user-name">
                                    {blockedUser.userName || blockedUser.userId}
                                  </div>
                                  <div className="blocked-user-meta text-muted">
                                    <small>
                                      {formatMessage(messages.blockedBy)}: {blockedUser.blockedByName}
                                    </small>
                                    <br />
                                    <small>
                                      {formatMessage(messages.blockedAt)}:{' '}
                                      {new Date(blockedUser.blockedAt).toLocaleString()}
                                    </small>
                                  </div>
                                </div>
                                <IconButton
                                  src={Delete}
                                  iconAs={Icon}
                                  alt={formatMessage(messages.unblockUser)}
                                  onClick={() => handleUnblockUser(blockedUser.userId)}
                                  variant="link"
                                  size="sm"
                                  className="btn-icon text-danger"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              <div className="chat-messages">
                {isLoading && (
                  <div className="text-center p-4">
                    <Spinner animation="border" size="sm" className="mr-2" />
                    <span className="text-muted">Loading messages...</span>
                  </div>
                )}
                {!isLoading && chatMessages.length === 0 && (
                  <div className="chat-welcome-message text-center text-muted p-4">
                    <Icon src={Chat} className="mb-2" style={{ fontSize: '2rem' }} />
                    <p>{formatMessage(messages.welcomeMessage)}</p>
                  </div>
                )}
                {!isLoading && chatMessages.length > 0 && (
                  <>
                    {chatMessages.map((msg) => {
                      const isOwnMessage = msg.userId === currentUser?.id || msg.userId === currentUser?.username;
                      const canDelete = currentUser && (currentUser.isStaff || currentUser.isAdmin || isOwnMessage);
                      const isStaffOrAdmin = currentUser && (currentUser.isStaff || currentUser.isAdmin);
                      const userBlocked = isUserBlocked(msg.userId);

                      return (
                        <div key={msg.id} className={getMessageClasses(msg)}>
                          <div className="message-header">
                            <div className="message-user-info">
                              <span
                                className="message-user clickable-username"
                                onClick={() => handleUserClick(msg.userName)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') { handleUserClick(msg.userName); }
                                }}
                                title={`Click to mention @${msg.userName}`}
                              >
                                {msg.userName}
                              </span>
                              {getRoleBadge(msg)}
                              {userBlocked && <span className="blocked-badge">Blocked</span>}
                            </div>
                            <div className="message-header-right">
                              <span className="message-time">
                                {formatMessageTime(msg.timestamp, msg.createdAt)}
                              </span>
                              {currentUser && (canDelete || isStaffOrAdmin) && (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    id={`dropdown-${msg.id}`}
                                    as={IconButton}
                                    src={MoreVert}
                                    iconAs={Icon}
                                    alt="More actions"
                                    variant="tertiary"
                                    size="sm"
                                  />
                                  <Dropdown.Menu>
                                    {isStaffOrAdmin && (
                                      <>
                                        <Dropdown.Item onClick={() => handlePinMessage(msg)}>
                                          <Icon src={PushPin} className="mr-2" />
                                          {formatMessage(messages.pinMessage)}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleViewUserInfo(msg)}>
                                          <Icon src={Person} className="mr-2" />
                                          {formatMessage(messages.viewUserInfo)}
                                        </Dropdown.Item>
                                      </>
                                    )}
                                    {canDelete && (
                                      <Dropdown.Item onClick={() => handleDeleteMessage(msg.id, msg.userId)}>
                                        <Icon src={Delete} className="mr-2" />
                                        {formatMessage(messages.deleteMessage)}
                                      </Dropdown.Item>
                                    )}
                                    {isStaffOrAdmin && !isOwnMessage && (
                                      <>
                                        <Dropdown.Divider />
                                        {userBlocked ? (
                                          <Dropdown.Item onClick={() => handleUnblockUser(msg.userId)}>
                                            <Icon src={Block} className="mr-2" />
                                            {formatMessage(messages.unblockUser)}
                                          </Dropdown.Item>
                                        ) : (
                                          <Dropdown.Item onClick={() => handleBlockUser(msg.userId, msg.userName)}>
                                            <Icon src={Block} className="mr-2" />
                                            {formatMessage(messages.blockUser)}
                                          </Dropdown.Item>
                                        )}
                                      </>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}
                            </div>
                          </div>
                          <div className="message-text">{renderMessageText(msg.text)}</div>

                          {/* Reactions row: chips + add button together */}
                          {currentUser && currentUser.isAuthenticated && (
                            <div className="message-reactions-row">
                              {getReactionSummary(msg.reactions).map(({ emoji, count, userNames }) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  className={`reaction-chip ${hasUserReacted(msg.reactions, emoji) ? 'reacted' : ''}`}
                                  onClick={() => handleReaction(msg.id, emoji)}
                                  title={userNames}
                                >
                                  <span className="reaction-emoji">{emoji}</span>
                                  <span className="reaction-count">{count}</span>
                                </button>
                              ))}
                              <div className="reaction-picker-container">
                                <button
                                  type="button"
                                  className="reaction-add-btn"
                                  onClick={() => setActiveReactionPicker(
                                    activeReactionPicker === msg.id ? null : msg.id,
                                  )}
                                  title="Thêm reaction"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 13.5s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                                    <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeWidth="3" />
                                    <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeWidth="3" />
                                  </svg>
                                  <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>+</span>
                                </button>
                                {activeReactionPicker === msg.id && (
                                  <div className="reaction-picker">
                                    {REACTION_EMOJIS.map(({ emoji, label }) => (
                                      <button
                                        key={label}
                                        type="button"
                                        className="reaction-emoji-btn"
                                        onClick={() => handleReaction(msg.id, emoji)}
                                        title={label}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="chat-input-container mt-2">
                {showMentionSuggestions && mentionSuggestions.length > 0 && (
                  <div className="mention-suggestions">
                    {mentionSuggestions.map((user) => (
                      <div
                        key={user.id}
                        className="mention-suggestion-item"
                        onClick={() => handleMentionSelect(user.name)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') { handleMentionSelect(user.name); }
                        }}
                      >
                        @{user.name}
                      </div>
                    ))}
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="emoji-picker-wrapper" ref={emojiPickerRef}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height="350px" />
                  </div>
                )}

                <div className="input-group">
                  <div className="input-group-prepend">
                    <IconButton
                      src={InsertEmoticon}
                      iconAs={Icon}
                      alt={formatMessage(messages.addEmoji)}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      variant="tertiary"
                      size="sm"
                    />
                    <button
                      type="button"
                      className="mention-trigger-btn"
                      onClick={() => {
                        const val = inputMessage;
                        const newVal = val.endsWith(' ') || val === '' ? `${val}@` : `${val} @`;
                        setInputMessage(newVal);
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                            inputRef.current.setSelectionRange(newVal.length, newVal.length);
                          }
                        }, 0);
                      }}
                      title="Mention người dùng"
                      disabled={isSending || !currentUser || userLoading || authError}
                    >
                      @
                    </button>
                  </div>
                  <textarea
                    ref={inputRef}
                    className="form-control chat-textarea"
                    placeholder={
                      currentUser
                        ? formatMessage(messages.typeMessage)
                        : 'Please login to send messages'
                    }
                    aria-label={formatMessage(messages.typeMessage)}
                    value={inputMessage}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Auto-expand: reset height then set to scrollHeight
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={isSending || !currentUser || userLoading || authError}
                    rows={1}
                  />
                  <div className="input-group-append">
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={
                        !inputMessage.trim()
                        || isSending
                        || !currentUser
                        || userLoading
                      }
                      iconBefore={isSending ? Spinner : Send}
                    >
                      {formatMessage(messages.send)}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* eslint-enable react/jsx-indent, indent */}
      </Card.Body>

      {/* User Info Modal - inline trong chat widget */}
      {showUserInfoModal && selectedUserInfo && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
          }}
          onClick={() => setShowUserInfoModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '20px',
              width: '85%',
              maxWidth: '340px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h6 style={{ margin: 0, fontWeight: 600 }}>{formatMessage(messages.userInformation)}</h6>
              <button
                type="button"
                onClick={() => setShowUserInfoModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#666', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: '0.875rem', lineHeight: '2' }}>
              <div><strong>{formatMessage(messages.username)}:</strong> {selectedUserInfo.userName}</div>
              <div><strong>{formatMessage(messages.user)}:</strong> {selectedUserInfo.userId}</div>
              <div>
                <strong>{formatMessage(messages.role)}:</strong>{' '}
                {/* eslint-disable-next-line no-nested-ternary */}
                {selectedUserInfo.isAdmin ? 'Admin' : selectedUserInfo.isStaff ? 'Staff' : 'Student'}
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '14px' }}>
              <Button size="sm" variant="tertiary" onClick={() => setShowUserInfoModal(false)}>
                {formatMessage(messages.close)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

GeneralChatWidget.propTypes = {};

export default GeneralChatWidget;
