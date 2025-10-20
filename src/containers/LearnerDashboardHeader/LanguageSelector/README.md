# Language Selector Component

Component cho phép người dùng chọn ngôn ngữ hiển thị trong ứng dụng Learner Dashboard.

## Tính năng

- Hiển thị dropdown với danh sách các ngôn ngữ được hỗ trợ
- Lưu lựa chọn ngôn ngữ vào cookie
- Tự động reload trang để áp dụng ngôn ngữ mới
- Hỗ trợ RTL (Right-to-Left) cho các ngôn ngữ như Arabic, Hebrew
- Responsive design - ẩn tên ngôn ngữ trên mobile

## Ngôn ngữ được hỗ trợ

- English (en)
- Español (es-419)
- Français (fr)
- 中文 (简体) (zh-cn)
- العربية (ar)
- Català (ca)
- עברית (he)
- Bahasa Indonesia (id)
- 한국어 (ko-kr)
- Polski (pl)
- Português (Brasil) (pt-br)
- Русский (ru)
- ไทย (th)
- Українська (uk)
- Tiếng Việt (vi)

## Cách sử dụng

Component này đã được tích hợp vào `LearnerDashboardHeader` và sẽ tự động hiển thị ở góc phải của header.

```jsx
import LanguageSelector from './LanguageSelector';

<LanguageSelector />
```

## Cấu hình

Component sử dụng các cấu hình sau từ `@edx/frontend-platform`:

- `LANGUAGE_PREFERENCE_COOKIE_NAME`: Tên cookie để lưu lựa chọn ngôn ngữ (mặc định: 'openedx-language-preference')
- `SESSION_COOKIE_DOMAIN`: Domain cho cookie (nếu có)

## Tùy chỉnh

Để thêm ngôn ngữ mới, cập nhật mảng `SUPPORTED_LANGUAGES` trong file `index.jsx`:

```javascript
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  // Thêm ngôn ngữ mới ở đây
];
```

## Styling

CSS được định nghĩa trong file `LanguageSelector.scss`. Có thể tùy chỉnh:

- Màu sắc của icon và text
- Kích thước dropdown
- Hiệu ứng hover
- Responsive breakpoints
