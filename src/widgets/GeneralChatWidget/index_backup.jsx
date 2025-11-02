import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Button, Icon, IconButton, Spinner } from '@openedx/paragon';
import { Chat, ExpandLess, ExpandMore, Close, Send } from '@openedx/paragon/icons';

import { sendMessage, subscribeToMessages, getCurrentUser } from 'services/firebase/chatService';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = useRef(getCurrentUser());

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Subscribe to real-time messages when chat is open
  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    let unsubscribe;
    setIsLoading(true);

    // Async function to subscribe to messages
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);
    const result = await sendMessage(
      inputMessage.trim(),
      currentUser.current.name,
      currentUser.current.id
    );

    if (result.success) {
      setInputMessage('');
    } else {
      console.error('Failed to send message:', result.error);
      const errorMsg = result.error === 'Firebase not initialized'
        ? 'Firebase is not connected. Please check your Firebase configuration.'
        : `Failed to send message: ${result.error?.message || 'Unknown error'}. Please check Firebase Database Rules.`;
      // eslint-disable-next-line no-alert
      alert(errorMsg);
    }
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp, createdAt) => {
    const date = timestamp ? new Date(timestamp) : new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card id="general-chat-widget" className="mt-3">
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        actions={(
          <IconButton
            src={isExpanded ? ExpandLess : ExpandMore}
            iconAs={Icon}
            alt={formatMessage(isExpanded ? messages.collapse : messages.expand)}
            onClick={toggleExpand}
            variant="primary"
            size="sm"
          />
        )}
      >
        <div className="d-flex align-items-center">
          <Icon src={Chat} className="mr-2" />
          <h4 className="mb-0">{formatMessage(messages.generalChat)}</h4>
        </div>
      </Card.Header>

      {isExpanded && (
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
                  <small className="ml-2 text-muted">({currentUser.current.name})</small>
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
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat-message ${msg.userId === currentUser.current.id ? 'own-message' : 'other-message'}`}
                      >
                        <div className="message-header">
                          <span className="message-user">{msg.userName}</span>
                          <span className="message-time">
                            {formatMessageTime(msg.timestamp, msg.createdAt)}
                          </span>
                        </div>
                        <div className="message-text">{msg.text}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <div className="chat-input-container mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={formatMessage(messages.typeMessage)}
                    aria-label={formatMessage(messages.typeMessage)}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                  />
                  <div className="input-group-append">
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isSending}
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
      )}
    </Card>
  );
};

GeneralChatWidget.propTypes = {};

export default GeneralChatWidget;
