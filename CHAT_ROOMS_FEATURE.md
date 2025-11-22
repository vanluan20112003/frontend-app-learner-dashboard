# Chat Rooms Feature - Multiple Topic-Based Chat Rooms

## 📋 Tổng quan

Tính năng **Multiple Chat Rooms** cho phép users chuyển đổi giữa các phòng chat khác nhau dựa trên chủ đề:

1. **Chung** - Phòng chat tổng quát (mặc định)
2. **Hỏi & Đáp** - Phòng hỏi đáp học tập
3. **Kỹ thuật** - Phòng thảo luận kỹ thuật

## 🎯 Mục đích

- ✅ Tổ chức chat theo chủ đề rõ ràng
- ✅ Tách biệt nội dung chat theo mục đích sử dụng
- ✅ Mỗi phòng có tin nhắn và pinned messages riêng
- ✅ Blocked users và banned words vẫn global (áp dụng cho tất cả phòng)
- ✅ Dễ dàng thêm/xóa phòng chat mới
- ✅ **Backward Compatibility**: Giữ nguyên tất cả messages cũ trong phòng Chung

## 🔄 Backward Compatibility

**Vấn đề:** Trước khi có tính năng rooms, tất cả messages được lưu ở `generalChat/messages`.

**Giải pháp:**
- Phòng "Chung" sử dụng `id: ''` (empty string)
- `getFullDatabasePath('')` trả về `generalChat` thay vì `generalChat/`
- Path messages: `generalChat/messages` (giống cũ)
- Path pinned: `generalChat/pinnedMessage` (giống cũ)
- **Kết quả**: Tất cả messages cũ vẫn hiển thị trong phòng Chung

**Các phòng mới:**
- Hỏi & Đáp: `generalChat/hoidap/messages`
- Kỹ thuật: `generalChat/kithuat/messages`

## 🏗️ Kiến trúc

### 1. Chat Rooms Configuration ([src/services/firebase/chatRooms.js](src/services/firebase/chatRooms.js))

```javascript
export const CHAT_ROOMS = {
  GENERAL: {
    id: '', // Empty string để giữ backward compatibility với chat data cũ
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
```

**Tính năng:**
- Định nghĩa danh sách các phòng chat
- Mỗi phòng có: id, name, description, icon
- Lưu room preference vào localStorage
- Cung cấp functions để get/set current room

**Functions:**
- `getCurrentRoom()` - Lấy room ID hiện tại
- `setCurrentRoom(roomId)` - Chuyển đổi phòng chat
- `getRoomInfo(roomId)` - Lấy thông tin phòng
- `getAllRooms()` - Lấy danh sách tất cả phòng
- `getCurrentRoomInfo()` - Lấy thông tin phòng hiện tại

### 2. Firebase Config Update ([src/services/firebase/config.js](src/services/firebase/config.js))

**Thêm function:**
```javascript
export const getFullDatabasePath = (roomId) => {
  return `${currentDbEnvironment}/${roomId}`;
};
```

**Database Path Structure:**
- Production:
  - `generalChat/messages` - Phòng Chung (legacy path, giữ nguyên data cũ)
  - `generalChat/hoidap/messages` - Phòng Hỏi & Đáp
  - `generalChat/kithuat/messages` - Phòng Kỹ thuật
- Development:
  - `generalChatDev/messages` - Phòng Chung (legacy path)
  - `generalChatDev/hoidap/messages` - Phòng Hỏi & Đáp
  - `generalChatDev/kithuat/messages` - Phòng Kỹ thuật

**Lưu ý quan trọng:**
- Phòng "Chung" sử dụng path cũ (`generalChat/messages`) để giữ nguyên data cũ
- Các phòng mới có room segment trong path (`generalChat/{roomId}/messages`)
- Blocked users và banned words vẫn ở global level (`generalChat/blockedUsers`, `generalChat/bannedWords`)

### 3. Chat Service Update ([src/services/firebase/chatService.js](src/services/firebase/chatService.js))

**Các functions đã được cập nhật để hỗ trợ rooms:**

**Room-Specific (mỗi phòng có data riêng):**
- ✅ `sendMessage()` - Gửi tin nhắn vào phòng hiện tại
- ✅ `deleteMessage()` - Xóa tin nhắn trong phòng hiện tại
- ✅ `subscribeToMessages()` - Subscribe tin nhắn theo phòng
- ✅ `pinMessage()` - Pin tin nhắn trong phòng hiện tại
- ✅ `unpinMessage()` - Unpin tin nhắn trong phòng hiện tại
- ✅ `subscribeToPinnedMessage()` - Subscribe pinned message theo phòng

**Global (áp dụng cho tất cả phòng):**
- ✅ `blockUser()` - Block user và xóa messages ở TẤT CẢ phòng
- ✅ `unblockUser()` - Unblock user (global)
- ✅ `isUserBlocked()` - Check blocked status (global)
- ✅ `getBlockedUsers()` - Get danh sách blocked users (global)
- ✅ `addBannedWord()` - Thêm banned word (global)
- ✅ `removeBannedWord()` - Xóa banned word (global)
- ✅ `getBannedWords()` - Get banned words (global)
- ✅ `subscribeToBannedWords()` - Subscribe banned words (global)

**Pattern sử dụng:**
```javascript
// Room-specific functions
const currentRoom = getCurrentRoom();
const dbPath = getFullDatabasePath(currentRoom);
const messagesRef = ref(database, `${dbPath}/messages`);

// Global functions
const dbPath = getDatabasePath();
const blockedRef = ref(database, `${dbPath}/blockedUsers`);
```

### 4. Room Switcher Component ([src/widgets/GeneralChatWidget/RoomSwitcher.jsx](src/widgets/GeneralChatWidget/RoomSwitcher.jsx))

**UI Component cho việc chuyển đổi phòng chat:**

```jsx
<RoomSwitcher onRoomChange={handleRoomChange} />
```

**Đặc điểm:**
- Hiển thị tên phòng hiện tại với icon
- 3 buttons để switch giữa các phòng
- Active button có màu primary
- Hiển thị description của phòng hiện tại
- Gọi callback khi chuyển phòng

### 5. General Chat Widget Integration ([src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx))

**Changes:**

1. **Import RoomSwitcher:**
```javascript
import RoomSwitcher from './RoomSwitcher';
```

2. **Add state for current room:**
```javascript
const [currentRoom, setCurrentRoom] = useState(null);
```

3. **Add room change handler:**
```javascript
const handleRoomChange = (roomId) => {
  setCurrentRoom(roomId);
  setChatMessages([]);
  setPinnedMessage(null);
};
```

4. **Update useEffect dependencies:**
```javascript
// Re-subscribe when room changes
useEffect(() => {
  // ...subscribe to messages
}, [isChatOpen, currentRoom]);

useEffect(() => {
  // ...subscribe to pinned message
}, [isChatOpen, currentRoom]);
```

5. **Render RoomSwitcher:**
```jsx
{/* Room Switcher - Always Visible */}
<RoomSwitcher onRoomChange={handleRoomChange} />
```

## 🎨 Giao diện

### Room Switcher Card

```
┌─────────────────────────────────────────────────┐
│ 💬 Chung                                        │
│                                                 │
│ [Chung] [Hỏi&Đáp] [Kỹ thuật]                   │
│                                                 │
│ Phòng chat tổng quát                            │
└─────────────────────────────────────────────────┘
```

**Styling:**
- Gradient background (green tones)
- Border: 2px solid green
- Active button: primary variant với green color
- Inactive button: outline variant
- Icons cho mỗi phòng:
  - Chung: Forum icon
  - Hỏi&Đáp: HelpOutline icon
  - Kỹ thuật: Code icon

## 🚀 Cách sử dụng

### User Experience

1. **Mở General Chat Widget**

2. **Chọn phòng chat:**
   - Click "Chung" để vào phòng chat tổng quát
   - Click "Hỏi&Đáp" để vào phòng Q&A
   - Click "Kỹ thuật" để vào phòng kỹ thuật

3. **Khi chuyển phòng:**
   - Tin nhắn cũ bị clear
   - Loading state hiển thị
   - Tin nhắn của phòng mới được load
   - Pinned message của phòng mới hiển thị (nếu có)

4. **Preference được lưu:**
   - Phòng hiện tại lưu vào localStorage
   - Reload page vẫn giữ phòng đã chọn

### Developer: Thêm phòng mới

**Bước 1:** Update [src/services/firebase/chatRooms.js](src/services/firebase/chatRooms.js)

```javascript
export const CHAT_ROOMS = {
  // ... existing rooms
  NEW_ROOM: {
    id: 'newroom',
    name: 'New Room',
    description: 'Description here',
    icon: 'IconName', // Paragon icon name
  },
};
```

**Bước 2:** Import icon trong RoomSwitcher (nếu là icon mới)

```javascript
import { Forum, HelpOutline, Code, IconName } from '@openedx/paragon/icons';

const getIconComponent = (iconName) => {
  switch (iconName) {
    // ... existing cases
    case 'IconName':
      return IconName;
    // ...
  }
};
```

**Bước 3:** Deploy và reload

- Phòng mới sẽ tự động xuất hiện trong RoomSwitcher
- Firebase sẽ tự động tạo path mới khi có message đầu tiên

## 📊 Firebase Database Structure

### Complete Structure

```
generalChat/                          # Production database
├── messages/                        # Phòng Chung (legacy path - giữ data cũ)
│   ├── messageId1/
│   └── messageId2/
├── pinnedMessage/                   # Pinned message cho phòng Chung
├── hoidap/                          # Q&A room
│   ├── messages/
│   └── pinnedMessage/
├── kithuat/                         # Technical room
│   ├── messages/
│   └── pinnedMessage/
├── blockedUsers/                    # Global - shared across ALL rooms
│   └── userId1/
└── bannedWords/                     # Global - shared across ALL rooms
    ├── word1/
    └── word2/

generalChatDev/                      # Development database
├── messages/                        # Phòng Chung (legacy path)
├── pinnedMessage/
├── hoidap/
│   ├── messages/
│   └── pinnedMessage/
├── kithuat/
│   ├── messages/
│   └── pinnedMessage/
├── blockedUsers/                    # Global
└── bannedWords/                     # Global

users/                               # User data for Firebase Rules
└── {firebaseUid}/
    ├── isStaff: boolean
    ├── isAdmin: boolean
    └── ...
```

### Data Structure Example

**Message in Phòng Chung (legacy path):**
```
generalChat/messages/{messageId}:
{
  text: "Hello world",
  userName: "John Doe",
  userId: "user123",
  userRole: "student",
  isStaff: false,
  isAdmin: false,
  timestamp: 1234567890,
  createdAt: "2025-11-22T..."
}
```

**Message in Phòng Hỏi & Đáp:**
```
generalChat/hoidap/messages/{messageId}:
{
  text: "Question here",
  userName: "Student",
  ...
}
```

**Pinned message in Phòng Hỏi & Đáp:**
```
generalChat/hoidap/pinnedMessage:
{
  messageId: "msg123",
  text: "Important announcement",
  userName: "Admin",
  userId: "admin1",
  isStaff: true,
  isAdmin: true,
  pinnedAt: 1234567890,
  pinnedBy: "admin1",
  pinnedByName: "Admin"
}
```

## ⚙️ localStorage Keys

```javascript
// Room preference
localStorage.getItem('firebase_chat_room');
// Values: '' (phòng Chung), 'hoidap', 'kithuat'

// Database environment (dev mode only)
localStorage.getItem('firebase_db_environment');
// Values: 'generalChat', 'generalChatDev'
```

## 🧪 Testing

### Test Case 1: Switch Between Rooms
1. Open chat widget
2. Default room is "Chung"
3. Send a test message
4. Click "Hỏi&Đáp" button
5. ✅ Messages from "Chung" disappear
6. ✅ New empty messages list appears
7. Send another message
8. ✅ Message appears in "Hỏi&Đáp" room
9. Switch back to "Chung"
10. ✅ Original message still there

### Test Case 2: Room Persistence
1. Switch to "Kỹ thuật" room
2. Close browser tab
3. Reopen app
4. Open chat widget
5. ✅ Still in "Kỹ thuật" room

### Test Case 3: Pinned Messages per Room
1. Go to "Chung" room
2. Pin a message (as admin/staff)
3. ✅ Pinned message shows in "Chung"
4. Switch to "Hỏi&Đáp"
5. ✅ No pinned message in "Hỏi&Đáp"
6. Pin different message in "Hỏi&Đáp"
7. Switch back to "Chung"
8. ✅ Original pinned message still there

### Test Case 4: Global Block User
1. User sends messages in all 3 rooms
2. Admin blocks user
3. ✅ User's messages deleted from ALL rooms
4. ✅ User cannot send in ANY room

### Test Case 5: Global Banned Words
1. Admin adds banned word "test"
2. Go to any room
3. Try to send message with "test"
4. ✅ Word is masked with "***" in all rooms

## 🔧 API Functions

### Room Management

```javascript
import {
  CHAT_ROOMS,
  getCurrentRoom,
  setCurrentRoom,
  getRoomInfo,
  getAllRooms,
  getCurrentRoomInfo,
} from 'services/firebase/chatRooms';

// Get current room ID
const roomId = getCurrentRoom(); // 'chung'

// Switch room
setCurrentRoom('hoidap');

// Get room info
const roomInfo = getRoomInfo('kithuat');
// { id: 'kithuat', name: 'Kỹ thuật', ... }

// Get all rooms
const allRooms = getAllRooms();
// [{ id: 'chung', ... }, { id: 'hoidap', ... }, ...]

// Get current room info
const current = getCurrentRoomInfo();
```

### Config Functions

```javascript
import {
  getFullDatabasePath,
  getDatabasePath,
} from 'services/firebase/config';

// Get full path with room
const fullPath = getFullDatabasePath('chung');
// 'generalChat/chung' or 'generalChatDev/chung'

// Get database environment path only
const dbPath = getDatabasePath();
// 'generalChat' or 'generalChatDev'
```

## 🔒 Firebase Rules

Firebase Rules cần được cập nhật để hỗ trợ room structure:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "generalChat": {
      "$roomId": {
        "messages": {
          ".read": true,
          ".indexOn": ["userId", "timestamp"],
          "$messageId": {
            ".write": "!data.exists() || (auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true)"
          }
        },
        "pinnedMessage": {
          ".read": true,
          ".write": "auth != null && (root.child('users').child(auth.uid).child('isStaff').val() === true || root.child('users').child(auth.uid).child('isAdmin').val() === true)"
        }
      },
      "blockedUsers": {
        ".read": "auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true",
        "$userId": {
          ".write": "auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true"
        }
      },
      "bannedWords": {
        ".read": "auth != null",
        "$wordId": {
          ".write": "auth != null && (root.child('users').child(auth.uid).child('isStaff').val() === true || root.child('users').child(auth.uid).child('isAdmin').val() === true)"
        }
      }
    },
    "generalChatDev": {
      "$roomId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "pinnedMessage": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      },
      "blockedUsers": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "bannedWords": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

**Key Points:**
- `$roomId` wildcard để hỗ trợ dynamic rooms
- Blocked users và banned words nằm ngoài rooms (global)
- Messages và pinnedMessage nằm trong rooms (room-specific)

## 🚫 Troubleshooting

### Room không hiển thị messages
**Nguyên nhân:**
- Firebase rules chưa được cập nhật
- Room path không đúng

**Giải pháp:**
- Update Firebase rules với `$roomId` wildcard
- Check console logs để xem database path

### Switch room nhưng vẫn thấy messages cũ
**Nguyên nhân:**
- useEffect dependencies không đúng
- Subscription chưa được cleanup

**Giải pháp:**
- Verify `currentRoom` trong useEffect dependencies
- Check return function cleanup subscription

### Blocked user vẫn send được messages
**Nguyên nhân:**
- blockUser() không xóa messages ở tất cả rooms

**Giải pháp:**
- Verify blockUser() loop qua tất cả CHAT_ROOMS
- Check Firebase Rules cho blockedUsers path

### Pinned message hiển thị sai phòng
**Nguyên nhân:**
- subscribeToPinnedMessage() không re-subscribe khi đổi room

**Giải pháp:**
- Add `currentRoom` vào dependencies của pinned message useEffect

## 📁 Files Created/Modified

### Created Files:
1. **[src/services/firebase/chatRooms.js](src/services/firebase/chatRooms.js)**
   - Room definitions and management functions

2. **[src/widgets/GeneralChatWidget/RoomSwitcher.jsx](src/widgets/GeneralChatWidget/RoomSwitcher.jsx)**
   - Room switcher UI component

3. **[CHAT_ROOMS_FEATURE.md](CHAT_ROOMS_FEATURE.md)**
   - This documentation file

### Modified Files:
1. **[src/services/firebase/config.js](src/services/firebase/config.js)**
   - Added `getFullDatabasePath(roomId)` function

2. **[src/services/firebase/chatService.js](src/services/firebase/chatService.js)**
   - Updated all room-specific functions to use `getFullDatabasePath()`
   - Updated blockUser() to delete messages from all rooms
   - Global functions continue using `getDatabasePath()`

3. **[src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)**
   - Imported RoomSwitcher component
   - Added currentRoom state
   - Added handleRoomChange handler
   - Updated useEffect dependencies to re-subscribe on room change
   - Rendered RoomSwitcher in chat container

4. **[src/widgets/GeneralChatWidget/index.scss](src/widgets/GeneralChatWidget/index.scss)**
   - Added `.room-switcher-card` styles

## 🎯 Benefits

**Tổ chức tốt hơn:**
- Chat được phân loại theo chủ đề
- Dễ tìm kiếm thông tin liên quan

**User Experience:**
- Giao diện rõ ràng, dễ sử dụng
- Chuyển đổi phòng nhanh chóng
- Preference được lưu tự động

**Scalability:**
- Dễ dàng thêm phòng mới
- Không cần thay đổi Firebase Rules nhiều
- Tách biệt rõ ràng giữa room-specific và global data

**Maintainability:**
- Code structure rõ ràng
- Functions được tổ chức theo mục đích
- Documentation đầy đủ

---

## 📝 Summary

**Tính năng Multiple Chat Rooms cho phép:**
- ✅ 3 phòng chat với chủ đề khác nhau
- ✅ Messages và pinned messages riêng cho mỗi phòng
- ✅ Blocked users và banned words global
- ✅ UI thân thiện, dễ chuyển đổi
- ✅ Room preference được lưu tự động
- ✅ Tương thích với Database Switcher (dev mode)
- ✅ Dễ dàng mở rộng thêm phòng mới

**Implemented:** 2025-11-22
**Feature:** Multiple Topic-Based Chat Rooms
