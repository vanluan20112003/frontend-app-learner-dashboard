# Firebase Rules Update - With Users Node

Để tính năng block user hoạt động với Firebase Rules hiện tại, bạn cần cập nhật rules để cho phép users tự sync data.

## 📋 Firebase Rules cần thêm:

Copy và paste rules này vào Firebase Console (thay thế toàn bộ):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "generalChat": {
      "messages": {
        ".read": true,
        ".indexOn": ["userId", "timestamp"],
        "$messageId": {
          ".write": "!data.exists() || (auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true)",
          ".validate": "newData.hasChildren(['text', 'userName', 'userId', 'userRole', 'timestamp'])",
          "text": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 500"
          },
          "userName": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 100"
          },
          "userId": {
            ".validate": "newData.isString() && newData.val().length > 0"
          },
          "userRole": {
            ".validate": "newData.isString()"
          },
          "isStaff": {
            ".validate": "newData.isBoolean()"
          },
          "isAdmin": {
            ".validate": "newData.isBoolean()"
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
      },
      "blockedUsers": {
        ".read": "auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true",
        "$userId": {
          ".write": "auth != null && root.child('users').child(auth.uid).child('isStaff').val() === true",
          ".validate": "newData.hasChildren(['userId', 'userName', 'blockedAt', 'blockedBy', 'blockedByName'])",
          "userId": {
            ".validate": "newData.isString()"
          },
          "userName": {
            ".validate": "newData.isString()"
          },
          "blockedAt": {
            ".validate": "newData.isString()"
          },
          "blockedBy": {
            ".validate": "newData.isString()"
          },
          "blockedByName": {
            ".validate": "newData.isString()"
          },
          "$other": {
            ".validate": false
          }
        }
      },
      "pinnedMessage": {
        ".read": true,
        ".write": "auth != null && (root.child('users').child(auth.uid).child('isStaff').val() === true || root.child('users').child(auth.uid).child('isAdmin').val() === true)",
        ".validate": "newData.hasChildren(['messageId', 'text', 'userName', 'userId', 'pinnedAt', 'pinnedBy', 'pinnedByName'])",
        "messageId": {
          ".validate": "newData.isString()"
        },
        "text": {
          ".validate": "newData.isString()"
        },
        "userName": {
          ".validate": "newData.isString()"
        },
        "userId": {
          ".validate": "newData.isString()"
        },
        "isStaff": {
          ".validate": "newData.isBoolean()"
        },
        "isAdmin": {
          ".validate": "newData.isBoolean()"
        },
        "pinnedAt": {
          ".validate": "newData.val() === now"
        },
        "pinnedBy": {
          ".validate": "newData.isString()"
        },
        "pinnedByName": {
          ".validate": "newData.isString()"
        },
        "$other": {
          ".validate": false
        }
      },
      "bannedWords": {
        ".read": "auth != null",
        "$wordId": {
          ".write": "auth != null && (root.child('users').child(auth.uid).child('isStaff').val() === true || root.child('users').child(auth.uid).child('isAdmin').val() === true)",
          ".validate": "newData.hasChildren(['word', 'addedBy', 'addedByName', 'addedAt'])",
          "word": {
            ".validate": "newData.isString()"
          },
          "addedBy": {
            ".validate": "newData.isString()"
          },
          "addedByName": {
            ".validate": "newData.isString()"
          },
          "addedAt": {
            ".validate": "newData.isString()"
          },
          "$other": {
            ".validate": false
          }
        }
      }
    },
    "generalChatDev": {
      "messages": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".indexOn": ["userId", "timestamp"]
      },
      "blockedUsers": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "pinnedMessage": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "bannedWords": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

## 🔑 Key Changes:

1. **Thêm `users` node:**
   ```json
   "users": {
     "$uid": {
       ".read": "auth != null",
       ".write": "auth != null && auth.uid === $uid"
     }
   }
   ```
   - Cho phép users tự sync `isStaff`/`isAdmin` status
   - Mỗi user chỉ có thể write vào node của chính mình

2. **Thêm `bannedWords` rules:**
   - Read: tất cả authenticated users
   - Write: chỉ staff/admin

3. **Fix `blockedUsers` validation:**
   - Thêm `userId` vào required fields

## 📝 Cách hoạt động:

1. User login → `syncUserToFirebase()` được gọi
2. Function tự động tạo/update `users/{uid}` với `isStaff`/`isAdmin`
3. Firebase Rules check `root.child('users').child(auth.uid).child('isStaff')`
4. Nếu `isStaff: true` → cho phép block users
5. Nếu `isStaff: false` → không cho phép

## ✅ Steps to Deploy:

1. Copy rules trên
2. Mở Firebase Console → Realtime Database → Rules
3. Paste và click **Publish**
4. Reload app
5. Login → `users/{uid}` sẽ tự động được tạo
6. Block user sẽ hoạt động! 🎉
