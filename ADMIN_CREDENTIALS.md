# Admin Login Credentials

## 🔐 Working Admin Credentials

### **Admin Panel URL**: http://localhost:3002/admin/login

### **Valid Credentials** (case-sensitive):

| Username | Password | Description |
|----------|----------|-------------|
| `admin` | `password` | Main admin account |
| `pcb_admin` | `123456` | PCB specific admin |
| `test` | `test123` | Test account |

## 🧪 Test Pages

- **Admin Test Page**: http://localhost:3002/admin-test 
- **System Info**: http://localhost:3002/info
- **Credentials API**: http://localhost:3002/admin/test-credentials

## 🚀 Quick Test Steps

1. Go to: http://localhost:3002/admin-test
2. Click any "Login as..." button for automatic login
3. Or manually enter:
   - Username: `admin`
   - Password: `password`

## 🔍 Troubleshooting

If login fails, check:
1. **Case sensitivity**: Use exact case as shown above
2. **No extra spaces**: Copy credentials exactly
3. **Browser console**: Check for JavaScript errors
4. **Server logs**: Look for login attempt logs

## 📝 Notes

- All credentials are hardcoded for testing
- Session-based authentication
- Debug logs enabled in server console
- Quick login buttons available on login page

---

**If you're still having issues, try the admin test page first: http://localhost:3002/admin-test**