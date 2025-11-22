# Firebase Chat Setup Guide

## Overview
This document explains how to set up and configure Firebase Realtime Database for the General Chat Widget in the Learner Dashboard.

## Prerequisites
- Firebase project: `open-edx-14c95`
- Firebase Realtime Database enabled

## Firebase Realtime Database Rules

To enable the chat functionality, you need to set up the correct security rules in Firebase Console:

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select project: **open edx** (open-edx-14c95)
3. Go to **Realtime Database** from the left menu
4. Click on the **Rules** tab

### Step 2: Update Database Rules

Replace the existing rules with the following configuration:

```json
{
  "rules": {
    "generalChat": {
      "messages": {
        ".read": true,
        ".write": true,
        "$messageId": {
          ".validate": "newData.hasChildren(['text', 'userName', 'userId', 'timestamp'])",
          "text": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 500"
          },
          "userName": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 100"
          },
          "userId": {
            ".validate": "newData.isString() && newData.val().length > 0"
          },
          "timestamp": {
            ".validate": "newData.val() === now || newData.isString()"
          },
          "createdAt": {
            ".validate": "newData.isString()"
          },
          "$other": {
            ".validate": false
          }
        }
      }
    }
  }
}
```

### Step 3: Publish Rules
Click the **Publish** button to save and activate the rules.

## Database Structure

The chat messages are stored in the following structure:

```
generalChat/
  messages/
    -N1234567890ABC/
      text: "Hello, world!"
      userName: "Guest 123"
      userId: "guest_abc123xyz"
      timestamp: 1699123456789
      createdAt: "2025-11-02T03:00:00.000Z"
    -N1234567890DEF/
      text: "How are you?"
      userName: "Guest 456"
      userId: "guest_def456uvw"
      timestamp: 1699123460000
      createdAt: "2025-11-02T03:01:00.000Z"
```

## Security Considerations

### Current Implementation (Development)
- **Read**: Open (anyone can read messages)
- **Write**: Open (anyone can write messages)
- **Validation**: Basic field validation and message length limits

### Recommended for Production

For production environments, you should implement proper authentication:

```json
{
  "rules": {
    "generalChat": {
      "messages": {
        ".read": "auth != null",
        ".write": "auth != null",
        "$messageId": {
          ".validate": "newData.hasChildren(['text', 'userName', 'userId', 'timestamp']) && newData.child('userId').val() === auth.uid",
          "userId": {
            ".validate": "newData.val() === auth.uid"
          },
          "text": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 500"
          },
          "userName": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 100"
          },
          "timestamp": {
            ".validate": "newData.val() === now"
          },
          "createdAt": {
            ".validate": "newData.isString()"
          },
          "$other": {
            ".validate": false
          }
        }
      }
    }
  }
}
```

## Integration with OpenEdX Authentication

To integrate with OpenEdX user authentication, update the `getCurrentUser()` function in:
**File**: `src/services/firebase/chatService.js`

```javascript
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

export const getCurrentUser = () => {
  // Get authenticated user from OpenEdX
  const authenticatedUser = getAuthenticatedUser();

  if (authenticatedUser && authenticatedUser.username) {
    return {
      id: authenticatedUser.username,
      name: authenticatedUser.name || authenticatedUser.username,
    };
  }

  // Fallback to guest user
  let user = localStorage.getItem('chatUser');
  if (!user) {
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    const guestName = `Guest ${Math.floor(Math.random() * 1000)}`;
    user = JSON.stringify({ id: guestId, name: guestName });
    localStorage.setItem('chatUser', user);
  }

  return JSON.parse(user);
};
```

## Features

### Real-time Messaging
- Messages are synchronized in real-time across all users
- Auto-scroll to latest message
- Message timestamps with relative time display

### User Experience
- Expandable/collapsible widget
- Loading states
- Message sending feedback
- Keyboard shortcuts (Enter to send)

### Message Display
- Different styling for own messages vs others
- User names and timestamps
- Message text with word wrap

## File Structure

```
src/
├── services/
│   └── firebase/
│       ├── config.js          # Firebase initialization
│       └── chatService.js     # Chat service functions
└── widgets/
    └── GeneralChatWidget/
        ├── index.jsx          # Main component
        ├── index.scss         # Styles
        ├── messages.js        # i18n messages
        └── index.test.jsx     # Tests
```

## Testing

The chat widget can be tested by:

1. Opening the dashboard in two different browsers or incognito windows
2. Opening the General Chat widget in both
3. Sending messages from one browser
4. Verifying they appear in real-time in the other browser

## Troubleshooting

### Messages not appearing
- Check Firebase Console to verify database rules are published
- Check browser console for Firebase connection errors
- Verify the database URL in `src/services/firebase/config.js`

### Permission denied errors
- Ensure database rules allow read/write access
- Check that the Firebase project is active

### Messages not sending
- Check network connectivity
- Verify Firebase SDK is installed: `npm list firebase`
- Check browser console for errors

## Future Enhancements

- [ ] User authentication integration with OpenEdX
- [ ] Message reactions (like, emoji)
- [ ] Message editing and deletion
- [ ] User typing indicators
- [ ] Message read receipts
- [ ] File/image sharing
- [ ] Chat moderation tools
- [ ] Private messaging
- [ ] Chat rooms/channels
