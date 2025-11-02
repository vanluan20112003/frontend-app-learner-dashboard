# Chat Widget V3 - Advanced Features

## Tổng quan
Phiên bản V3 của General Chat Widget đã được nâng cấp với nhiều tính năng mới, bao gồm khả năng quản lý người dùng cho admin/staff, ghim tin nhắn, emoji picker và mention người dùng.

## Các tính năng mới

### 1. Block/Unblock User (Admin/Staff)
**Mô tả**: Admin và Staff có thể block/unblock người dùng khỏi chat. Khi block một user, tất cả tin nhắn của user đó sẽ bị xóa.

**Cách sử dụng**:
- Admin/Staff click vào menu "..." trên tin nhắn của người dùng
- Chọn "Block user" để block
- Chọn "Unblock user" để gỡ block (nếu user đã bị block)
- Xác nhận action trong dialog

**Chi tiết kỹ thuật**:
- Service functions: `blockUser()`, `unblockUser()`, `getBlockedUsers()`, `isUserBlocked()`
- Firebase path: `generalChat/blockedUsers/{userId}`
- Khi block, tất cả messages của user sẽ bị xóa qua query `orderByChild('userId')`
- Blocked users hiển thị badge "Blocked" màu đỏ

### 2. Pin Message (Admin/Staff Only)
**Mô tả**: Admin và Staff có thể ghim một tin nhắn quan trọng lên đầu chat để mọi người đều thấy.

**Cách sử dụng**:
- Admin/Staff click vào menu "..." trên bất kỳ tin nhắn nào
- Chọn "Pin message"
- Tin nhắn sẽ được hiển thị ở vùng pinned message phía trên chat
- Admin/Staff có thể unpin bằng cách click nút X trên pinned message

**Chi tiết kỹ thuật**:
- Service functions: `pinMessage()`, `unpinMessage()`, `subscribeToPinnedMessage()`
- Firebase path: `generalChat/pinnedMessage`
- Permission check: `isStaff || isAdmin` (cả frontend và backend)
- Chỉ có thể pin 1 message tại một thời điểm
- Pinned message hiển thị với background vàng cam đặc biệt

### 3. Emoji Picker
**Mô tả**: Người dùng có thể thêm emoji vào tin nhắn thông qua emoji picker.

**Cách sử dụng**:
- Click vào nút emoji icon (😊) bên trái input box
- Chọn emoji từ picker
- Emoji sẽ được thêm vào vị trí con trỏ trong input

**Chi tiết kỹ thuật**:
- Package: `emoji-picker-react`
- Emoji picker hiển thị dưới dạng popup phía trên input
- Click outside để đóng picker
- Width: 100%, Height: 350px

### 4. @Mention/Tag Users
**Mô tả**: Người dùng có thể tag/mention người khác trong tin nhắn bằng cách dùng ký tự @.

**Cách sử dụng**:
- Gõ @ trong input box
- Danh sách gợi ý người dùng sẽ hiển thị
- Tiếp tục gõ để lọc danh sách
- Click vào tên người dùng để chọn
- Tên sẽ được thêm vào tin nhắn dưới dạng @UserName

**Chi tiết kỹ thuật**:
- Tự động detect @ character và hiển thị suggestions
- Filter realtime khi user gõ tiếp
- Suggestions lấy từ unique users trong chat history
- Click hoặc Enter để chọn mention

### 5. Enhanced Message Actions
**Mô tả**: Menu dropdown với nhiều actions cho mỗi tin nhắn.

**Actions có sẵn**:
- **Pin message**: Admin/Staff only
- **Delete message**: Người gửi + Admin/Staff
- **Block/Unblock user**: Admin/Staff (chỉ với tin nhắn của người khác)

**Chi tiết kỹ thuật**:
- Sử dụng Paragon Dropdown component
- Icon MoreVert (⋮) để mở menu
- Actions động based on user permissions
- Divider giữa normal actions và admin actions

## Cải tiến UI/UX

### Pinned Message Display
- Background gradient vàng cam đẹp mắt
- Border trái màu cam đậm để highlight
- Icon pin và label "Pinned Message"
- Button X để unpin (chỉ admin/staff)

### Blocked User Badge
- Badge màu đỏ hiển thị "Blocked"
- Xuất hiện cạnh username trong message header
- Giúp admin/staff biết user nào đã bị block

### Emoji Picker
- Popup hiển thị phía trên input
- Shadow đẹp mắt, border radius mềm mại
- Z-index cao để không bị che

### Mention Suggestions
- Dropdown hiển thị phía trên input
- Hover effect màu xám nhạt
- Border giữa các items
- Max height 150px với scroll

### Message Actions Menu
- Icon ba chấm dọc (⋮)
- Hover để hiển thị
- Dropdown menu với icons
- Divider tách admin actions

## File Changes

### Services
- **chatService.js**: Thêm 6 functions mới cho block/pin features
  - `blockUser()`
  - `unblockUser()`
  - `getBlockedUsers()`
  - `isUserBlocked()`
  - `pinMessage()`
  - `unpinMessage()`
  - `subscribeToPinnedMessage()`

### Components
- **index.jsx**:
  - Import EmojiPicker, Dropdown, new icons
  - 6 new state variables
  - 7 new handler functions
  - Enhanced message rendering với dropdown menu
  - Pinned message display
  - Emoji picker integration
  - Mention suggestions UI

### Styles
- **index.scss**:
  - `.pinned-message-container` với gradient background
  - `.blocked-badge` styling
  - `.mention-suggestions` dropdown
  - `.emoji-picker-wrapper` positioning
  - Enhanced `.chat-input-container`

### Messages
- **messages.js**: Thêm 7 localized messages mới

### Firebase Rules
- **FIREBASE_RULES_V2.json**:
  - Rules cho `blockedUsers` node
  - Rules cho `pinnedMessage` node
  - Read/write permissions based on staff/admin status

## Dependencies Added
```json
{
  "emoji-picker-react": "^latest"
}
```

## Cách deploy Firebase Rules

1. Copy nội dung từ `FIREBASE_RULES_V2.json`
2. Vào Firebase Console > Realtime Database > Rules tab
3. Paste rules vào
4. Click "Publish"

## Testing Checklist

### Block/Unblock
- [ ] Admin có thể block user
- [ ] Tất cả messages của blocked user bị xóa
- [ ] Blocked user không gửi được message mới
- [ ] Badge "Blocked" hiển thị trên messages
- [ ] Admin có thể unblock user
- [ ] User có thể gửi message sau khi unblock

### Pin Message
- [ ] Admin/Staff có thể pin message (user thường không thể)
- [ ] Pinned message hiển thị đúng format
- [ ] Chỉ 1 message được pin tại 1 thời điểm
- [ ] Admin/Staff có thể unpin
- [ ] Pin được persist khi refresh
- [ ] Regular user không thấy pin option trong menu

### Emoji Picker
- [ ] Click emoji button mở picker
- [ ] Select emoji thêm vào input
- [ ] Click outside đóng picker
- [ ] Emoji hiển thị đúng trong message

### Mention
- [ ] Gõ @ hiển thị suggestions
- [ ] Gõ tiếp filter suggestions
- [ ] Click chọn thêm mention vào input
- [ ] Mention hiển thị trong sent message

### Permissions
- [ ] Regular user chỉ delete own messages
- [ ] Regular user không thấy block option
- [ ] Admin/Staff thấy tất cả options
- [ ] Admin/Staff delete bất kỳ message nào

## Future Enhancements
- Reply to messages
- Message reactions
- File/image upload
- Message search
- User online status
- Typing indicators
- Message read receipts
