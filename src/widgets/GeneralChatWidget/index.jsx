import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Button, Icon, IconButton, Spinner, Alert, Dropdown } from '@openedx/paragon';
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
} from '@openedx/paragon/icons';
import EmojiPicker from 'emoji-picker-react';

import {
  sendMessage,
  subscribeToMessages,
  deleteMessage,
  blockUser,
  unblockUser,
  getBlockedUsers,
  pinMessage,
  unpinMessage,
  subscribeToPinnedMessage,
} from 'services/firebase/chatService';
import { getCurrentUserInfo, getUserDisplayName } from 'services/userService';
import messages from './messages';
import './index.scss';

// Load test function in development
if (process.env.NODE_ENV === 'development') {
  import('services/firebase/testConnection').catch(() => {
    console.log('Firebase test connection not available');
  });
}

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

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Load user info on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserInfo();
        if (userInfo.success && userInfo.isAuthenticated) {
          setCurrentUser(userInfo);
          setAuthError(null);
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

  // Subscribe to real-time messages when chat is open
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
  }, [isChatOpen]);

  // Subscribe to pinned message
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

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isChatOpen) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (messagesEndRef.current) {
          const chatMessagesContainer = messagesEndRef.current.closest('.chat-messages');
          if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
          }
        }
      }, 100);
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
    const result = await sendMessage(inputMessage.trim(), currentUser);

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
      const result = await blockUser(userId, currentUser);
      if (result.success) {
        // Reload blocked users list
        const blocked = await getBlockedUsers();
        setBlockedUsers(blocked);
      } else {
        // eslint-disable-next-line no-alert
        alert(`Failed to block user: ${result.error}`);
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
    const value = e.target.value;
    setInputMessage(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      // Show mention suggestions
      const uniqueUsers = [...new Set(chatMessages.map((msg) => ({
        id: msg.userId,
        name: msg.userName,
      })))];
      setMentionSuggestions(uniqueUsers);
      setShowMentionSuggestions(true);
    } else if (lastAtIndex !== -1) {
      const searchTerm = value.substring(lastAtIndex + 1).toLowerCase();
      if (searchTerm && !searchTerm.includes(' ')) {
        const uniqueUsers = [...new Set(chatMessages.map((msg) => ({
          id: msg.userId,
          name: msg.userName,
        })))];
        const filtered = uniqueUsers.filter((user) => user.name.toLowerCase().includes(searchTerm));
        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const handleMentionSelect = (userName) => {
    const lastAtIndex = inputMessage.lastIndexOf('@');
    const newMessage = inputMessage.substring(0, lastAtIndex) + `@${userName} `;
    setInputMessage(newMessage);
    setShowMentionSuggestions(false);
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

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
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
      return <span className="role-badge">👑 Admin</span>;
    }
    if (msg.isStaff) {
      return <span className="role-badge">⭐ Staff</span>;
    }
    return null;
  };

  return (
    <Card id="general-chat-widget" className="mt-3">
      <Card.Body>
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
                <IconButton
                  src={Close}
                  iconAs={Icon}
                  alt={formatMessage(messages.closeChat)}
                  onClick={toggleChat}
                  variant="tertiary"
                  size="sm"
                />
              </div>

              {authError && !userLoading && (
                <Alert variant="warning" className="mb-2">
                  {authError}
                </Alert>
              )}

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

              {currentUser && (currentUser.isStaff || currentUser.isAdmin) && (
                <div className="blocked-users-section mb-2">
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
                    <div className="blocked-users-list mt-2">
                      {blockedUsers.length === 0 ? (
                        <div className="text-center text-muted p-2">
                          <small>{formatMessage(messages.noBlockedUsers)}</small>
                        </div>
                      ) : (
                        blockedUsers.map((blockedUser) => (
                          <div key={blockedUser.userId} className="blocked-user-item">
                            <div className="blocked-user-info">
                              <div className="blocked-user-name font-weight-bold">
                                {blockedUser.userId}
                              </div>
                              <div className="blocked-user-meta">
                                <small className="text-muted">
                                  {formatMessage(messages.blockedBy)}: {blockedUser.blockedByName}
                                </small>
                              </div>
                            </div>
                            <IconButton
                              src={Block}
                              iconAs={Icon}
                              alt={formatMessage(messages.unblockUser)}
                              onClick={() => handleUnblockUser(blockedUser.userId)}
                              variant="link"
                              size="sm"
                              className="text-danger"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="chat-messages">
                {isLoading ? (
                  <div className="text-center p-4">
                    <Spinner animation="border" size="sm" className="mr-2" />
                    <span className="text-muted">Loading messages...</span>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="chat-welcome-message text-center text-muted p-4">
                    <Icon src={Chat} className="mb-2" style={{ fontSize: '2rem' }} />
                    <p>{formatMessage(messages.welcomeMessage)}</p>
                  </div>
                ) : (
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
                              <span className="message-user">{msg.userName}</span>
                              {getRoleBadge(msg)}
                              {userBlocked && <span className="blocked-badge">Blocked</span>}
                            </div>
                            <span className="message-time">
                              {formatMessageTime(msg.timestamp, msg.createdAt)}
                            </span>
                          </div>
                          <div className="message-text">{msg.text}</div>

                          {currentUser && (canDelete || isStaffOrAdmin) && (
                            <div className="message-actions">
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
                                    <Dropdown.Item onClick={() => handlePinMessage(msg)}>
                                      <Icon src={PushPin} className="mr-2" />
                                      {formatMessage(messages.pinMessage)}
                                    </Dropdown.Item>
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
                          if (e.key === 'Enter') handleMentionSelect(user.name);
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
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      currentUser
                        ? formatMessage(messages.typeMessage)
                        : 'Please login to send messages'
                    }
                    aria-label={formatMessage(messages.typeMessage)}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isSending || !currentUser || userLoading}
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
      </Card.Body>
    </Card>
  );
};

GeneralChatWidget.propTypes = {};

export default GeneralChatWidget;
