# Chat User Info Feature - View User Information for Admin/Staff

## 📋 Tổng quan

Tính năng **View User Info** cho phép Admin và Staff xem thông tin chi tiết của người dùng trong chat thông qua menu dropdown (3-dot menu).

## 🎯 Mục đích

- ✅ Admin/Staff có thể xem thông tin user nhanh chóng
- ✅ Hiển thị username, userId và role của user
- ✅ Chỉ Admin/Staff mới có quyền xem
- ✅ Modal đơn giản, dễ sử dụng

## 🏗️ Kiến trúc

### 1. Thêm Option vào Dropdown Menu

**File:** [src/widgets/GeneralChatWidget/index.jsx:694-706](src/widgets/GeneralChatWidget/index.jsx#L694-L706)

**Code:**
```jsx
<Dropdown.Menu>
  {isStaffOrAdmin && (
    <>
      <Dropdown.Item onClick={() => handlePinMessage(msg)}>
        <Icon src={PushPin} className="mr-2" />
        {formatMessage(messages.pinMessage)}
      </Dropdown.Item>
      {!isOwnMessage && (
        <Dropdown.Item onClick={() => handleViewUserInfo(msg)}>
          <Icon src={Person} className="mr-2" />
          {formatMessage(messages.viewUserInfo)}
        </Dropdown.Item>
      )}
    </>
  )}
  {/* ... other menu items ... */}
</Dropdown.Menu>
```

**Logic:**
- Chỉ hiển thị khi user là Staff hoặc Admin (`isStaffOrAdmin`)
- Không hiển thị option này cho messages của chính mình (`!isOwnMessage`)
- Sử dụng `Person` icon từ Paragon
- Click sẽ gọi `handleViewUserInfo(msg)`

### 2. State Management

**File:** [src/widgets/GeneralChatWidget/index.jsx:69-70](src/widgets/GeneralChatWidget/index.jsx#L69-L70)

**State Variables:**
```javascript
const [showUserInfoModal, setShowUserInfoModal] = useState(false);
const [selectedUserInfo, setSelectedUserInfo] = useState(null);
```

**showUserInfoModal:**
- Boolean để hiển thị/ẩn modal
- `true` = modal hiển thị
- `false` = modal ẩn

**selectedUserInfo:**
- Object chứa thông tin user được chọn
- Structure: `{ userId, userName, role, isStaff, isAdmin }`
- `null` khi không có user nào được chọn

### 3. Handler Function

**File:** [src/widgets/GeneralChatWidget/index.jsx:339-352](src/widgets/GeneralChatWidget/index.jsx#L339-L352)

**Function:**
```javascript
const handleViewUserInfo = (msg) => {
  if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
    return;
  }

  setSelectedUserInfo({
    userId: msg.userId,
    userName: msg.userName,
    role: msg.userRole || 'student',
    isStaff: msg.isStaff || false,
    isAdmin: msg.isAdmin || false,
  });
  setShowUserInfoModal(true);
};
```

**Logic:**
1. **Permission Check:** Chỉ cho phép Staff/Admin
2. **Extract Data:** Lấy thông tin từ message object:
   - `userId`: ID của user
   - `userName`: Tên hiển thị
   - `userRole`: Role (admin/staff/student)
   - `isStaff`: Boolean
   - `isAdmin`: Boolean
3. **Show Modal:** Set state để hiển thị modal

### 4. User Info Modal

**File:** [src/widgets/GeneralChatWidget/index.jsx:814-849](src/widgets/GeneralChatWidget/index.jsx#L814-L849)

**Modal Component:**
```jsx
<Modal
  show={showUserInfoModal}
  onHide={() => setShowUserInfoModal(false)}
  size="md"
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>{formatMessage(messages.userInformation)}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedUserInfo && (
      <div className="user-info-content">
        <div className="user-info-row">
          <strong>{formatMessage(messages.username)}:</strong>
          <span className="ml-2">{selectedUserInfo.userName}</span>
        </div>
        <div className="user-info-row mt-2">
          <strong>{formatMessage(messages.user)}:</strong>
          <span className="ml-2">{selectedUserInfo.userId}</span>
        </div>
        <div className="user-info-row mt-2">
          <strong>{formatMessage(messages.role)}:</strong>
          <span className="ml-2">
            {selectedUserInfo.isAdmin ? 'Admin' : selectedUserInfo.isStaff ? 'Staff' : 'Student'}
          </span>
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUserInfoModal(false)}>
      {formatMessage(messages.close)}
    </Button>
  </Modal.Footer>
</Modal>
```

**Features:**
- **Size:** `md` (medium) - Vừa đủ cho nội dung
- **Centered:** Modal xuất hiện giữa màn hình
- **Close Button:** X button ở header
- **Close on Outside Click:** Click ngoài modal để đóng
- **Responsive:** Auto-adjust theo màn hình

**Displayed Information:**
1. **Username:** Tên hiển thị của user
2. **User ID:** ID/username trong hệ thống
3. **Role:** Admin, Staff, hoặc Student

### 5. CSS Styling

**File:** [src/widgets/GeneralChatWidget/index.scss:616-643](src/widgets/GeneralChatWidget/index.scss#L616-L643)

**Styles:**
```scss
// User Info Modal
.user-info-content {
  padding: map-get($spacers, 2);

  .user-info-row {
    display: flex;
    align-items: center;
    padding: map-get($spacers, 2);
    background-color: $light-100;
    border-radius: 0.25rem;
    margin-bottom: map-get($spacers, 2);

    strong {
      min-width: 100px;
      color: $dark;
    }

    span {
      color: $body-color;
      word-break: break-word;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

**Visual Features:**
- **Padding:** Spacing around content
- **Background:** Light gray background cho mỗi row
- **Border Radius:** Bo góc mềm mại
- **Flex Layout:** Label và value nằm cùng hàng
- **Min Width:** Label có width tối thiểu để align đẹp
- **Word Break:** Text dài tự động xuống hàng

### 6. Internationalization Messages

**File:** [src/widgets/GeneralChatWidget/messages.js:302-327](src/widgets/GeneralChatWidget/messages.js#L302-L327)

**Messages:**
```javascript
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
```

## 🎨 User Experience

### Workflow

**Step 1: Admin/Staff xem message trong chat**
```
┌─────────────────────────────────────┐
│ Messages:                           │
│ ┌─────────────────────────────────┐ │
│ │ [John Doe] [Student]      [⋮]  │ │  ← 3-dot menu
│ │ Hello everyone!                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Step 2: Click vào 3-dot menu**
```
┌─────────────────────────────┐
│ ⋮ Dropdown Menu:            │
│ ┌─────────────────────────┐ │
│ │ 📌 Pin message          │ │
│ │ 👤 View User Info       │ │  ← Click here
│ ├─────────────────────────┤ │
│ │ 🗑️ Delete message       │ │
│ ├─────────────────────────┤ │
│ │ 🚫 Block user           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Step 3: Modal hiển thị thông tin user**
```
┌───────────────────────────────────┐
│ User Information              [X] │
├───────────────────────────────────┤
│                                   │
│  ┌─────────────────────────────┐ │
│  │ Username:    John Doe       │ │
│  └─────────────────────────────┘ │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ User:        johndoe123     │ │
│  └─────────────────────────────┘ │
│                                   │
│  ┌─────────────────────────────┐ │
│  │ Role:        Student        │ │
│  └─────────────────────────────┘ │
│                                   │
├───────────────────────────────────┤
│                    [Close]        │
└───────────────────────────────────┘
```

**Step 4: Close modal**
- Click button "Close"
- Click X ở header
- Click outside modal
- Press ESC key

## 🚀 Cách sử dụng

### For Admin/Staff

**Scenario 1: Xem thông tin user bất kỳ**
1. Tìm message của user cần xem
2. Click vào 3-dot menu (⋮)
3. Click "View User Info"
4. Modal hiển thị thông tin:
   - Username (tên hiển thị)
   - User ID (username trong hệ thống)
   - Role (Admin/Staff/Student)
5. Click "Close" để đóng modal

**Scenario 2: Không thấy option "View User Info"**

Có 2 lý do:
1. **Bạn không phải Admin/Staff:** Option chỉ hiển thị cho Admin và Staff
2. **Đó là message của chính bạn:** Option không hiển thị cho messages của chính mình

## 🔧 Technical Details

### Imports Required

**Paragon Components:**
```javascript
import { Modal } from '@openedx/paragon';
```

**Paragon Icons:**
```javascript
import { Person } from '@openedx/paragon/icons';
```

### Permission Logic

**Menu Option Display:**
```javascript
{isStaffOrAdmin && !isOwnMessage && (
  <Dropdown.Item onClick={() => handleViewUserInfo(msg)}>
    <Icon src={Person} className="mr-2" />
    {formatMessage(messages.viewUserInfo)}
  </Dropdown.Item>
)}
```

**Handler Permission Check:**
```javascript
if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
  return;
}
```

### Data Flow

```
Message Object (from Firebase)
      ↓
User clicks "View User Info"
      ↓
handleViewUserInfo(msg)
      ↓
Extract: userId, userName, role, isStaff, isAdmin
      ↓
setSelectedUserInfo({ ... })
setShowUserInfoModal(true)
      ↓
Modal displays with user info
      ↓
User clicks Close/X/Outside
      ↓
setShowUserInfoModal(false)
```

## 🧪 Testing

### Test Case 1: Admin views user info
1. Login as Admin
2. Navigate to chat
3. Find a message from another user
4. Click 3-dot menu
5. ✅ "View User Info" option appears
6. Click "View User Info"
7. ✅ Modal shows with correct user information
8. ✅ Username, User ID, and Role displayed correctly

### Test Case 2: Staff views user info
1. Login as Staff
2. Navigate to chat
3. Find a message from another user
4. Click 3-dot menu
5. ✅ "View User Info" option appears
6. Click "View User Info"
7. ✅ Modal shows with correct user information

### Test Case 3: Student tries to view
1. Login as Student (non-staff)
2. Navigate to chat
3. Find a message from another user
4. Click 3-dot menu
5. ✅ "View User Info" option does NOT appear
6. ✅ Only own message actions visible

### Test Case 4: Admin views own message
1. Login as Admin
2. Navigate to chat
3. Find your own message
4. Click 3-dot menu
5. ✅ "View User Info" option does NOT appear
6. ✅ Only Pin, Delete options visible

### Test Case 5: Close modal
1. Open user info modal
2. Test all close methods:
   - Click "Close" button → ✅ Modal closes
   - Click X button → ✅ Modal closes
   - Click outside modal → ✅ Modal closes
   - Press ESC key → ✅ Modal closes

### Test Case 6: Role display
1. View info of Admin user → ✅ Shows "Admin"
2. View info of Staff user → ✅ Shows "Staff"
3. View info of Student user → ✅ Shows "Student"

## 🎯 Benefits

**For Admins/Staff:**
- ⚡ Quick access to user information
- 🔍 Easy user identification
- 🎯 Better moderation capabilities
- 📊 Understand user roles at a glance

**For Users:**
- 🔒 Privacy protected (only Staff/Admin can view)
- ✅ Simple, non-intrusive UI
- 📱 Works on all devices

**For Developers:**
- 🧹 Clean, modular code
- 🔄 Reusable modal component
- 📝 Well-documented
- 🐛 Easy to maintain

## 📁 Files Modified

### 1. [src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)
- Added `Modal` to imports
- Added `Person` icon to imports
- Added state: `showUserInfoModal`, `selectedUserInfo`
- Added handler: `handleViewUserInfo()`
- Added "View User Info" option to dropdown menu
- Added User Info Modal component

### 2. [src/widgets/GeneralChatWidget/index.scss](src/widgets/GeneralChatWidget/index.scss)
- Added `.user-info-content` styles
- Added `.user-info-row` styles
- Responsive and accessible styling

### 3. [src/widgets/GeneralChatWidget/messages.js](src/widgets/GeneralChatWidget/messages.js)
- Added `viewUserInfo` message
- Added `userInformation` message
- Added `username` message
- Added `role` message
- Added `close` message

## 🚫 Troubleshooting

### Option không hiển thị
**Nguyên nhân:** User không phải Admin/Staff hoặc đang xem message của chính mình

**Giải pháp:** Đảm bảo:
- User có role Staff hoặc Admin
- Đang xem message của người khác

### Modal không hiển thị
**Nguyên nhân:** State không được set đúng

**Giải pháp:** Check console errors và verify state management

### Thông tin không đúng
**Nguyên nhân:** Message object thiếu data

**Giải pháp:** Verify message object có đầy đủ fields: `userId`, `userName`, `userRole`, `isStaff`, `isAdmin`

## ✅ Summary

**Tính năng View User Info bao gồm:**
- ✅ Menu option cho Admin/Staff
- ✅ Permission-based display
- ✅ Modal hiển thị user info
- ✅ Username, User ID, Role
- ✅ Clean UI/UX
- ✅ Responsive design
- ✅ Internationalization support
- ✅ Build successful ✅

**Implemented:** 2025-11-22
**Feature:** View User Info for Admin/Staff
**Build Status:** ✅ Success
