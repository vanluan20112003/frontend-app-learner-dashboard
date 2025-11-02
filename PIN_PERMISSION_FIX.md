# Pin Message Permission Fix

## Vấn đề
User thường vẫn có thể thấy và sử dụng tính năng pin message, trong khi yêu cầu là chỉ Admin và Staff mới được phép.

## Giải pháp đã áp dụng

### 1. Frontend - UI Restriction
**File**: [src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)

#### Handler Functions
- `handlePinMessage()`: Thêm permission check `isStaff || isAdmin`
- `handleUnpinMessage()`: Thêm permission check `isStaff || isAdmin`

#### Menu Display
Chỉ hiển thị "Pin message" option trong dropdown menu khi `isStaffOrAdmin === true`:

```jsx
{isStaffOrAdmin && (
  <Dropdown.Item onClick={() => handlePinMessage(msg)}>
    <Icon src={PushPin} className="mr-2" />
    {formatMessage(messages.pinMessage)}
  </Dropdown.Item>
)}
```

### 2. Backend - Service Restriction
**File**: [src/services/firebase/chatService.js](src/services/firebase/chatService.js)

#### pinMessage() function
```javascript
if (!user.isStaff && !user.isAdmin) {
  return { success: false, error: 'Permission denied' };
}
```

#### unpinMessage() function
```javascript
if (!user.isStaff && !user.isAdmin) {
  return { success: false, error: 'Permission denied' };
}
```

### 3. Firebase Rules - Database Security
**File**: [FIREBASE_RULES_V2.json](FIREBASE_RULES_V2.json)

```json
"pinnedMessage": {
  ".read": true,
  ".write": "auth != null && (root.child('users').child(auth.uid).child('isStaff').val() === true || root.child('users').child(auth.uid).child('isAdmin').val() === true)"
}
```

## Kết quả

### Regular User (Không phải Staff/Admin)
- ❌ Không thấy "Pin message" option trong menu
- ❌ Không thể gọi `handlePinMessage()`
- ❌ Backend reject nếu cố gắng pin
- ❌ Firebase rules reject write operation
- ✅ Vẫn có thể XEM pinned message (read-only)
- ✅ Không thấy nút X để unpin

### Admin/Staff
- ✅ Thấy "Pin message" option trong menu
- ✅ Có thể pin bất kỳ message nào
- ✅ Có thể unpin pinned message (nút X)
- ✅ Backend cho phép pin/unpin operations
- ✅ Firebase rules cho phép write operations

## Security Layers

1. **UI Layer**: Ẩn option để tránh confusion
2. **Handler Layer**: Check permission trước khi gọi service
3. **Service Layer**: Validate permission ở backend
4. **Database Layer**: Firebase rules enforce permission

## Files Modified

1. `src/widgets/GeneralChatWidget/index.jsx` - Lines 275-297, 528-533
2. `src/services/firebase/chatService.js` - Lines 268-332
3. `FIREBASE_RULES_V2.json` - Line 59
4. `CHAT_V3_FEATURES.md` - Updated documentation

## Testing

Build status: ✅ Success

### Test Cases
- [ ] Regular user không thấy pin option
- [ ] Regular user click vào menu chỉ thấy delete (nếu own message)
- [ ] Admin thấy pin option trên mọi message
- [ ] Staff thấy pin option trên mọi message
- [ ] Pin thành công hiển thị pinned message banner
- [ ] Chỉ admin/staff thấy nút X để unpin
- [ ] Firebase rules reject nếu regular user cố gắng write
