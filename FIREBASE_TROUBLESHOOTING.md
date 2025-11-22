# Firebase Chat Troubleshooting Guide

## 🔴 Lỗi: "Failed to send message. Please try again."

Đây là lỗi phổ biến nhất và thường do một trong các nguyên nhân sau:

### ✅ Bước 1: Kiểm tra Firebase Database Rules

**Nguyên nhân phổ biến nhất:** Firebase Database Rules chưa được cấu hình.

#### Cách kiểm tra:

1. Mở **Browser Console** (F12)
2. Xem có lỗi `PERMISSION_DENIED` không?
3. Nếu có, làm theo hướng dẫn dưới đây:

#### Cách sửa:

1. Truy cập: https://console.firebase.google.com/
2. Chọn project: **open edx** (open-edx-14c95)
3. Vào menu bên trái: **Build** → **Realtime Database**
4. Click tab **Rules**
5. Copy và paste rules sau:

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

6. Click **Publish** (nút màu xanh)
7. Đợi vài giây để rules được apply
8. **Reload trang dashboard** và thử lại

### ✅ Bước 2: Kiểm tra Firebase Database đã được tạo chưa

#### Triệu chứng:
- Console log: "Firebase not initialized"
- Hoặc lỗi database connection

#### Cách kiểm tra:

1. Truy cập Firebase Console: https://console.firebase.google.com/
2. Chọn project: **open edx**
3. Vào **Realtime Database**
4. Nếu chưa có database, click **Create Database**
5. Chọn location: **asia-southeast1** (Singapore)
6. Chọn mode: **Start in test mode** (để test, sau đó sẽ áp dụng rules như Bước 1)
7. Click **Enable**

### ✅ Bước 3: Test Firebase Connection

Để kiểm tra Firebase có hoạt động không:

#### Cách test:

1. Mở **Browser Console** (F12)
2. Chạy lệnh sau:

```javascript
window.testFirebaseConnection()
```

3. Xem kết quả:
   - ✅ "All tests passed!" → Firebase hoạt động tốt
   - ❌ Error → Xem error message và làm theo hướng dẫn

#### Các lỗi phổ biến:

**a) PERMISSION_DENIED:**
```
Error code: PERMISSION_DENIED
Error message: Permission denied
```
→ **Giải pháp:** Làm theo Bước 1 (cấu hình Database Rules)

**b) Firebase not initialized:**
```
Error: Firebase not initialized
```
→ **Giải pháp:**
- Kiểm tra file `src/services/firebase/config.js`
- Xem console có lỗi import Firebase không
- Chạy: `npm list firebase` để xác nhận Firebase đã được cài

**c) Network error:**
```
Error: Failed to get document because the client is offline
```
→ **Giải pháp:**
- Kiểm tra kết nối internet
- Kiểm tra firewall/proxy có block Firebase không

### ✅ Bước 4: Kiểm tra Firebase Config

Xác nhận Firebase config đúng trong file `src/services/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyARpG2EXi2zwvdrINoTMPPTz0i2VSmmHpI',
  authDomain: 'open-edx-14c95.firebaseapp.com',
  databaseURL: 'https://open-edx-14c95-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'open-edx-14c95',
  storageBucket: 'open-edx-14c95.firebasestorage.app',
  messagingSenderId: '457767110705',
  appId: '1:457767110705:web:53e78c9da9ad5740156d10',
  measurementId: 'G-GWQF2WCXPJ',
};
```

**Đặc biệt chú ý `databaseURL`** - phải match với region của database bạn tạo.

### ✅ Bước 5: Xem Console Logs

Mở Browser Console (F12) và tìm các log sau:

#### Good signs (✅):
```
Firebase initialized successfully
```

#### Bad signs (❌):
```
Error initializing Firebase: ...
Firebase is not initialized. Please check your configuration.
Error sending message: ...
Error subscribing to messages: ...
```

Nếu thấy error, copy full error message và:
1. Google error code
2. Kiểm tra Firebase status: https://status.firebase.google.com/
3. Xem Firebase docs: https://firebase.google.com/docs/database/web/start

### ✅ Bước 6: Kiểm tra Database Structure

Sau khi gửi message thành công, kiểm tra data trong Firebase:

1. Firebase Console → Realtime Database → **Data** tab
2. Bạn sẽ thấy structure:

```
generalChat/
  messages/
    -N1234567890ABC/    ← Auto-generated ID
      text: "Hello"
      userName: "Guest 123"
      userId: "guest_xyz"
      timestamp: 1699123456789
      createdAt: "2025-11-02T..."
```

Nếu không thấy data → message không được ghi vào database → check lại Database Rules.

## 🔧 Quick Fix Checklist

Làm theo thứ tự:

- [ ] 1. Firebase Realtime Database đã được tạo chưa?
- [ ] 2. Database Rules đã được publish chưa?
- [ ] 3. Reload trang sau khi publish rules
- [ ] 4. Browser console có lỗi gì không?
- [ ] 5. Chạy `window.testFirebaseConnection()` trong console
- [ ] 6. Config trong `src/services/firebase/config.js` đúng chưa?
- [ ] 7. `npm list firebase` show version 12.5.0 hoặc mới hơn?

## 🆘 Vẫn không hoạt động?

### Debug chi tiết:

1. **Xóa localStorage:**
```javascript
localStorage.removeItem('chatUser')
```
Reload trang và thử lại.

2. **Test trực tiếp trên Firebase Console:**
   - Firebase Console → Realtime Database → Data tab
   - Click (+) để add data manually
   - Path: `generalChat/messages`
   - Nếu không add được → Database Rules sai

3. **Kiểm tra network requests:**
   - Browser DevTools → Network tab
   - Filter: `firebaseio.com`
   - Xem có requests đến Firebase không
   - Check response status (should be 200 OK)

4. **Test với default rules (chỉ để test!):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ **Warning:** Rules này cho phép ai cũng có thể đọc/ghi. Chỉ dùng để test, sau đó phải đổi lại rules an toàn hơn!

## 📞 Support

Nếu vẫn gặp vấn đề, cung cấp thông tin sau:

1. Error message đầy đủ từ console
2. Screenshot Firebase Database Rules
3. Screenshot Firebase Database Data tab
4. Kết quả của `window.testFirebaseConnection()`
5. Output của `npm list firebase`

---

## 🎯 Typical Success Flow

Khi mọi thứ hoạt động đúng, bạn sẽ thấy:

### Console logs:
```
Firebase initialized successfully
✅ Firebase initialized successfully
✅ Database reference created
✅ Write test successful
✅ Read test successful
📊 Messages count: 1
✅ All tests passed! Firebase is working correctly.
```

### UI:
- Click "Open Chat" → hiển thị welcome message
- Gửi message → message xuất hiện ngay lập tức
- Mở tab khác → message sync real-time
- Tin nhắn của mình: màu xanh, bên phải
- Tin nhắn người khác: màu xám, bên trái

### Firebase Console:
- Realtime Database → Data tab
- Thấy `generalChat/messages` với tin nhắn

---

**90% các vấn đề được giải quyết bằng cách setup Database Rules đúng!** 🎯
