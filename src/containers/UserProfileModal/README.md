# User Profile Modal - Modal Thu Thập Dữ Liệu Người Dùng

Modal này được thiết kế để thu thập thông tin người dùng theo từng bước (multi-step), tương tự như trải nghiệm của Duolingo.

## Tính năng

### Hỗ trợ 3 loại người dùng:

1. **Sinh viên (Student)**
   - Thông tin cơ bản: Trường, Khoa, Ngành học
   - Bậc học: Cử nhân, Thạc sĩ, Khác
   - Năm học (chỉ cho cử nhân)
   - Giới tính
   - GPA/Tự đánh giá (không bắt buộc)
   - Lĩnh vực quan tâm (ít nhất 1)
   - Các môn/khóa đã học (không bắt buộc)
   - Mục tiêu ngắn hạn (ít nhất 1)
   - Nhóm tuổi

2. **Chuyên gia/Khác (Professional)**
   - Nghề nghiệp hiện tại
   - Giới tính
   - Lĩnh vực/Ngành
   - Mục tiêu chính (ít nhất 1)
   - Nhóm tuổi

3. **Giáo viên (Teacher)**
   - Môn/Chuyên ngành giảng dạy
   - Trường/Cơ sở
   - Giới tính
   - Nhóm tuổi

## Cấu trúc File

```
UserProfileModal/
├── index.jsx              # Component chính
├── index.scss             # Styling
├── hooks.js               # State management logic
├── constants.js           # Các hằng số và options
├── messages.js            # i18n messages
├── README.md              # Tài liệu này
└── components/
    ├── index.js
    ├── UserTypeStep.jsx
    ├── StudentBasicInfoStep.jsx
    ├── ProfessionalBasicInfoStep.jsx
    ├── TeacherBasicInfoStep.jsx
    ├── InterestsStep.jsx
    ├── GoalsStep.jsx
    └── DemographicsStep.jsx
```

## Cách sử dụng

### 1. Tự động hiển thị khi vào Dashboard

Modal sẽ tự động hiển thị khi:
- Người dùng vào dashboard lần đầu
- Chưa hoàn thành profile
- Chưa từng thấy modal này trước đó (kiểm tra qua localStorage)

Logic được triển khai tại:
- `src/containers/Dashboard/hooks.js` - Auto-open logic
- `src/containers/Dashboard/index.jsx` - Integration

### 2. Manual trigger

Bạn có thể trigger modal thủ công bằng Redux actions:

```javascript
import { reduxHooks } from 'hooks';

function MyComponent() {
  const openUserProfileModal = reduxHooks.useOpenUserProfileModal();

  return (
    <button onClick={openUserProfileModal}>
      Cập nhật thông tin
    </button>
  );
}
```

### 3. Nhận dữ liệu khi submit

```javascript
const handleUserProfileSubmit = (data) => {
  console.log('Dữ liệu người dùng:', data);

  // Gửi lên backend
  api.submitUserProfile(data);

  // Đánh dấu đã hoàn thành
  setUserProfileCompleted();
  localStorage.setItem('hasSeenProfileModal', 'true');
};
```

## Cấu trúc dữ liệu trả về

### Dữ liệu sinh viên:
```javascript
{
  userType: 'student',
  school: 'Đại học ABC',
  faculty: 'Công nghệ thông tin',
  major: 'Khoa học máy tính',
  educationLevel: 'bachelor',
  academicYear: '2',
  gender: 'male',
  gpa: 'good',
  fieldsOfInterest: ['it', 'data', 'economics'],
  previousCourses: 'Python, Java, Data Structures',
  studentGoals: ['increase_gpa', 'prepare_internship'],
  ageGroup: '18_24'
}
```

### Dữ liệu chuyên gia:
```javascript
{
  userType: 'professional',
  currentJob: 'Software Engineer',
  gender: 'female',
  professionalField: 'it',
  professionalGoals: ['level_up', 'certification'],
  ageGroup: '25_34'
}
```

### Dữ liệu giáo viên:
```javascript
{
  userType: 'teacher',
  teachingSubject: 'Lập trình Python',
  teachingSchool: 'Đại học XYZ',
  gender: 'other',
  ageGroup: '35_44'
}
```

## Redux Integration

### State Structure
```javascript
userProfileModal: {
  isOpen: false,
  hasCompletedProfile: false,
}
```

### Actions
- `openUserProfileModal()` - Mở modal
- `closeUserProfileModal()` - Đóng modal
- `setUserProfileCompleted()` - Đánh dấu đã hoàn thành

### Selectors
- `useUserProfileModalData()` - Lấy state của modal

## Validation

### Các trường bắt buộc:

**Sinh viên:**
- Trường học, Khoa, Bậc học
- Năm học (nếu chọn Cử nhân)
- Giới tính
- Ít nhất 1 lĩnh vực quan tâm
- Ít nhất 1 mục tiêu
- Nhóm tuổi

**Chuyên gia:**
- Nghề nghiệp hiện tại
- Giới tính
- Lĩnh vực
- Ít nhất 1 mục tiêu
- Nhóm tuổi

**Giáo viên:**
- Môn giảng dạy
- Trường
- Giới tính
- Nhóm tuổi

## Customization

### Thêm lĩnh vực quan tâm mới

Chỉnh sửa `constants.js`:
```javascript
export const FIELDS_OF_INTEREST = [
  // ... existing fields
  { value: 'new_field', label: 'New Field Name' },
];
```

### Thêm mục tiêu mới

```javascript
export const STUDENT_GOALS = [
  // ... existing goals
  { value: 'new_goal', label: 'New Goal Description' },
];
```

### Thêm ngôn ngữ mới

Chỉnh sửa `messages.js` và thêm message definitions. Translations sẽ được tự động tạo bởi Open edX translation system.

## Styling

CSS được tổ chức trong `index.scss` với:
- Responsive design (mobile-friendly)
- Smooth animations
- Dark mode support
- Paragon theme variables

### Customize colors

```scss
.user-profile-modal {
  .step-content h3 {
    color: var(--primary); // Thay đổi màu chủ đạo
  }
}
```

## Best Practices

1. **Performance**: Modal chỉ render khi cần thiết
2. **Accessibility**: Sử dụng semantic HTML và ARIA labels
3. **Mobile-first**: Responsive design cho mọi kích thước màn hình
4. **Validation**: Real-time validation với clear error messages
5. **UX**: Progress indicator, smooth transitions, clear navigation

## API Integration

Để tích hợp với backend, tạo API service:

```javascript
// src/data/services/userProfile.js
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export const submitUserProfile = async (data) => {
  const client = getAuthenticatedHttpClient();
  const response = await client.post('/api/user-profile/', data);
  return response.data;
};
```

Sau đó sử dụng trong Dashboard:

```javascript
import { submitUserProfile } from 'data/services/userProfile';

const handleUserProfileSubmit = async (data) => {
  try {
    await submitUserProfile(data);
    setUserProfileCompleted();
    localStorage.setItem('hasSeenProfileModal', 'true');
  } catch (error) {
    console.error('Failed to submit profile:', error);
    // Handle error
  }
};
```

## Testing

### Manual Testing Checklist

- [ ] Modal mở tự động khi vào dashboard lần đầu
- [ ] Chọn từng loại user type
- [ ] Điền form với dữ liệu hợp lệ
- [ ] Test validation errors
- [ ] Test navigation (Next, Back, Skip)
- [ ] Test submit functionality
- [ ] Test close và skip
- [ ] Test trên mobile
- [ ] Test với các field không bắt buộc

### Reset localStorage để test lại

```javascript
localStorage.removeItem('hasSeenProfileModal');
// Reload trang
```

## Troubleshooting

### Modal không hiển thị?
1. Check Redux state: `userProfileModal.isOpen`
2. Check localStorage: `hasSeenProfileModal`
3. Xóa localStorage và reload

### Validation không hoạt động?
1. Check `hooks.js` - `validateStep()` function
2. Verify field names trong form và validation logic

### Styling không đúng?
1. Verify SCSS import trong index.jsx
2. Check Paragon version compatibility
3. Clear cache và rebuild

## License

Tuân theo license của Open edX platform.
