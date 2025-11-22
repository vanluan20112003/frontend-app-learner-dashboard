# Chat Scroll Issue - Fixed

## 🐛 Vấn đề

Sau khi gửi tin nhắn, toàn bộ trang dashboard bị scroll xuống, gây khó chịu cho người dùng.

## 🔍 Nguyên nhân

### Code cũ (Sai):
```javascript
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [chatMessages]);
```

**Vấn đề:**
- `scrollIntoView()` mặc định scroll cả trang để đưa element vào view
- Không check xem chat có đang mở không
- Gây scroll toàn bộ dashboard

## ✅ Giải pháp

### Code mới (Đúng):
```javascript
useEffect(() => {
  if (messagesEndRef.current && isChatOpen) {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (messagesEndRef.current) {
        const chatMessagesContainer = messagesEndRef.current.closest('.chat-messages');
        if (chatMessagesContainer) {
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
      }
    }, 100);
  }
}, [chatMessages, isChatOpen]);
```

**Cải thiện:**
1. ✅ Check `isChatOpen` - chỉ scroll khi chat đang mở
2. ✅ Tìm parent container `.chat-messages`
3. ✅ Scroll container, KHÔNG scroll toàn trang
4. ✅ Sử dụng `scrollTop` thay vì `scrollIntoView()`
5. ✅ `setTimeout` đảm bảo DOM đã update

## 📝 CSS Updates

### Thêm vào `.chat-messages`:
```scss
.chat-messages {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;        // NEW: Prevent horizontal scroll
  scroll-behavior: smooth;   // NEW: Smooth scrolling
  position: relative;        // NEW: Positioning context
  // ... other styles
}
```

**Lợi ích:**
- `overflow-x: hidden` - Ngăn scroll ngang
- `scroll-behavior: smooth` - Scroll mượt mà
- `position: relative` - Context cho absolute positioning

## 🎯 Cách hoạt động

### Flow:
1. User gửi tin nhắn
2. Message được thêm vào Firebase
3. Firebase trigger callback với messages mới
4. `chatMessages` state update
5. `useEffect` chạy:
   - Check chat đang mở
   - Tìm `.chat-messages` container
   - Set `scrollTop = scrollHeight`
   - **CHỈ scroll trong container, KHÔNG ảnh hưởng trang**

### Visual:
```
┌─────────────────────────────┐
│  Dashboard (KHÔNG SCROLL)   │
│                             │
│  ┌──────────────────────┐  │
│  │ Chat Widget          │  │
│  │ ┌──────────────────┐ │  │
│  │ │ Messages         │ │  │
│  │ │ Message 1        │ │  │
│  │ │ Message 2        │ │  │
│  │ │ Message 3  ← ✅   │ │  │ Only this scrolls
│  │ │ [Your message]   │ │  │
│  │ └──────────────────┘ │  │
│  │ [Input box]          │  │
│  └──────────────────────┘  │
│                             │
└─────────────────────────────┘
```

## 🧪 Testing

### Before Fix:
1. Mở chat
2. Scroll dashboard lên trên
3. Gửi tin nhắn
4. ❌ **Toàn bộ trang scroll xuống**

### After Fix:
1. Mở chat
2. Scroll dashboard lên trên
3. Gửi tin nhắn
4. ✅ **Chỉ chat container scroll, trang KHÔNG di chuyển**

## 📊 Performance

- **setTimeout 100ms**: Đảm bảo DOM render xong
- **Conditional check**: Chỉ chạy khi cần
- **Direct scrollTop**: Nhanh hơn scrollIntoView

## 🔧 Alternative Solutions (Không dùng)

### Option 1: scrollIntoView with options
```javascript
messagesEndRef.current.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',  // Không scroll trang
  inline: 'nearest'
});
```
**Vấn đề:** Vẫn có thể scroll trang trong một số trường hợp

### Option 2: Intersection Observer
```javascript
const observer = new IntersectionObserver(...);
observer.observe(messagesEndRef.current);
```
**Vấn đề:** Quá phức tạp, không cần thiết

### Option 3 (CHOSEN): Direct scrollTop ✅
```javascript
chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
```
**Lợi ích:** Đơn giản, hiệu quả, chỉ scroll container

## 🎨 User Experience

### Trước:
- ❌ Gửi tin → Trang nhảy xuống → Mất vị trí
- ❌ Khó chịu khi đang xem nội dung khác
- ❌ Phải scroll lại lên

### Sau:
- ✅ Gửi tin → Chỉ chat scroll → Trang KHÔNG động
- ✅ Vẫn giữ vị trí dashboard
- ✅ UX tốt hơn nhiều

## 📁 Files Changed

1. **src/widgets/GeneralChatWidget/index.jsx**
   - Line 104-116: Updated auto-scroll logic

2. **src/widgets/GeneralChatWidget/index.scss**
   - Line 31-41: Added scroll properties to `.chat-messages`

## ✅ Status

- [x] Fixed scroll issue
- [x] Tested with multiple messages
- [x] Works on all screen sizes
- [x] No performance issues
- [x] Documentation completed

## 🚀 Deployment

Changes are ready! Just reload the page:
- Server: http://localhost:1996
- Action: Refresh browser
- Test: Send message → Page should NOT scroll

---

**Fixed:** 2025-11-02
**Status:** ✅ Complete
