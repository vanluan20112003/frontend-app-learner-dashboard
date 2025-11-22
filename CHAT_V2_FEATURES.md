# Chat Widget V2 - New Features Documentation

## ✨ New Features Implemented

### 1. 🔐 Real User Authentication Integration

**API Endpoint:** `{LMS_BASE_URL}/api/custom/v1/users/me/`

**Features:**
- Fetches real user info from OpenEdX API
- Displays user's full name instead of guest ID
- Shows role badges (Admin/Staff/Student)
- Requires login to send messages

**User Roles:**
- **👑 Admin** (`is_superuser: true`) - Gold highlighted messages
- **⭐ Staff** (`is_staff: true`) - Blue highlighted messages
- **Student** - Standard messages

### 2. 🎨 Role-Based Message Styling

#### Admin Messages
- **Background:** Gold gradient (`#fff3cd` to `#fff8e1`)
- **Border:** 2px solid gold (`#ffc107`)
- **Shadow:** Elevated with gold glow
- **Badge:** `👑 ADMIN` in orange
- **Most prominent** in chat

#### Staff Messages
- **Background:** Blue gradient (`#e3f2fd` to `#f0f7ff`)
- **Border:** 1px solid light blue (`#90caf9`)
- **Badge:** `⭐ STAFF` in blue
- **Slightly highlighted**

#### Student Messages
- **Own messages:** Primary color gradient
- **Other messages:** Light gray background
- **No badge**

### 3. 🗑️ Message Deletion (Admin/Staff Only)

**Who can delete:**
- Admins (`is_superuser: true`)
- Staff (`is_staff: true`)

**How it works:**
- Delete button appears on hover (for staff/admin only)
- Confirmation dialog before deletion
- Real-time removal from all clients
- Permission checked on both client and Firebase rules

**UI:**
- Delete icon button in top-right of each message
- Only visible on hover
- Only visible to staff/admin users

### 4. 💾 Session State Persistence

**What's saved:**
- Chat open/closed state
- Widget expanded/collapsed state

**Storage:** `sessionStorage` (persists across page reloads, clears on browser close)

**Keys:**
- `chatWidgetOpen`: boolean
- `chatWidgetExpanded`: boolean

**Default behavior:**
- Widget: Expanded
- Chat: Closed (to avoid distraction)

### 5. ⚡ Improved UX/UI

#### Message Display
- Smooth hover effects
- Box shadows for depth
- Gradient backgrounds
- Role badges with icons
- Better spacing and padding
- Improved typography

#### Chat Container
- Smoother animations
- Better loading states
- Auth error alerts
- Login prompt for unauthenticated users

#### Input Field
- Disabled when not logged in
- Shows "Please login to send messages" placeholder
- Better visual feedback

### 6. 🔒 Authentication Checks

**Before sending message:**
1. Check if user is loaded
2. Check if user is authenticated
3. Show alert if not logged in
4. Prevent message send

**Visual indicators:**
- Input disabled when not authenticated
- Button disabled when not authenticated
- Alert banner showing auth status
- Helpful placeholder text

## 📋 API Response Structure

```javascript
{
  success: true,
  data: {
    id: 4,
    username: "levanluan_8",
    email: "levanluan20112003@gmail.com",
    first_name: "vănluân",
    last_name: "lê",
    full_name: "vănluân lê",
    is_active: true,
    is_staff: true,
    is_superuser: true,
    profile: {
      name: "vănluân lê",
      gender: "",
      // ... other profile fields
    }
  }
}
```

## 🔥 Firebase Database Structure

```json
{
  "generalChat": {
    "messages": {
      "-N1234567890ABC": {
        "text": "Hello everyone!",
        "userName": "vănluân lê",
        "userId": "levanluan_8",
        "userRole": "admin",
        "isStaff": true,
        "isAdmin": true,
        "timestamp": 1699123456789,
        "createdAt": "2025-11-02T03:00:00.000Z"
      }
    }
  }
}
```

## 🎯 CSS Classes

### Message Classes
- `.chat-message` - Base class
- `.own-message` - User's own messages
- `.other-message` - Others' messages
- `.admin-message` - Admin messages (gold)
- `.staff-message` - Staff messages (blue)

### Role Badge
- `.role-badge` - Badge styling
- Admin: Orange background
- Staff: Blue background

### Actions
- `.message-actions` - Delete button container
- Opacity 0 by default
- Opacity 1 on hover

## 🚀 Usage Examples

### For Students
1. Login to OpenEdX
2. Navigate to dashboard
3. Chat widget loads with your name
4. Send messages
5. See admin/staff messages highlighted

### For Staff
1. Login with staff account
2. Chat shows `⭐ STAFF` badge
3. Can see messages
4. Can delete messages (hover to see delete button)
5. Messages appear blue-highlighted

### For Admins
1. Login with admin account
2. Chat shows `👑 ADMIN` badge
3. Can delete any message
4. Messages appear gold-highlighted
5. Most prominent in chat

## 📁 New Files Created

1. **src/services/userService.js**
   - `getCurrentUserInfo()` - Fetch user from API
   - `getUserDisplayName()` - Get display name with role badge

2. **src/services/firebase/chatService.js** (Updated)
   - `sendMessage()` - Now accepts user object
   - `deleteMessage()` - New function for admin/staff

3. **src/widgets/GeneralChatWidget/index.jsx** (V2)
   - Complete rewrite with all new features
   - Session storage integration
   - Auth checks
   - Role-based rendering

4. **src/widgets/GeneralChatWidget/index.scss** (Updated)
   - Role-based styling
   - Admin/staff message styles
   - Better animations
   - Delete button styling

5. **FIREBASE_RULES_V2.json**
   - Updated rules with delete permissions
   - Role validation

## ⚙️ Configuration

### Environment Variables Required
```javascript
LMS_BASE_URL=http://localhost:18000  // Your OpenEdX LMS URL
```

### Firebase Rules Update
Use the rules from `FIREBASE_RULES_V2.json` for better security and delete permissions.

**Note:** For now, using simplified rules for testing. Update to V2 rules when ready for production.

## 🐛 Troubleshooting

### "Please login to send messages"
- User is not authenticated
- Check if API endpoint is accessible
- Verify LMS_BASE_URL is correct

### User info not loading
- Check browser console for errors
- Verify API endpoint: `{LMS_BASE_URL}/api/custom/v1/users/me/`
- Check CORS settings

### Delete button not showing
- Only visible to staff/admin
- Check user role in API response
- Hover over messages to see button

### Messages not styled by role
- Check Firebase message has `isStaff`/`isAdmin` fields
- Verify CSS is loaded
- Check browser console for errors

## 🎨 Color Scheme

### Admin
- Primary: `#ffc107` (Amber)
- Secondary: `#ff9800` (Orange)
- Text: `#f57c00` (Dark Orange)

### Staff
- Primary: `#2196f3` (Blue)
- Secondary: `#90caf9` (Light Blue)
- Text: `#1976d2` (Dark Blue)

### Student
- Own: Primary theme color
- Other: Light gray

## 📊 Performance

- **User API call:** Once on widget mount
- **Firebase subscription:** Active only when chat is open
- **Session storage:** Minimal overhead
- **Re-renders:** Optimized with React hooks

## 🔒 Security

### Client-side
- Auth check before sending
- Role check before deleting
- Input validation

### Firebase Rules
- Read: Public (for now)
- Write: Anyone can create, staff can delete
- Validation: All required fields checked

## 🚧 Future Enhancements

- [ ] Private messaging
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/image upload
- [ ] Message search
- [ ] User mentions (@username)
- [ ] Message formatting (bold, italic)
- [ ] Chat rooms/channels
- [ ] Moderation tools

---

**Version:** 2.0
**Last Updated:** 2025-11-02
**Author:** Claude Code
