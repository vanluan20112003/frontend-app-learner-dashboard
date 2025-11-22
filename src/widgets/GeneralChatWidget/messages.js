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
  unpinConfirm: {
    id: 'learnerDashboard.generalChatWidget.unpinConfirm',
    defaultMessage: 'Are you sure you want to unpin this message?',
    description: 'Confirmation message before unpinning a message',
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
  // Banned Words Management
  bannedWords: {
    id: 'learnerDashboard.generalChatWidget.bannedWords',
    defaultMessage: 'Banned Words',
    description: 'Title for banned words section',
  },
  addBannedWord: {
    id: 'learnerDashboard.generalChatWidget.addBannedWord',
    defaultMessage: 'Add Banned Word/Phrase',
    description: 'Label for adding banned word',
  },
  enterWordOrPhrase: {
    id: 'learnerDashboard.generalChatWidget.enterWordOrPhrase',
    defaultMessage: 'Enter word or phrase...',
    description: 'Placeholder for banned word input',
  },
  add: {
    id: 'learnerDashboard.generalChatWidget.add',
    defaultMessage: 'Add',
    description: 'Add button text',
  },
  currentBannedWords: {
    id: 'learnerDashboard.generalChatWidget.currentBannedWords',
    defaultMessage: 'Current Banned Words',
    description: 'Label for banned words list',
  },
  noBannedWords: {
    id: 'learnerDashboard.generalChatWidget.noBannedWords',
    defaultMessage: 'No banned words',
    description: 'Message when there are no banned words',
  },
  removeWord: {
    id: 'learnerDashboard.generalChatWidget.removeWord',
    defaultMessage: 'Remove word',
    description: 'Alt text for remove word button',
  },
  bannedWordAdded: {
    id: 'learnerDashboard.generalChatWidget.bannedWordAdded',
    defaultMessage: 'Banned word added successfully',
    description: 'Success message after adding banned word',
  },
  bannedWordRemoved: {
    id: 'learnerDashboard.generalChatWidget.bannedWordRemoved',
    defaultMessage: 'Banned word removed successfully',
    description: 'Success message after removing banned word',
  },
  bannedWordsInfo: {
    id: 'learnerDashboard.generalChatWidget.bannedWordsInfo',
    defaultMessage: 'Users who use banned words 5 times in one day will be automatically banned for 24 hours.',
    description: 'Information about banned words auto-ban policy',
  },
  // User Ban Management
  bannedUsersManagement: {
    id: 'learnerDashboard.generalChatWidget.bannedUsersManagement',
    defaultMessage: 'Banned Users Management',
    description: 'Title for banned users management section',
  },
  noBannedUsers: {
    id: 'learnerDashboard.generalChatWidget.noBannedUsers',
    defaultMessage: 'No banned users',
    description: 'Message when there are no banned users',
  },
  banUserTitle: {
    id: 'learnerDashboard.generalChatWidget.banUserTitle',
    defaultMessage: 'Ban User',
    description: 'Title for ban user modal',
  },
  user: {
    id: 'learnerDashboard.generalChatWidget.user',
    defaultMessage: 'User',
    description: 'Label for user',
  },
  banDuration: {
    id: 'learnerDashboard.generalChatWidget.banDuration',
    defaultMessage: 'Ban Duration',
    description: 'Label for ban duration',
  },
  oneHour: {
    id: 'learnerDashboard.generalChatWidget.oneHour',
    defaultMessage: '1 Hour',
    description: 'Ban duration option: 1 hour',
  },
  oneDay: {
    id: 'learnerDashboard.generalChatWidget.oneDay',
    defaultMessage: '1 Day (24 hours)',
    description: 'Ban duration option: 1 day',
  },
  oneWeek: {
    id: 'learnerDashboard.generalChatWidget.oneWeek',
    defaultMessage: '1 Week (7 days)',
    description: 'Ban duration option: 1 week',
  },
  permanent: {
    id: 'learnerDashboard.generalChatWidget.permanent',
    defaultMessage: 'Permanent',
    description: 'Ban duration option: permanent',
  },
  reason: {
    id: 'learnerDashboard.generalChatWidget.reason',
    defaultMessage: 'Reason',
    description: 'Label for ban reason',
  },
  optional: {
    id: 'learnerDashboard.generalChatWidget.optional',
    defaultMessage: 'optional',
    description: 'Label for optional field',
  },
  enterBanReason: {
    id: 'learnerDashboard.generalChatWidget.enterBanReason',
    defaultMessage: 'Enter reason for ban...',
    description: 'Placeholder for ban reason input',
  },
  cancel: {
    id: 'learnerDashboard.generalChatWidget.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button text',
  },
  banUser: {
    id: 'learnerDashboard.generalChatWidget.banUser',
    defaultMessage: 'Ban User',
    description: 'Ban user button text',
  },
  banning: {
    id: 'learnerDashboard.generalChatWidget.banning',
    defaultMessage: 'Banning...',
    description: 'Banning in progress text',
  },
  userBanned: {
    id: 'learnerDashboard.generalChatWidget.userBanned',
    defaultMessage: 'User banned successfully',
    description: 'Success message after banning user',
  },
  userUnbanned: {
    id: 'learnerDashboard.generalChatWidget.userUnbanned',
    defaultMessage: 'User unbanned successfully',
    description: 'Success message after unbanning user',
  },
  unbanUser: {
    id: 'learnerDashboard.generalChatWidget.unbanUser',
    defaultMessage: 'Unban user',
    description: 'Unban user button text',
  },
  duration: {
    id: 'learnerDashboard.generalChatWidget.duration',
    defaultMessage: 'Duration',
    description: 'Label for duration',
  },
  expired: {
    id: 'learnerDashboard.generalChatWidget.expired',
    defaultMessage: 'Expired',
    description: 'Label for expired ban',
  },
  days: {
    id: 'learnerDashboard.generalChatWidget.days',
    defaultMessage: 'days',
    description: 'Label for days',
  },
  hours: {
    id: 'learnerDashboard.generalChatWidget.hours',
    defaultMessage: 'hours',
    description: 'Label for hours',
  },
  banManagementInfo: {
    id: 'learnerDashboard.generalChatWidget.banManagementInfo',
    defaultMessage: 'Bans with expiry times will automatically be removed when expired. Click the delete icon to manually unban a user.',
    description: 'Information about ban management',
  },
  // Violations
  violationWarning: {
    id: 'learnerDashboard.generalChatWidget.violationWarning',
    defaultMessage: 'Warning: Your message contains banned words. Violation {count}/5 today.',
    description: 'Warning message for banned word violation',
  },
  autoBanWarning: {
    id: 'learnerDashboard.generalChatWidget.autoBanWarning',
    defaultMessage: 'You have been automatically banned for 24 hours due to repeated use of banned words.',
    description: 'Warning message for auto-ban',
  },
  bannedWordDetected: {
    id: 'learnerDashboard.generalChatWidget.bannedWordDetected',
    defaultMessage: 'Your message contains banned words and has been filtered.',
    description: 'Alert message when banned word is detected',
  },
  // User Info
  viewUserInfo: {
    id: 'learnerDashboard.generalChatWidget.viewUserInfo',
    defaultMessage: 'View User Info',
    description: 'Button text to view user information',
  },
  userInformation: {
    id: 'learnerDashboard.generalChatWidget.userInformation',
    defaultMessage: 'User Information',
    description: 'Title for user information modal',
  },
  username: {
    id: 'learnerDashboard.generalChatWidget.username',
    defaultMessage: 'Username',
    description: 'Label for username field',
  },
  role: {
    id: 'learnerDashboard.generalChatWidget.role',
    defaultMessage: 'Role',
    description: 'Label for user role field',
  },
  close: {
    id: 'learnerDashboard.generalChatWidget.close',
    defaultMessage: 'Close',
    description: 'Close button text',
  },
});

export default messages;
