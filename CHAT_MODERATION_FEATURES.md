# Chat Moderation Features Documentation

## Overview
This document describes the new chat moderation features added to the General Chat Widget, including banned words filtering, automatic violation tracking, and advanced user ban management.

## Features

### 1. Banned Words Management

#### For Admin/Staff Only
Administrators and staff members can manage a list of banned words or phrases that will be automatically filtered from chat messages.

#### How It Works:
- **Add Banned Words**: Admin/Staff can add words or phrases to the banned list
- **Auto-Masking**: When a user types a banned word, it's automatically replaced with asterisks (*)
- **Case-Insensitive**: Matching is case-insensitive (e.g., "badword" matches "BadWord")
- **Phrase Support**: Can ban entire phrases, not just single words

#### UI Location:
- Expandable "Banned Words" section in the chat widget (Admin/Staff only)
- Yellow warning color theme
- Shows count of banned words

#### Firebase Structure:
```
generalChat/
  bannedWords/
    {wordId}/
      word: "badword"
      addedBy: "admin123"
      addedByName: "Admin Name"
      addedAt: "2025-11-04T10:00:00.000Z"
```

### 2. Automatic Violation Tracking

#### Violation System:
- Tracks banned word usage per user per day
- Violations reset daily (new day = fresh start)
- Warning messages show violation count: "Violation 3/5 today"

#### Auto-Ban Trigger:
- **Threshold**: 5 violations in one day
- **Automatic Action**: User is banned for 24 hours
- **Notification**: User receives immediate notification of the ban

#### Firebase Structure:
```
generalChat/
  violations/
    {userId}/
      {date (YYYY-MM-DD)}/
        {violationId}/
          words: ["badword1", "badword2"]
          timestamp: "2025-11-04T10:00:00.000Z"
```

### 3. Enhanced User Ban Management

#### Ban Duration Options:
Admin/Staff can ban users with flexible time options:
- **1 Hour**: Short-term cooling off period
- **1 Day (24 hours)**: Standard ban for minor violations
- **1 Week (7 days)**: Longer ban for repeated offenses
- **Permanent**: No expiry, requires manual unban

#### Ban Features:
- **Reason Field**: Optional field to document why user was banned
- **Auto-Expiry**: Timed bans automatically expire and unban the user
- **Manual Unban**: Admin/Staff can manually unban at any time
- **Ban Info Display**: Shows remaining time and reason for ban

#### UI Components:
1. **User Ban Manager**:
   - Expandable section showing all banned users
   - Displays ban duration, reason, and who banned them
   - Shows "Expired" badge for expired bans
   - One-click unban button

2. **Ban User Modal**:
   - Accessible from message dropdown menu
   - Select ban duration from dropdown
   - Optional reason text field
   - Confirmation required

#### Firebase Structure:
```
generalChat/
  bannedUsers/
    {userId}/
      userId: "user123"
      userName: "User Name"
      bannedAt: "2025-11-04T10:00:00.000Z"
      bannedBy: "admin123"
      bannedByName: "Admin Name"
      reason: "Repeated use of banned words"
      duration: "day" | "hour" | "week" | "permanent"
      expiresAt: "2025-11-05T10:00:00.000Z" | null
```

### 4. User Experience

#### For Regular Users:
1. **Message Blocked**: If message contains banned words, it's not sent
2. **Violation Warning**: Alert shows: "Your message contains banned words. Violation X/5 today."
3. **Auto-Ban Notification**: After 5 violations: "You have been automatically banned for 24 hours..."
4. **Ban Alert**: Banned users see a red alert with ban details when trying to chat

#### For Admin/Staff:
1. **Banned Words Manager**: Quick add/remove interface for banned words
2. **User Ban Manager**: View all banned users with expiry times
3. **Quick Ban**: Ban users directly from message dropdown
4. **Flexible Duration**: Choose ban duration based on severity
5. **Ban History**: See who banned a user and when

## How to Use

### Setting Up Banned Words:

1. Open General Chat Widget
2. Locate "Banned Words" section (Admin/Staff only)
3. Click to expand
4. Type word or phrase in input field
5. Click "Add" button
6. Word appears in the list with delete button
7. To remove: Click the X button on any word badge

### Banning a User:

**Method 1: From Message**
1. Find a message from the user
2. Click the three-dot menu icon
3. Select "Ban User"
4. Choose ban duration
5. (Optional) Enter reason
6. Click "Ban User" button

**Method 2: Manual Ban**
1. Use the custom ban function in the system
2. Specify userId, userName, and duration

### Unbanning a User:

1. Open "Banned Users Management" section
2. Find the user in the list
3. Click the delete icon next to their name
4. User is immediately unbanned

### Checking Ban Status:

- Active bans show time remaining
- Expired bans show "Expired" badge
- Permanent bans show "Permanent"
- Hover over ban info to see full details

## Admin Tips

### Best Practices:
1. **Start Small**: Begin with obvious offensive words
2. **Be Specific**: Use exact phrases when possible
3. **Monitor Violations**: Check violation counts regularly
4. **Document Bans**: Always add a reason when banning
5. **Use Graduated Responses**:
   - 1st offense: Warning (automatic)
   - 5th offense in a day: Auto-ban 24 hours
   - Repeated offenses: Longer manual bans
   - Severe violations: Permanent ban

### Common Banned Word Categories:
- Profanity and offensive language
- Hate speech and slurs
- Spam phrases
- Inappropriate content
- Personal attacks

## Technical Details

### Service Functions:

**Banned Words:**
- `addBannedWord(word, user)` - Add a word to banned list
- `removeBannedWord(wordId, user)` - Remove a banned word
- `getBannedWords()` - Get all banned words
- `subscribeToBannedWords(callback)` - Real-time updates
- `checkAndMaskBannedWords(text, bannedWords)` - Check and mask text

**Violations:**
- `trackViolation(userId, words)` - Track a violation
- `getViolationCount(userId)` - Get today's violation count

**Bans:**
- `banUserWithDuration(userId, userName, user, duration, reason)` - Ban a user
- `checkBanExpiry(userId)` - Check if ban has expired
- `getBanInfo(userId)` - Get ban details
- `getBannedUsersWithInfo()` - Get all banned users
- `unblockUser(userId, user)` - Unban a user

### Component Files:
- `BannedWordsManager.jsx` - UI for managing banned words
- `UserBanManager.jsx` - UI for managing user bans
- `chatService.js` - All backend service functions
- `messages.js` - Internationalization strings
- `index.scss` - Styling for new components

## Firebase Database Rules

Add these paths to your Firebase Realtime Database rules:

```json
{
  "rules": {
    "generalChat": {
      "messages": {
        ".read": true,
        ".write": true,
        "$messageId": {
          ".validate": "newData.hasChildren(['text', 'userName', 'userId', 'timestamp'])"
        }
      },
      "bannedWords": {
        ".read": true,
        ".write": "auth != null"
      },
      "bannedUsers": {
        ".read": true,
        ".write": "auth != null"
      },
      "violations": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "pinnedMessage": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

## Future Enhancements

Potential improvements:
- [ ] Export ban/violation history
- [ ] Configurable auto-ban threshold (currently 5 violations)
- [ ] Email notifications for bans
- [ ] Appeal system for banned users
- [ ] Word pattern matching (regex support)
- [ ] Whitelist for false positives
- [ ] Moderation logs and audit trail
- [ ] User reputation scores
- [ ] Temporary mute (can read but not write)
- [ ] IP-based bans

## Troubleshooting

### Issue: Banned words not filtering
- Check that bannedWords state is populated
- Verify Firebase connection
- Check browser console for errors

### Issue: Auto-ban not triggering
- Verify violation count reaches 5
- Check that date is correctly formatted (YYYY-MM-DD)
- Ensure banUserWithDuration function is working

### Issue: Bans not expiring
- Check system time is correct
- Verify expiresAt timestamp format
- Ban expiry is checked every minute

### Issue: Admin can't add banned words
- Verify user has isStaff or isAdmin flag
- Check Firebase write permissions
- Ensure user is authenticated

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firebase connection and rules
3. Check that user roles (isStaff/isAdmin) are set correctly
4. Review this documentation

## Version History

- **v1.0** (2025-11-04): Initial release
  - Banned words management
  - Violation tracking (5/day threshold)
  - Auto-ban system (24 hours)
  - Manual ban with duration options
  - Ban expiry system
