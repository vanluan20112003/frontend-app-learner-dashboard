# Chat Database Switcher - Development Feature

## 📋 Tổng quan

Tính năng **Database Switcher** cho phép developers chuyển đổi linh hoạt giữa hai môi trường database Firebase khi đang ở chế độ **development**:

1. **Production (generalChat)** - Database chứa tin nhắn thật từ users
2. **Development (generalChatDev)** - Database dùng để test và phát triển

## 🎯 Mục đích

- ✅ Tách biệt dữ liệu test và dữ liệu production
- ✅ Developers có thể test các tính năng mới mà không ảnh hưởng đến chat thật
- ✅ Có thể xem cả hai môi trường để so sánh và debug
- ✅ Tự động chỉ hoạt động ở development mode, production vẫn luôn dùng database chính

## 🏗️ Kiến trúc

### 1. Firebase Config ([src/services/firebase/config.js](src/services/firebase/config.js))

```javascript
// Database environment constants
export const DATABASE_ENVIRONMENTS = {
  PRODUCTION: 'generalChat',    // Production database path
  DEV: 'generalChatDev',         // Development database path
};
```

**Tính năng:**
- Quản lý 2 database paths
- Lưu preference vào localStorage (chỉ dev mode)
- Cung cấp functions để switch và get current environment
- Tự động load saved preference khi khởi động

### 2. Chat Service ([src/services/firebase/chatService.js](src/services/firebase/chatService.js))

Tất cả các functions đã được cập nhật để sử dụng database path động:

```javascript
const dbPath = getDatabasePath();
const messagesRef = ref(database, `${dbPath}/messages`);
```

**Các collection được cập nhật:**
- ✅ `messages` - Tin nhắn chat
- ✅ `blockedUsers` - Danh sách users bị block
- ✅ `pinnedMessage` - Tin nhắn được pin
- ✅ `bannedWords` - Từ ngữ bị cấm

### 3. Database Switcher Component ([src/widgets/GeneralChatWidget/DatabaseSwitcher.jsx](src/widgets/GeneralChatWidget/DatabaseSwitcher.jsx))

**UI Component cho việc chuyển đổi database:**

```jsx
<DatabaseSwitcher />
```

**Đặc điểm:**
- Chỉ hiển thị ở development mode (`NODE_ENV === 'development'`)
- Hiển thị environment hiện tại
- 2 buttons để switch giữa Production và Development
- Warning message khi đang switch
- Tự động reload page sau khi switch để reconnect database

## 🎨 Giao diện

### Database Switcher Card

```
┌─────────────────────────────────────────────────┐
│ 🗄️ Database Environment          [DEV MODE]     │
│                                                 │
│ ✅ Production (Real Chat)                       │
│    Connected to production chat database...     │
│                                                 │
│ ⚠️ Switching database... Page will reload.     │
│                                                 │
│ [Production] [Development]                      │
│                                                 │
│ Note: This switcher is only available in...     │
└─────────────────────────────────────────────────┘
```

**Styling:**
- Gradient background (blue to purple)
- Border: 2px solid blue
- Active button: primary variant
- Inactive button: outline variant

## 🚀 Cách sử dụng

### Development Mode

1. **Khởi động app ở dev mode:**
   ```bash
   npm start
   ```

2. **Mở General Chat Widget**

3. **Database Switcher sẽ xuất hiện ở đầu chat:**
   - Hiển thị environment hiện tại
   - Click nút "Production" để xem chat thật
   - Click nút "Development" để chuyển sang test database

4. **Page sẽ tự động reload** sau khi switch để kết nối lại database

### Production Mode

- Database Switcher **KHÔNG hiển thị**
- Luôn sử dụng Production database (`generalChat`)
- Không có cách nào để switch sang dev database

## 🔧 API Functions

### Config Functions

```javascript
import {
  DATABASE_ENVIRONMENTS,
  getCurrentDatabaseEnvironment,
  setDatabaseEnvironment,
  getDatabasePath,
  isDevMode,
} from 'services/firebase/config';
```

#### `DATABASE_ENVIRONMENTS`
```javascript
{
  PRODUCTION: 'generalChat',
  DEV: 'generalChatDev'
}
```

#### `getCurrentDatabaseEnvironment()`
Trả về database environment hiện tại
```javascript
const env = getCurrentDatabaseEnvironment();
// Returns: 'generalChat' or 'generalChatDev'
```

#### `setDatabaseEnvironment(environment)`
Chuyển đổi database environment (chỉ dev mode)
```javascript
const success = setDatabaseEnvironment(DATABASE_ENVIRONMENTS.DEV);
// Returns: true if success, false if failed or not in dev mode
```

#### `getDatabasePath()`
Lấy database path hiện tại
```javascript
const path = getDatabasePath();
// Returns: 'generalChat' or 'generalChatDev'
```

#### `isDevMode()`
Kiểm tra có đang ở dev mode không
```javascript
const isDev = isDevMode();
// Returns: true if NODE_ENV === 'development'
```

## 📊 Firebase Database Structure

### Production Database
```
generalChat/
├── messages/
│   ├── message1/
│   ├── message2/
│   └── ...
├── blockedUsers/
│   └── userId1/
├── pinnedMessage/
└── bannedWords/
    ├── word1/
    └── word2/
```

### Development Database
```
generalChatDev/
├── messages/
│   ├── testMessage1/
│   └── testMessage2/
├── blockedUsers/
│   └── testUser1/
├── pinnedMessage/
└── bannedWords/
    └── testWord1/
```

## ⚙️ localStorage Key

```javascript
// Key used to store database preference
localStorage.setItem('firebase_db_environment', 'generalChat');
// or
localStorage.setItem('firebase_db_environment', 'generalChatDev');
```

## 🧪 Testing

### Test Case 1: Development Mode - Switch to Dev Database
1. Start app in dev mode: `npm start`
2. Open chat widget
3. Verify DatabaseSwitcher is visible
4. Click "Development" button
5. ✅ Page reloads
6. ✅ Chat shows test messages from `generalChatDev`

### Test Case 2: Development Mode - Switch back to Production
1. While in dev database
2. Click "Production" button
3. ✅ Page reloads
4. ✅ Chat shows real messages from `generalChat`

### Test Case 3: Production Mode
1. Build production: `npm run build`
2. Serve production build
3. Open chat widget
4. ✅ DatabaseSwitcher is NOT visible
5. ✅ Always uses production database

### Test Case 4: Persistence
1. Switch to dev database
2. Close browser tab
3. Reopen app
4. ✅ Still connected to dev database (preference saved)

## 🔒 Security & Best Practices

### ✅ Security Features

1. **Dev Mode Only**
   - Switcher chỉ hoạt động khi `NODE_ENV === 'development'`
   - Production builds không có cách nào access dev database

2. **Same Firebase Project**
   - Cả hai databases đều nằm trong cùng Firebase project
   - Dùng chung authentication và security rules

3. **No Code Changes**
   - Không cần thay đổi code khi deploy production
   - Tự động detect môi trường

### ⚠️ Lưu ý quan trọng

1. **Firebase Rules**
   - Nhớ set security rules cho `generalChatDev` giống `generalChat`
   - Example:
     ```json
     {
       "rules": {
         "generalChat": { ... },
         "generalChatDev": { ... }  // Same rules
       }
     }
     ```

2. **Data Separation**
   - Development database hoàn toàn tách biệt
   - Không sync tự động giữa 2 databases

3. **Manual Data Migration**
   - Nếu cần test với production data, phải copy manual
   - Sử dụng Firebase Console để export/import

## 📁 Files Modified/Created

### Modified Files:
1. **[src/services/firebase/config.js](src/services/firebase/config.js)**
   - Added database environment constants
   - Added switching logic
   - Added localStorage persistence

2. **[src/services/firebase/chatService.js](src/services/firebase/chatService.js)**
   - Updated all functions to use dynamic database path
   - Import `getDatabasePath` from config

3. **[src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)**
   - Import DatabaseSwitcher component
   - Render DatabaseSwitcher in chat container

4. **[src/widgets/GeneralChatWidget/index.scss](src/widgets/GeneralChatWidget/index.scss)**
   - Added styles for `.database-switcher-card`

### Created Files:
1. **[src/widgets/GeneralChatWidget/DatabaseSwitcher.jsx](src/widgets/GeneralChatWidget/DatabaseSwitcher.jsx)**
   - New component for database switching UI
   - Dev mode detection
   - Switch logic with page reload

## 🎯 Use Cases

### Use Case 1: Feature Development
**Scenario:** Developer đang làm tính năng chat mới

**Flow:**
1. Switch sang dev database
2. Test tính năng với test data
3. Không ảnh hưởng production chat
4. Sau khi test xong, switch về production để verify

### Use Case 2: Bug Debugging
**Scenario:** User report bug trong production chat

**Flow:**
1. Xem production chat để hiểu vấn đề
2. Switch sang dev để reproduce bug
3. Fix bug và test trong dev
4. Deploy fix và verify trong production

### Use Case 3: Data Testing
**Scenario:** Test với nhiều loại messages khác nhau

**Flow:**
1. Switch sang dev database
2. Tạo các test messages với edge cases
3. Test banned words, blocks, pins, etc.
4. Clear test data khi xong

## 🚫 Troubleshooting

### Switcher không hiển thị
**Nguyên nhân:**
- Không đang ở development mode
- `NODE_ENV !== 'development'`

**Giải pháp:**
```bash
# Ensure running in dev mode
npm start
# NOT npm run build
```

### Switch không hoạt động
**Nguyên nhân:**
- localStorage bị disable
- Browser không hỗ trợ localStorage

**Giải pháp:**
- Enable localStorage trong browser settings
- Clear browser cache

### Page không reload sau khi switch
**Nguyên nhân:**
- JavaScript error
- Browser block reload

**Giải pháp:**
- Check browser console for errors
- Manual reload page (F5)

### Dev database không có data
**Nguyên nhân:**
- Database mới, chưa có data
- Firebase rules block access

**Giải pháp:**
- Send test messages trong dev mode
- Check Firebase Console rules

## ✅ Checklist khi Deploy Production

- [ ] Verify `NODE_ENV=production` trong build
- [ ] DatabaseSwitcher không visible trong production build
- [ ] Production luôn connect đến `generalChat`
- [ ] Firebase rules đúng cho cả 2 databases
- [ ] Test production build locally trước

---

## 📝 Summary

**Tính năng Database Switcher cho phép:**
- ✅ Chuyển đổi linh hoạt giữa production và dev database
- ✅ Chỉ hoạt động ở development mode
- ✅ Lưu preference tự động
- ✅ UI thân thiện với developers
- ✅ Không ảnh hưởng production builds
- ✅ Tách biệt hoàn toàn giữa test data và real data

**Implemented:** 2025-11-22
**Feature:** Firebase Database Environment Switcher for Chat Widget
