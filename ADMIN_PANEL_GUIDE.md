# Admin Panel Guide

## Overview

Your portfolio now includes a powerful admin panel that allows you to control which GitHub projects are displayed on your website.

## How to Access

1. **Click the Admin icon** in the top navigation bar (Shield icon next to "Book a meeting")
2. **Enter the password** when prompted
3. Manage your projects and save changes

## Default Password

```
yameen@2026
```

**⚠️ Important**: Change this password after first login for security.

## Features

### ✅ Project Visibility Control
- Toggle any project on/off with a beautiful switch interface
- See real-time preview of which projects are visible
- Changes persist across browser sessions

### ✅ Live Preview
- Each project card shows:
  - Project name
  - Description
  - Programming language
  - Stars and forks count
  - Current visibility status

### ✅ Batch Management
- View all projects at once
- See how many projects are visible
- Quick toggle for each project

## How to Use

### Step 1: Login
1. Click the **Admin** button in the navigation
2. Enter password: `yameen@2026`
3. Click **Sign In**

### Step 2: Manage Projects
- **Toggle Projects**: Click the switch next to any project
  - 🟢 Green switch with Eye icon = Visible
  - ⚫ Gray switch with EyeOff icon = Hidden
- **View Details**: Each card shows project stats and description

### Step 3: Save Changes
1. After toggling projects, click **Save Changes**
2. The page will automatically reload
3. Your changes are now live!

### Step 4: Logout
- Click **Logout** button when done
- This secures your admin panel

## How It Works

### Storage
- Settings are stored in **browser localStorage**
- Persists across sessions
- Works offline after first load

### Security
- Password-protected access
- Session-based authentication
- Simple but effective for static sites

### Data Flow
```
GitHub API → Fetch All Repos → Apply Visibility Filter → Display on Portfolio
```

## Changing the Password

### Option 1: In Browser Console
```javascript
localStorage.setItem('portfolio_admin_password', btoa('your-new-password'));
```

### Option 2: In Code
Edit `/lib/projectSettings.ts`:
```typescript
const DEFAULT_PASSWORD = 'your-new-password';
```

## Advanced Usage

### Reset All Settings
Open browser console and run:
```javascript
localStorage.removeItem('portfolio_project_visibility');
localStorage.removeItem('portfolio_admin_password');
sessionStorage.removeItem('portfolio_admin_auth');
location.reload();
```

### Show All Projects
In admin panel, toggle all switches to green, then save.

### Hide Specific Categories
Use the toggles to hide projects by type (e.g., hide all classwork projects).

## Keyboard Shortcuts

- `Esc` - Close admin panel
- `Enter` - Submit password (on login screen)

## Tips

1. **Curate Your Best Work**: Hide older or less relevant projects
2. **Seasonal Updates**: Show different projects based on job applications
3. **Regular Maintenance**: Review and update visibility monthly
4. **Performance**: Fewer projects = faster page load

## Troubleshooting

### Can't Login?
- Check password (case-sensitive)
- Default is: `yameen@2026`
- Clear browser data and try again

### Projects Not Updating?
- Make sure to click "Save Changes"
- Wait for page reload
- Clear browser cache if needed

### Admin Button Not Visible?
- Check navigation bar (top right area)
- Look for Shield icon
- Try refreshing the page

## Design Philosophy

The admin panel is designed to:
- ✨ Match your portfolio's dark theme
- 🎨 Provide intuitive visual feedback
- ⚡ Work fast and efficiently
- 🔒 Keep your content secure
- 📱 Work on all devices

## Future Enhancements

Potential additions:
- Project ordering/sorting
- Featured project marking
- Category-based filtering
- Analytics integration
- Multi-user support
- Cloud sync

---

**Made with ❤️ for Yameen's Portfolio**
