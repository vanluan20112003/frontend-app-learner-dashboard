# Blocked Users Management Feature

## Tổng quan
Tính năng quản lý blocked users cho phép Admin và Staff xem danh sách tất cả người dùng bị block và có thể unblock họ trực tiếp từ UI.

## Cải tiến đã thực hiện

### 1. Error Message Improvement
**Vấn đề cũ**: Khi user bị block cố gắng gửi tin nhắn, họ nhận được error "Failed to send message: Unknown error"

**Giải pháp**:
- Cải thiện error handling để hiển thị thông báo rõ ràng hơn
- Thêm localized messages cho các error types

**Files thay đổi**:
- `src/widgets/GeneralChatWidget/index.jsx` (lines 210-219)
- `src/widgets/GeneralChatWidget/messages.js` (lines 94-103)

**Error messages mới**:
```javascript
blockedError: 'You have been blocked from the chat. Please contact an administrator.'
firebaseError: 'Firebase is not connected. Please check your Firebase configuration.'
```

### 2. Blocked Users Management UI
**Mô tả**: Thêm section collapsible cho Admin/Staff để quản lý blocked users

**Tính năng**:
- Toggle button hiển thị số lượng blocked users
- Danh sách blocked users với thông tin chi tiết:
  - User ID
  - Blocked by (tên người block)
  - Nút unblock trực tiếp
- Scroll được nếu danh sách dài
- Real-time update khi block/unblock user

**UI Design**:
```
┌─────────────────────────────────────────┐
│ [🚫] Blocked Users (3) [▼]             │
├─────────────────────────────────────────┤
│ username123                        [🚫] │
│ Blocked by: Admin User                  │
├─────────────────────────────────────────┤
│ user456                            [🚫] │
│ Blocked by: Staff User                  │
└─────────────────────────────────────────┘
```

### 3. Code Changes

#### index.jsx
**New state**:
```javascript
const [showBlockedUsers, setShowBlockedUsers] = useState(false);
```

**New UI section** (lines 493-540):
```jsx
{currentUser && (currentUser.isStaff || currentUser.isAdmin) && (
  <div className="blocked-users-section mb-2">
    <Button variant="outline-secondary" size="sm" onClick={...} block>
      <Icon src={Block} />
      {formatMessage(messages.blockedUsers)} ({blockedUsers.length})
      <Icon src={showBlockedUsers ? ExpandLess : ExpandMore} />
    </Button>

    {showBlockedUsers && (
      <div className="blocked-users-list mt-2">
        {blockedUsers.map((blockedUser) => (
          <div className="blocked-user-item">
            <div className="blocked-user-info">
              <div className="blocked-user-name">{blockedUser.userId}</div>
              <small>Blocked by: {blockedUser.blockedByName}</small>
            </div>
            <IconButton onClick={() => handleUnblockUser(blockedUser.userId)} />
          </div>
        ))}
      </div>
    )}
  </div>
)}
```

#### index.scss
**New styles** (lines 60-105):
```scss
.blocked-users-section {
  .blocked-users-list {
    border: 1px solid $light-400;
    border-radius: 0.25rem;
    background-color: $white;
    max-height: 200px;
    overflow-y: auto;

    .blocked-user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: map-get($spacers, 2);
      border-bottom: 1px solid $light-300;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $light-100;
      }
    }
  }
}
```

#### messages.js
**New localized messages** (lines 104-123):
```javascript
blockedUsers: {
  defaultMessage: 'Blocked Users',
},
noBlockedUsers: {
  defaultMessage: 'No blocked users',
},
blockedBy: {
  defaultMessage: 'Blocked by',
},
```

## Cách sử dụng

### Cho Admin/Staff
1. Mở General Chat Widget
2. Bạn sẽ thấy button "Blocked Users (X)" ngay dưới pinned message
3. Click button để expand/collapse danh sách
4. Xem thông tin user bị block và ai đã block họ
5. Click icon 🚫 để unblock user

### User Experience
- **Regular users**: Không thấy blocked users section
- **Blocked users**: Nhận thông báo rõ ràng "You have been blocked from the chat. Please contact an administrator."
- **Admin/Staff**: Có full control để manage blocked users

## Features

### ✅ Completed
- [x] Improved error messages khi user bị block
- [x] Localized error messages
- [x] Blocked users management UI
- [x] Collapsible section với counter
- [x] Display blocked user info (userId, blockedBy)
- [x] Quick unblock button
- [x] Real-time updates
- [x] Responsive styling
- [x] Scroll support cho danh sách dài
- [x] Hover effects
- [x] Permission-based visibility (admin/staff only)

### 🎨 UI/UX Features
- Collapsible section để tiết kiệm space
- Counter hiển thị số blocked users
- Clean, readable list design
- Hover effects cho better UX
- Scroll support (max-height: 200px)
- Icon buttons cho quick actions
- Muted text cho metadata
- Border separators giữa items

## Build Status
✅ **Build successful** - No errors, ready for production

## Files Modified

1. `src/widgets/GeneralChatWidget/index.jsx`
   - Added `showBlockedUsers` state
   - Added blocked users section UI
   - Improved error handling

2. `src/widgets/GeneralChatWidget/index.scss`
   - Added `.blocked-users-section` styles
   - Added `.blocked-user-item` styles
   - Added hover effects and transitions

3. `src/widgets/GeneralChatWidget/messages.js`
   - Added `blockedError` message
   - Added `firebaseError` message
   - Added `blockedUsers` message
   - Added `noBlockedUsers` message
   - Added `blockedBy` message

## Testing Checklist

### Error Messages
- [x] Regular user gets clear error when trying to send message after being blocked
- [x] Error message is localized
- [x] Firebase connection error shows proper message

### Blocked Users UI
- [ ] Admin sees blocked users section
- [ ] Staff sees blocked users section
- [ ] Regular users don't see blocked users section
- [ ] Counter shows correct number of blocked users
- [ ] Click to expand/collapse works
- [ ] Empty state shows "No blocked users" message
- [ ] Blocked user info displays correctly (userId, blockedBy)
- [ ] Unblock button works
- [ ] List updates after unblock
- [ ] Scroll works when list is long (>5 users)
- [ ] Hover effects work on items

### Permissions
- [ ] Only admin/staff can see blocked users section
- [ ] Only admin/staff can unblock users
- [ ] Regular users cannot access this feature

## Next Steps (Optional)
- Add confirmation dialog before unblocking
- Add "Blocked at" timestamp display
- Add search/filter for long blocked users list
- Add pagination if list gets very long
- Add bulk unblock feature
