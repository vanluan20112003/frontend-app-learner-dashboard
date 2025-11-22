# Chat Room Notifications - Unread Badge Feature

## 📋 Tổng quan

Tính năng **Room Notifications** hiển thị badge đỏ (tâm đỏ) trên các tab phòng chat khi có tin nhắn mới chưa xem. Tính năng này chỉ dành cho **Admin và Staff**.

## 🎯 Mục đích

- ✅ Thông báo realtime khi có tin nhắn mới ở phòng khác
- ✅ Hiển thị số lượng tin nhắn chưa xem
- ✅ Chỉ Admin/Staff mới thấy notifications
- ✅ Badge đỏ nổi bật với animation
- ✅ Auto-reset khi vào phòng
- ✅ Track last visited time cho mỗi phòng

## 🏗️ Kiến trúc

### 1. Room Notifications Utility

**File:** [src/services/firebase/roomNotifications.js](src/services/firebase/roomNotifications.js)

**Functions:**

```javascript
// Get last visited timestamp for a room
export const getLastVisitedTime = (roomId) => {
  const key = `chat_room_last_visited_${roomId}`;
  const timestamp = localStorage.getItem(key);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

// Update last visited timestamp (to current time)
export const updateLastVisitedTime = (roomId) => {
  const key = `chat_room_last_visited_${roomId}`;
  localStorage.setItem(key, Date.now().toString());
};

// Count unread messages
export const countUnreadMessages = (messages, lastVisitedTime) => {
  if (!messages || !Array.isArray(messages)) {
    return 0;
  }

  if (!lastVisitedTime || lastVisitedTime === 0) {
    // Never visited, count all messages
    return messages.length;
  }

  return messages.filter((msg) => {
    const messageTime = msg.timestamp || new Date(msg.createdAt).getTime();
    return messageTime > lastVisitedTime;
  }).length;
};
```

**localStorage Keys:**
- `chat_room_last_visited_` - Prefix cho timestamp
- `chat_room_last_visited_hoidap` - Last visited cho phòng Hỏi&Đáp
- `chat_room_last_visited_kithuat` - Last visited cho phòng Kỹ thuật

### 2. Subscribe to Room Messages

**File:** [src/services/firebase/chatService.js:90-141](src/services/firebase/chatService.js#L90-L141)

**New Function:**
```javascript
export const subscribeToRoomMessages = async (roomId, callback, limit = 50) => {
  try {
    const database = await getFirebaseDatabase();
    if (!database) {
      callback([]);
      return () => {};
    }

    const { ref, onValue, off, query, orderByChild, limitToLast } =
      await import('firebase/database');

    const dbPath = getFullDatabasePath(roomId);
    const messagesRef = ref(database, `${dbPath}/messages`);
    const messagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      limitToLast(limit)
    );

    const handleMessages = (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      messages.sort((a, b) => {
        const timeA = a.timestamp || new Date(a.createdAt).getTime();
        const timeB = b.timestamp || new Date(b.createdAt).getTime();
        return timeA - timeB;
      });

      callback(messages);
    };

    onValue(messagesQuery, handleMessages);

    // Return unsubscribe function
    return () => off(messagesQuery, 'value', handleMessages);
  } catch (error) {
    console.error(`Error setting up subscription for room ${roomId}:`, error);
    callback([]);
    return () => {};
  }
};
```

**Chức năng:**
- Subscribe tin nhắn của một phòng cụ thể
- Realtime updates qua Firebase onValue
- Return unsubscribe function để cleanup

### 3. State Management

**File:** [src/widgets/GeneralChatWidget/index.jsx:71-75](src/widgets/GeneralChatWidget/index.jsx#L71-L75)

**State:**
```javascript
const [unreadCounts, setUnreadCounts] = useState({});
const roomSubscriptionsRef = useRef({});
```

**unreadCounts Structure:**
```javascript
{
  '': 0,          // Phòng Chung
  'hoidap': 5,    // Phòng Hỏi&Đáp có 5 tin nhắn mới
  'kithuat': 2,   // Phòng Kỹ thuật có 2 tin nhắn mới
}
```

### 4. Subscribe All Rooms Effect

**File:** [src/widgets/GeneralChatWidget/index.jsx:208-259](src/widgets/GeneralChatWidget/index.jsx#L208-L259)

**useEffect:**
```javascript
useEffect(() => {
  if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
    return undefined;
  }

  if (!isChatOpen) {
    return undefined;
  }

  const setupRoomSubscriptions = async () => {
    const rooms = Object.values(CHAT_ROOMS);

    for (const room of rooms) {
      const { id: roomId } = room;

      // Skip current room (already subscribed)
      if (roomId === currentRoom) {
        continue;
      }

      // Subscribe to this room's messages
      const unsubscribe = await subscribeToRoomMessages(roomId, (messages) => {
        const lastVisited = getLastVisitedTime(roomId);
        const unreadCount = countUnreadMessages(messages, lastVisited);

        setUnreadCounts((prev) => ({
          ...prev,
          [roomId]: unreadCount,
        }));
      }, 100); // Get 100 messages to count properly

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
```

**Logic:**
1. Chỉ chạy cho Admin/Staff
2. Subscribe tất cả phòng NGOẠI TRỪ phòng hiện tại
3. Mỗi khi có tin nhắn mới → Đếm số tin chưa xem
4. Update unreadCounts state
5. Cleanup subscriptions khi unmount

### 5. Update Last Visited Time Effect

**File:** [src/widgets/GeneralChatWidget/index.jsx:261-271](src/widgets/GeneralChatWidget/index.jsx#L261-L271)

**useEffect:**
```javascript
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
```

**Logic:**
- Khi chuyển phòng → Update localStorage timestamp
- Reset unread count về 0 cho phòng hiện tại

### 6. RoomSwitcher Component Update

**File:** [src/widgets/GeneralChatWidget/RoomSwitcher.jsx:20](src/widgets/GeneralChatWidget/RoomSwitcher.jsx#L20)

**Props:**
```javascript
const RoomSwitcher = ({
  onRoomChange,
  unreadCounts = {},
  isStaffOrAdmin = false
}) => {
  // ...
};
```

**Badge Display Logic:**
```javascript
{Object.values(CHAT_ROOMS).map((room) => {
  const IconComponent = getIconComponent(room.icon);
  const isActive = currentRoomId === room.id;
  const unreadCount = unreadCounts[room.id] || 0;
  const showBadge = isStaffOrAdmin && !isActive && unreadCount > 0;

  return (
    <Button
      key={room.id}
      variant={isActive ? 'primary' : 'outline-primary'}
      className="flex-fill room-button-with-badge"
    >
      <div className="d-flex align-items-center justify-content-center position-relative">
        <Icon src={IconComponent} className="mr-1" />
        <span>{room.name}</span>
        {showBadge && (
          <span className="unread-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Button>
  );
})}
```

**Conditions:**
- `isStaffOrAdmin` - Chỉ Admin/Staff mới thấy
- `!isActive` - Không hiển thị badge cho phòng hiện tại
- `unreadCount > 0` - Có tin nhắn mới

### 7. CSS Styling

**File:** [src/widgets/GeneralChatWidget/index.scss:94-129](src/widgets/GeneralChatWidget/index.scss#L94-L129)

**Badge Styles:**
```scss
// Unread badge for admin/staff
&.room-button-with-badge {
  position: relative;

  .unread-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #dc3545;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.15rem 0.35rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    line-height: 1;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.4);
    animation: pulse-badge 2s ease-in-out infinite;
  }
}

// Badge animation
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}
```

**Visual Features:**
- **Color:** Red (#dc3545) - Nổi bật
- **Position:** Top-right corner của button
- **Shape:** Circular badge (border-radius: 10px)
- **Animation:** Pulse effect (scale + opacity)
- **Shadow:** Drop shadow để nổi bật
- **Max Display:** 99+ nếu > 99 tin nhắn

## 🎨 User Experience

### Workflow cho Admin/Staff

**Scenario 1: User ở phòng Chung, có tin mới ở Hỏi&Đáp**

```
┌─────────────────────────────────────┐
│ Room Switcher:                      │
│ ┌─────────────────────────────────┐ │
│ │ [Chung ✓] [Hỏi&Đáp (5)] [Kỹ.] │ │
│ │              ↑                   │ │
│ │         Badge đỏ với số 5        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Step 1:** Admin đang xem phòng Chung
**Step 2:** 5 tin nhắn mới xuất hiện ở Hỏi&Đáp
**Step 3:** Badge đỏ "(5)" hiển thị trên tab Hỏi&Đáp
**Step 4:** Admin click vào Hỏi&Đáp
**Step 5:** Badge biến mất (count reset về 0)

**Scenario 2: Multiple rooms có tin mới**

```
┌─────────────────────────────────────┐
│ [Chung ✓] [Hỏi&Đáp (5)] [Kỹ. (12)]│
│              ↑            ↑          │
│            Badge        Badge        │
└─────────────────────────────────────┘
```

**Scenario 3: Student không thấy badge**

```
Student view:
┌─────────────────────────────────────┐
│ [Chung ✓] [Hỏi&Đáp] [Kỹ thuật]    │
│              ↑           ↑           │
│         Không có badge              │
└─────────────────────────────────────┘
```

## 🔧 Technical Details

### Data Flow

```
User sends message in Room A
        ↓
Firebase Realtime Database updates
        ↓
subscribeToRoomMessages callback triggered
        ↓
Get lastVisitedTime for Room A from localStorage
        ↓
countUnreadMessages(messages, lastVisitedTime)
        ↓
setUnreadCounts({ ...prev, 'roomA': count })
        ↓
RoomSwitcher re-renders with new count
        ↓
Badge displays if count > 0 (Admin/Staff only)
```

### When Count Resets

**Auto Reset:**
- Khi chuyển vào phòng đó
- `updateLastVisitedTime(roomId)` được gọi
- Count set về 0

**Manual Reset:**
- Không có - tự động reset khi vào phòng

### localStorage Structure

```javascript
// Example localStorage data
{
  "chat_room_last_visited_": "1732262400000",        // Phòng Chung
  "chat_room_last_visited_hoidap": "1732258800000",  // Hỏi&Đáp
  "chat_room_last_visited_kithuat": "1732255200000", // Kỹ thuật
}
```

### Performance Considerations

**Optimization:**
1. **Skip Current Room:** Không subscribe phòng hiện tại (đã subscribe ở effect chính)
2. **Cleanup:** Unsubscribe tất cả khi unmount
3. **Limited Query:** Chỉ lấy 100 messages gần nhất để count
4. **Ref Storage:** Dùng `useRef` để store unsubscribe functions (không trigger re-render)

**Memory Usage:**
- 1 subscription per inactive room
- Max 2 subscriptions nếu có 3 phòng (current room không subscribe)
- Cleanup on unmount → No memory leak

## 🧪 Testing

### Test Case 1: Admin sees badges
1. Login as Admin
2. Open chat → Vào phòng Chung
3. Open another browser/incognito
4. Login as another user
5. Send 3 messages in phòng Hỏi&Đáp
6. ✅ Admin browser: Badge "(3)" appears on Hỏi&Đáp tab
7. Admin clicks Hỏi&Đáp tab
8. ✅ Badge disappears

### Test Case 2: Staff sees badges
1. Login as Staff
2. Same steps as Test Case 1
3. ✅ Works the same as Admin

### Test Case 3: Student does NOT see badges
1. Login as Student (non-staff)
2. Open chat
3. Another user sends messages to different rooms
4. ✅ No badges appear (feature only for Admin/Staff)

### Test Case 4: Multiple rooms
1. Login as Admin in phòng Chung
2. User A sends 5 messages to Hỏi&Đáp
3. User B sends 3 messages to Kỹ thuật
4. ✅ Badge "(5)" on Hỏi&Đáp
5. ✅ Badge "(3)" on Kỹ thuật
6. Click Hỏi&Đáp
7. ✅ Hỏi&Đáp badge disappears
8. ✅ Kỹ thuật badge still shows "(3)"

### Test Case 5: Count accuracy
1. Admin in phòng Chung
2. Last visited Hỏi&Đáp at 10:00 AM
3. User sends messages at:
   - 9:55 AM (before last visit)
   - 10:05 AM (after last visit)
   - 10:10 AM (after last visit)
4. ✅ Badge shows "(2)" (only messages after 10:00 AM)

### Test Case 6: Badge animation
1. Admin sees badge
2. ✅ Badge pulses (scale 1.0 → 1.1 → 1.0)
3. ✅ Opacity changes (1.0 → 0.9 → 1.0)
4. ✅ Animation repeats every 2 seconds

### Test Case 7: 99+ display
1. Admin in phòng Chung
2. 150 new messages in Hỏi&Đáp
3. ✅ Badge shows "99+" instead of "150"

## 🎯 Benefits

**For Admins/Staff:**
- 🔔 Instant notifications of new messages
- 📊 See activity in all rooms at a glance
- ⚡ No need to manually check each room
- 🎯 Prioritize which room needs attention

**For Users:**
- ✅ Admins respond faster (they see notifications)
- 🚀 Better moderation across all rooms
- 📈 More active admin presence

**For System:**
- 🔥 Realtime updates via Firebase
- 💾 Efficient localStorage tracking
- 🧹 Automatic cleanup on unmount
- ⚡ Optimized query (limit 100 messages)

## 📁 Files Created/Modified

### Created:
1. **[src/services/firebase/roomNotifications.js](src/services/firebase/roomNotifications.js)** - New utility file
   - `getLastVisitedTime()`
   - `updateLastVisitedTime()`
   - `countUnreadMessages()`

### Modified:
1. **[src/services/firebase/chatService.js](src/services/firebase/chatService.js)**
   - Added `subscribeToRoomMessages()` function

2. **[src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)**
   - Added imports for room notifications
   - Added state: `unreadCounts`, `roomSubscriptionsRef`
   - Added useEffect: Subscribe all rooms
   - Added useEffect: Update last visited time
   - Pass props to RoomSwitcher

3. **[src/widgets/GeneralChatWidget/RoomSwitcher.jsx](src/widgets/GeneralChatWidget/RoomSwitcher.jsx)**
   - Accept props: `unreadCounts`, `isStaffOrAdmin`
   - Added badge display logic
   - Conditional badge rendering

4. **[src/widgets/GeneralChatWidget/index.scss](src/widgets/GeneralChatWidget/index.scss)**
   - Added `.unread-badge` styles
   - Added `pulse-badge` animation
   - Red badge with shadow

## 🚫 Troubleshooting

### Badge không hiển thị
**Nguyên nhân:** User không phải Admin/Staff

**Giải pháp:** Verify user role trong localStorage hoặc database

### Count không chính xác
**Nguyên nhân:** localStorage timestamp bị sai

**Giải pháp:**
```javascript
// Clear all timestamps
localStorage.removeItem('chat_room_last_visited_hoidap');
localStorage.removeItem('chat_room_last_visited_kithuat');
```

### Badge không reset khi vào phòng
**Nguyên nhân:** useEffect không chạy

**Giải pháp:** Check dependencies `[currentRoom, currentUser]`

### Memory leak
**Nguyên nhân:** Subscriptions không được cleanup

**Giải pháp:** Verify cleanup function trong useEffect return

## ✅ Summary

**Tính năng Room Notifications:**
- ✅ Realtime badge notifications
- ✅ Admin/Staff only feature
- ✅ Count unread messages per room
- ✅ localStorage tracking
- ✅ Auto-reset on room switch
- ✅ Red badge with pulse animation
- ✅ 99+ display for large counts
- ✅ Efficient subscriptions
- ✅ Proper cleanup
- ✅ Build successful ✅

**Implemented:** 2025-11-22
**Feature:** Room Unread Notifications
**Build Status:** ✅ Success
**Target Users:** Admin & Staff only
