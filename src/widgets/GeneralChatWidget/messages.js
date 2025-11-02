import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  generalChat: {
    id: 'learnerDashboard.generalChatWidget.generalChat',
    defaultMessage: 'General Chat',
    description: 'Title for the general chat widget',
  },
  chatDescription: {
    id: 'learnerDashboard.generalChatWidget.chatDescription',
    defaultMessage: 'Connect with other learners, ask questions, and share your learning experience.',
    description: 'Description of the general chat feature',
  },
  openChat: {
    id: 'learnerDashboard.generalChatWidget.openChat',
    defaultMessage: 'Open Chat',
    description: 'Button text to open the chat',
  },
  closeChat: {
    id: 'learnerDashboard.generalChatWidget.closeChat',
    defaultMessage: 'Close Chat',
    description: 'Button text to close the chat',
  },
  expand: {
    id: 'learnerDashboard.generalChatWidget.expand',
    defaultMessage: 'Expand',
    description: 'Button text to expand the widget',
  },
  collapse: {
    id: 'learnerDashboard.generalChatWidget.collapse',
    defaultMessage: 'Collapse',
    description: 'Button text to collapse the widget',
  },
  welcomeMessage: {
    id: 'learnerDashboard.generalChatWidget.welcomeMessage',
    defaultMessage: 'Welcome to the general chat! Start a conversation with fellow learners.',
    description: 'Welcome message when chat is opened',
  },
  typeMessage: {
    id: 'learnerDashboard.generalChatWidget.typeMessage',
    defaultMessage: 'Type a message...',
    description: 'Placeholder text for chat input',
  },
  send: {
    id: 'learnerDashboard.generalChatWidget.send',
    defaultMessage: 'Send',
    description: 'Send button text',
  },
  deleteMessage: {
    id: 'learnerDashboard.generalChatWidget.deleteMessage',
    defaultMessage: 'Delete message',
    description: 'Alt text for delete message button',
  },
  deleteConfirm: {
    id: 'learnerDashboard.generalChatWidget.deleteConfirm',
    defaultMessage: 'Are you sure you want to delete this message?',
    description: 'Confirmation message before deleting a message',
  },
  blockUser: {
    id: 'learnerDashboard.generalChatWidget.blockUser',
    defaultMessage: 'Block user',
    description: 'Button text to block a user',
  },
  unblockUser: {
    id: 'learnerDashboard.generalChatWidget.unblockUser',
    defaultMessage: 'Unblock user',
    description: 'Button text to unblock a user',
  },
  blockConfirm: {
    id: 'learnerDashboard.generalChatWidget.blockConfirm',
    defaultMessage: 'Are you sure you want to block this user? All their messages will be deleted.',
    description: 'Confirmation message before blocking a user',
  },
  pinMessage: {
    id: 'learnerDashboard.generalChatWidget.pinMessage',
    defaultMessage: 'Pin message',
    description: 'Button text to pin a message',
  },
  unpinMessage: {
    id: 'learnerDashboard.generalChatWidget.unpinMessage',
    defaultMessage: 'Unpin message',
    description: 'Button text to unpin a message',
  },
  pinnedMessage: {
    id: 'learnerDashboard.generalChatWidget.pinnedMessage',
    defaultMessage: 'Pinned Message',
    description: 'Label for pinned message section',
  },
  addEmoji: {
    id: 'learnerDashboard.generalChatWidget.addEmoji',
    defaultMessage: 'Add emoji',
    description: 'Button text to add emoji',
  },
  blockedError: {
    id: 'learnerDashboard.generalChatWidget.blockedError',
    defaultMessage: 'You have been blocked from the chat. Please contact an administrator.',
    description: 'Error message when blocked user tries to send message',
  },
  firebaseError: {
    id: 'learnerDashboard.generalChatWidget.firebaseError',
    defaultMessage: 'Firebase is not connected. Please check your Firebase configuration.',
    description: 'Error message when Firebase is not initialized',
  },
  blockedUsers: {
    id: 'learnerDashboard.generalChatWidget.blockedUsers',
    defaultMessage: 'Blocked Users',
    description: 'Title for blocked users section',
  },
  noBlockedUsers: {
    id: 'learnerDashboard.generalChatWidget.noBlockedUsers',
    defaultMessage: 'No blocked users',
    description: 'Message when there are no blocked users',
  },
  blockedAt: {
    id: 'learnerDashboard.generalChatWidget.blockedAt',
    defaultMessage: 'Blocked at',
    description: 'Label for blocked timestamp',
  },
  blockedBy: {
    id: 'learnerDashboard.generalChatWidget.blockedBy',
    defaultMessage: 'Blocked by',
    description: 'Label for who blocked the user',
  },
});

export default messages;
