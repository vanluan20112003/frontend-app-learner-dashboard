# Chat Mention/Tag Feature - User Tagging System

## 📋 Tổng quan

Tính năng **Mention/Tag Users** cho phép users tag/mention người khác trong chat với 2 cách:

1. **Click vào username** trong messages → Tự động điền `@username` vào input
2. **Gõ `@` trong input** → Hiển thị danh sách users để filter và chọn

## 🎯 Mục đích

- ✅ Tương tác nhanh hơn giữa users
- ✅ Dễ dàng tag users mà không cần gõ chính xác tên
- ✅ Filter danh sách users theo tên khi gõ
- ✅ Trải nghiệm người dùng tốt hơn với clickable usernames

## 🏗️ Kiến trúc

### 1. Click vào Username để Tag

**Function:** `handleUserClick()` ([index.jsx:409-415](src/widgets/GeneralChatWidget/index.jsx#L409-L415))

```javascript
const handleUserClick = (userName) => {
  setInputMessage((prev) => `${prev}@${userName} `);
  setShowMentionSuggestions(false);
  // Focus on input after clicking username
  document.querySelector('.chat-input')?.focus();
};
```

**Chức năng:**
- Append `@username ` vào cuối input
- Tự động focus vào input để user tiếp tục gõ
- Ẩn mention suggestions

### 2. Gõ `@` để Hiển thị Suggestions

**Function:** `handleInputChange()` ([index.jsx:370-416](src/widgets/GeneralChatWidget/index.jsx#L370-L416))

```javascript
const handleInputChange = (e) => {
  const value = e.target.value;
  setInputMessage(value);

  // Check for @ mentions
  const lastAtIndex = value.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const afterAt = value.substring(lastAtIndex + 1);

    // Check if there's a space after @ (mention completed)
    if (afterAt.includes(' ')) {
      setShowMentionSuggestions(false);
      return;
    }

    const searchTerm = afterAt.toLowerCase();

    // Get unique users from messages using Map
    const usersMap = new Map();
    chatMessages.forEach((msg) => {
      if (!usersMap.has(msg.userId)) {
        usersMap.set(msg.userId, {
          id: msg.userId,
          name: msg.userName,
        });
      }
    });
    const uniqueUsers = Array.from(usersMap.values());

    // Filter users based on search term
    if (searchTerm.length === 0) {
      // Just typed @, show all users
      setMentionSuggestions(uniqueUsers);
      setShowMentionSuggestions(uniqueUsers.length > 0);
    } else {
      // Filter by search term (starts with)
      const filtered = uniqueUsers.filter((user) =>
        user.name.toLowerCase().startsWith(searchTerm)
      );
      setMentionSuggestions(filtered);
      setShowMentionSuggestions(filtered.length > 0);
    }
  } else {
    setShowMentionSuggestions(false);
  }
};
```

**Logic:**
1. Tìm vị trí `@` cuối cùng trong input
2. Lấy text sau `@`
3. Nếu có space sau `@` → mention đã hoàn thành, ẩn suggestions
4. Nếu không có text sau `@` → hiển thị tất cả users
5. Nếu có text → filter users theo `startsWith` (tối ưu hơn `includes`)
6. Sử dụng `Map` để loại bỏ duplicates

### 3. Chọn User từ Suggestions

**Function:** `handleMentionSelect()` ([index.jsx:418-422](src/widgets/GeneralChatWidget/index.jsx#L418-L422))

```javascript
const handleMentionSelect = (userName) => {
  const lastAtIndex = inputMessage.lastIndexOf('@');
  const newMessage = inputMessage.substring(0, lastAtIndex) + `@${userName} `;
  setInputMessage(newMessage);
  setShowMentionSuggestions(false);
};
```

**Chức năng:**
- Replace text từ `@` cuối cùng với `@username `
- Ẩn suggestions
- Giữ nguyên text trước `@`

### 4. UI - Clickable Username

**HTML:** ([index.jsx:642-653](src/widgets/GeneralChatWidget/index.jsx#L642-L653))

```jsx
<span
  className="message-user clickable-username"
  onClick={() => handleUserClick(msg.userName)}
  role="button"
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter') handleUserClick(msg.userName);
  }}
  title={`Click to mention @${msg.userName}`}
>
  {msg.userName}
</span>
```

**Accessibility:**
- `role="button"` - Semantic HTML
- `tabIndex={0}` - Keyboard navigation
- `onKeyPress` với Enter key - Keyboard accessibility
- `title` - Tooltip giải thích chức năng

### 5. CSS Styling

**File:** [index.scss:464-482](src/widgets/GeneralChatWidget/index.scss#L464-L482)

```scss
.message-user {
  font-weight: 600;

  // Clickable username styles
  &.clickable-username {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    padding: 2px 4px;
    margin: -2px -4px;
    border-radius: 4px;

    &:hover {
      background-color: rgba(0, 123, 255, 0.1);
      color: #007bff;
      text-decoration: underline;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
```

**Visual Effects:**
- Hover: Background xanh nhạt + underline + đổi màu chữ
- Active: Scale down effect (feedback khi click)
- Smooth transitions

## 🎨 User Experience

### Cách 1: Click vào Username

```
┌─────────────────────────────────────┐
│ Messages:                           │
│ ┌─────────────────────────────────┐ │
│ │ [John Doe] [Staff]              │ │  ← Hover vào "John Doe"
│ │ Hello everyone!                 │ │    Username highlight màu xanh
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Alice] [Admin]                 │ │  ← Click vào "Alice"
│ │ Welcome!                        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Input: [@Alice █]                   │  ← Tự động điền
└─────────────────────────────────────┘
```

### Cách 2: Gõ `@` để Filter

**Bước 1: Gõ `@`**
```
Input: [@█]

┌─────────────────────────┐
│ Suggestions:            │
│ ┌─────────────────────┐ │
│ │ @John Doe           │ │
│ ├─────────────────────┤ │
│ │ @Alice              │ │
│ ├─────────────────────┤ │
│ │ @Bob Smith          │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Bước 2: Gõ `@j`**
```
Input: [@j█]

┌─────────────────────────┐
│ Suggestions:            │
│ ┌─────────────────────┐ │
│ │ @John Doe           │ │  ← Filtered (starts with 'j')
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Bước 3: Chọn hoặc tiếp tục gõ**
```
Input: [@John Doe █]  ← After selection
```

**Bước 4: Gõ space → Ẩn suggestions**
```
Input: [@John Doe hello█]  ← Space closes suggestions
```

## 🚀 Cách sử dụng

### User Workflow

**Scenario 1: Reply to someone**
1. Đọc message của Alice
2. Click vào username "Alice"
3. Input tự động: `@Alice `
4. Gõ tiếp: `@Alice thank you!`
5. Send message ✅

**Scenario 2: Mention multiple people**
1. Gõ: `@`
2. Chọn "John" từ suggestions: `@John `
3. Gõ tiếp: `@John and @`
4. Chọn "Alice" từ suggestions: `@John and @Alice `
5. Gõ: `@John and @Alice please check this`
6. Send message ✅

**Scenario 3: Filter by typing**
1. Gõ: `@j`
2. List auto-filter: chỉ hiện users bắt đầu với 'j'
3. Click chọn user từ filtered list
4. Continue typing
5. Send message ✅

## 🔧 Technical Details

### State Management

```javascript
const [mentionSuggestions, setMentionSuggestions] = useState([]);
const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
```

**mentionSuggestions:**
- Array of user objects: `[{ id, name }, ...]`
- Populated from `chatMessages`
- Deduplicated using `Map`

**showMentionSuggestions:**
- Boolean để show/hide suggestion box
- Auto-hide khi:
  - Space được gõ sau `@username`
  - Click outside suggestions
  - User selected từ list

### Filter Logic

**Before (Old):**
```javascript
// Used .includes() - matches anywhere in string
user.name.toLowerCase().includes(searchTerm)
```

**After (New):**
```javascript
// Uses .startsWith() - matches from beginning only
user.name.toLowerCase().startsWith(searchTerm)
```

**Benefits:**
- Tối ưu hơn cho autocomplete
- Results relevant hơn
- Performance tốt hơn với large user lists

### Deduplication Strategy

**Before (Old):**
```javascript
const uniqueUsers = [...new Set(chatMessages.map((msg) => ({
  id: msg.userId,
  name: msg.userName,
})))];
```
❌ Problem: `Set` không work với objects

**After (New):**
```javascript
const usersMap = new Map();
chatMessages.forEach((msg) => {
  if (!usersMap.has(msg.userId)) {
    usersMap.set(msg.userId, {
      id: msg.userId,
      name: msg.userName,
    });
  }
});
const uniqueUsers = Array.from(usersMap.values());
```
✅ Correct: `Map` với `userId` làm key

## 🧪 Testing

### Test Case 1: Click Username
1. Open chat với messages
2. Hover over username
3. ✅ Cursor changes to pointer
4. ✅ Background highlight appears
5. Click username
6. ✅ Input shows `@username `
7. ✅ Input is focused

### Test Case 2: Type `@` to Show All
1. Focus input
2. Type `@`
3. ✅ Suggestions box appears
4. ✅ Shows all unique users
5. ✅ No duplicate users

### Test Case 3: Filter by Typing
1. Type `@j`
2. ✅ Only users starting with 'j' shown
3. Type more: `@jo`
4. ✅ Further filtered
5. Backspace to `@j`
6. ✅ Previous filtered list returns

### Test Case 4: Select from Suggestions
1. Type `@j`
2. Click "John Doe" from list
3. ✅ Input becomes `@John Doe `
4. ✅ Suggestions hide
5. ✅ Cursor at end of input

### Test Case 5: Multiple Mentions
1. Type `@john `
2. ✅ Suggestions hide (space after username)
3. Type `and @`
4. ✅ Suggestions appear again
5. Select "Alice"
6. ✅ Input: `@john and @Alice `

### Test Case 6: Keyboard Navigation
1. Tab to username
2. ✅ Username gets focus ring
3. Press Enter
4. ✅ Same behavior as click
5. ✅ Input gets `@username `

## 🎯 Benefits

**User Experience:**
- ⚡ Faster tagging (click instead of type)
- 🎯 Accurate (no typos in usernames)
- 🔍 Easy discovery (filter by typing)
- ♿ Accessible (keyboard navigation)

**Developer Experience:**
- 🧹 Clean code structure
- 🔄 Reusable functions
- 📝 Well-documented
- 🐛 Easy to debug

**Performance:**
- ✅ Efficient deduplication with `Map`
- ✅ Optimized filtering with `startsWith`
- ✅ Minimal re-renders
- ✅ Smooth animations

## 📁 Files Modified

### 1. [src/widgets/GeneralChatWidget/index.jsx](src/widgets/GeneralChatWidget/index.jsx)
- Added `handleUserClick()` function
- Improved `handleInputChange()` logic
- Made usernames clickable with accessibility
- Better deduplication with `Map`

### 2. [src/widgets/GeneralChatWidget/index.scss](src/widgets/GeneralChatWidget/index.scss)
- Added `.clickable-username` styles
- Hover/active states
- Smooth transitions

## 🚫 Troubleshooting

### Suggestions không hiển thị
**Nguyên nhân:** Không có messages trong chat

**Giải pháp:** Đảm bảo có ít nhất 1 message trong chat

### Duplicates trong suggestions
**Nguyên nhân:** Logic deduplication không hoạt động

**Giải pháp:** Đã fix bằng `Map` thay vì `Set`

### Filter không hoạt động
**Nguyên nhân:** Case sensitivity

**Giải pháp:** Đã convert về lowercase cho cả search term và user name

### Click username không focus input
**Nguyên nhân:** Input không có class `.chat-input`

**Giải pháp:** Verify input có class `chat-input`

## ✅ Summary

**Tính năng Mention/Tag Users bao gồm:**
- ✅ Click vào username để tag
- ✅ Gõ `@` để hiển thị suggestions
- ✅ Auto-filter khi gõ tiếp
- ✅ Keyboard accessible
- ✅ Smooth animations
- ✅ Efficient deduplication
- ✅ Optimized performance

**Implemented:** 2025-11-22
**Feature:** User Mention/Tag System
