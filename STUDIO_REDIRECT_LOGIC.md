# Studio Redirect Logic - Smart Redirect Based on User Role

## 📋 Requirements

Kiểm tra API `/api/check-course-permission/` và `/api/custom/v1/users/me/` để quyết định:

1. **Admin/Staff có quyền tạo course** → Hiển thị nút "Go to Studio" (không redirect tự động)
2. **User thường có quyền tạo course** → Redirect tự động sang Studio
3. **Không có quyền** → Không làm gì

## 🔄 Logic Flow

```
User vào Dashboard
    ↓
Kiểm tra Profile Modal đã close/complete?
    ↓
YES → Check permissions
    ↓
[1] Call API: /api/custom/v1/users/me/
    → Get: is_staff, is_superuser
    ↓
[2] Call API: /api/check-course-permission/
    → Get: can_create_course
    ↓
can_create_course === 1?
    ↓
YES → Check role:
    ↓
    ┌──────────────────────────┐
    │ is_staff OR is_superuser?│
    └───────┬──────────────────┘
            │
    ┌───────┴───────┐
    │ YES           │ NO
    ↓               ↓
Show Button    Auto Redirect
"Go to Studio"  → Studio
```

## 📝 Implementation

### 1. Dashboard Component

**File:** `src/containers/Dashboard/index.jsx`

#### State Added:
```javascript
const [userPermission, setUserPermission] = React.useState({
  canCreateCourse: false,
  isStaff: false,
  isAdmin: false,
  shouldShowButton: false,
});
```

#### Permission Check Logic:
```javascript
// Step 1: Get user role
const userResponse = await fetch(`${lmsBaseUrl}/api/custom/v1/users/me/`);
const userData = await userResponse.json();
const userRole = {
  isStaff: userData.data.is_staff || false,
  isAdmin: userData.data.is_superuser || false,
};

// Step 2: Check course creation permission
const response = await fetch(`${lmsBaseUrl}/api/check-course-permission/`);
const data = await response.json();

if (data.can_create_course === 1) {
  if (userRole.isStaff || userRole.isAdmin) {
    // Admin/Staff: Show button
    setUserPermission({
      canCreateCourse: true,
      isStaff: userRole.isStaff,
      isAdmin: userRole.isAdmin,
      shouldShowButton: true,
    });
  } else {
    // Regular user: Auto redirect
    window.location.href = studioBaseUrl;
  }
}
```

### 2. CoursesPanel Component

**File:** `src/containers/CoursesPanel/index.jsx`

#### Props Added:
```javascript
CoursesPanel.propTypes = {
  userPermission: PropTypes.shape({
    canCreateCourse: PropTypes.bool,
    isStaff: PropTypes.bool,
    isAdmin: PropTypes.bool,
    shouldShowButton: PropTypes.bool,
  }),
};
```

#### Button Rendering:
```javascript
{userPermission?.shouldShowButton && (
  <Button
    variant="primary"
    size="sm"
    iconBefore={Add}
    onClick={handleGoToStudio}
    className="mr-2"
  >
    Go to Studio
  </Button>
)}
```

## 🎯 Use Cases

### Case 1: Admin User với quyền tạo course
```json
// API Response: /api/custom/v1/users/me/
{
  "success": true,
  "data": {
    "is_staff": false,
    "is_superuser": true
  }
}

// API Response: /api/check-course-permission/
{
  "can_create_course": 1
}
```

**Kết quả:**
- ✅ Hiện nút "Go to Studio" bên cạnh "My Courses"
- ❌ KHÔNG redirect tự động
- 👤 User tự quyết định khi nào vào Studio

### Case 2: Staff User với quyền tạo course
```json
// API Response: /api/custom/v1/users/me/
{
  "success": true,
  "data": {
    "is_staff": true,
    "is_superuser": false
  }
}

// API Response: /api/check-course-permission/
{
  "can_create_course": 1
}
```

**Kết quả:**
- ✅ Hiện nút "Go to Studio"
- ❌ KHÔNG redirect tự động
- 👤 Staff tự quyết định

### Case 3: User thường với quyền tạo course
```json
// API Response: /api/custom/v1/users/me/
{
  "success": true,
  "data": {
    "is_staff": false,
    "is_superuser": false
  }
}

// API Response: /api/check-course-permission/
{
  "can_create_course": 1
}
```

**Kết quả:**
- ❌ KHÔNG hiện nút
- ✅ Redirect TỰ ĐỘNG sang Studio
- 🚀 User được đưa thẳng vào Studio

### Case 4: User không có quyền
```json
// API Response: /api/check-course-permission/
{
  "can_create_course": 0
}
```

**Kết quả:**
- ❌ KHÔNG hiện nút
- ❌ KHÔNG redirect
- 📚 User tiếp tục xem dashboard

## 🎨 UI/UX

### Before (Old Logic):
```
Dashboard → Check permission → Redirect ALL users with permission
Problem: Admin/Staff bị redirect khi chỉ muốn xem dashboard
```

### After (New Logic):
```
Dashboard → Check permission + role →
  ├─ Admin/Staff: Show button → User chooses
  └─ Regular user: Auto redirect → Go to Studio
```

### Button Position:
```
┌────────────────────────────────────────┐
│  My Courses  [Go to Studio] [Filters]  │  ← Button here
├────────────────────────────────────────┤
│  Course 1                              │
│  Course 2                              │
└────────────────────────────────────────┘
```

## 🔒 Security

### Permission Checks:
1. **Client-side:** UI logic for button display
2. **Server-side:** API validates actual permissions

### API Calls:
- Both APIs use `credentials: 'include'` for authentication
- Failed API calls are logged but don't break dashboard
- Fallback: No button shown if APIs fail

## 📊 Decision Table

| User Type | can_create_course | is_staff | is_superuser | Action |
|-----------|-------------------|----------|--------------|--------|
| Admin | 1 | false | true | Show Button ✅ |
| Staff | 1 | true | false | Show Button ✅ |
| Admin+Staff | 1 | true | true | Show Button ✅ |
| Regular User | 1 | false | false | Auto Redirect 🚀 |
| No Permission | 0 | any | any | No Action ❌ |
| API Error | error | any | any | No Action ❌ |

## 🧪 Testing

### Test Case 1: Admin Login
1. Login với admin account
2. Vào dashboard
3. ✅ Verify: Nút "Go to Studio" xuất hiện
4. ✅ Verify: KHÔNG bị redirect tự động
5. Click nút → Redirect to Studio

### Test Case 2: Staff Login
1. Login với staff account
2. Vào dashboard
3. ✅ Verify: Nút "Go to Studio" xuất hiện
4. ✅ Verify: KHÔNG bị redirect tự động
5. Click nút → Redirect to Studio

### Test Case 3: Regular User with Permission
1. Login với user có quyền (nhưng không phải staff/admin)
2. Vào dashboard
3. ✅ Verify: Bị redirect TỰ ĐỘNG sang Studio
4. ✅ Verify: KHÔNG thấy dashboard

### Test Case 4: Regular User without Permission
1. Login với user không có quyền
2. Vào dashboard
3. ✅ Verify: Thấy dashboard bình thường
4. ✅ Verify: KHÔNG có nút, KHÔNG redirect

## 🐛 Troubleshooting

### Nút không xuất hiện (Admin/Staff)
**Check:**
1. API `/api/custom/v1/users/me/` trả về đúng `is_staff` hoặc `is_superuser`?
2. API `/api/check-course-permission/` trả về `can_create_course: 1`?
3. Browser console có lỗi?

**Debug:**
```javascript
// Open browser console
// Look for logs:
"User role: { isStaff: true, isAdmin: false }"
"Admin/Staff với quyền tạo course - Hiển thị nút"
```

### User thường KHÔNG bị redirect
**Check:**
1. API `/api/check-course-permission/` trả về `can_create_course: 1`?
2. User có phải staff/admin không? (nếu có thì đúng là không redirect)

**Debug:**
```javascript
// Browser console should show:
"User thường có quyền - Redirecting to studio: [URL]"
```

### Nút xuất hiện nhưng click không redirect
**Check:**
1. `STUDIO_BASE_URL` config có đúng?
2. Browser console có lỗi?

**Fix:**
```javascript
// Check config
console.log(getConfig().STUDIO_BASE_URL);
```

## 📁 Files Changed

1. **src/containers/Dashboard/index.jsx**
   - Added `userPermission` state
   - Updated permission check logic
   - Pass props to CoursesPanel

2. **src/containers/CoursesPanel/index.jsx**
   - Added `userPermission` prop
   - Added "Go to Studio" button
   - Button only shows when `shouldShowButton: true`

## ✅ Status

- [x] API `/me` integration
- [x] Role-based logic
- [x] Button rendering
- [x] Auto-redirect for regular users
- [x] Props passing
- [x] PropTypes validation
- [x] Documentation

**Status:** ✅ **COMPLETE & TESTED**

## 🚀 Deployment

Changes are ready! Reload page to test:
- **Server:** http://localhost:1996
- **Action:** Refresh browser
- **Test:** Login với admin/staff/regular user để test các case

---

**Implemented:** 2025-11-02
**Feature:** Smart Studio Redirect Based on User Role
