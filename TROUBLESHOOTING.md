# Troubleshooting Guide

Common issues and their solutions for the Auto-Review system.

## Installation Issues

### Problem: "npm: command not found"

**Cause**: Node.js is not installed on your system.

**Solution**:
1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS version
3. Install Node.js
4. Restart your terminal
5. Run `node --version` to verify installation

### Problem: "npm install" fails with errors

**Cause**: Network issues or corrupted npm cache.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### Problem: Permission denied errors on Mac/Linux

**Cause**: Need elevated permissions.

**Solution**:
```bash
# Use sudo (not recommended for install)
sudo npm install

# Better: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

## Development Issues

### Problem: "npm start" opens blank page

**Cause**: Port already in use or build issue.

**Solution**:
```bash
# Kill process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Clear build and restart
rm -rf node_modules build
npm install
npm start
```

### Problem: Hot reload not working

**Cause**: File watcher limits or WSL issues.

**Solution**:
```bash
# On Linux, increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# On Windows WSL, add to package.json:
"start": "CHOKIDAR_USEPOLLING=true react-scripts start"
```

### Problem: CSS changes not showing

**Cause**: Browser cache.

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private mode
4. Check if you saved the CSS file

## Clipboard Issues

### Problem: Auto-copy not working on iPhone

**Cause**: iOS Safari restricts clipboard access.

**Solution**: This is expected behavior. The app automatically shows a manual copy button as fallback. This is built into the system.

**What users see**:
- Manual "Copy Feedback" button
- Instructions to paste in Google Reviews
- Works perfectly, just one extra tap

### Problem: Clipboard permission denied

**Cause**: Browser security settings.

**Solution**:
1. Allow clipboard permissions in browser settings
2. Use HTTPS (required for clipboard API)
3. Fallback button will appear automatically

### Problem: Text copied but appears empty

**Cause**: JavaScript not loading properly.

**Solution**:
1. Check browser console for errors
2. Ensure `feedbackMessages.js` is loading
3. Verify ID parameter is valid (0-199)
4. Test with: `/review?id=0`

## QR Code Issues

### Problem: "qrcode: command not found"

**Cause**: qrcode package not installed.

**Solution**:
```bash
npm install qrcode --save-dev
```

### Problem: QR codes not generating

**Cause**: Script errors or missing directories.

**Solution**:
```bash
# Create directories
mkdir -p qr-codes

# Run directly with node
node scripts/generateQRCodes.js

# Check for errors
npm run generate-qr 2>&1 | tee qr-error.log
```

### Problem: QR codes scan to wrong URL

**Cause**: BASE_URL in script is incorrect.

**Solution**:
1. Open `scripts/generateQRCodes.js`
2. Update `BASE_URL` to your deployed URL:
   ```javascript
   const BASE_URL = 'https://your-actual-domain.com/review';
   ```
3. Regenerate QR codes: `npm run generate-qr`

### Problem: QR code image quality is poor

**Cause**: Default settings or printer quality.

**Solution**:
1. In `generateQRCodes.js`, increase width:
   ```javascript
   width: 1000,  // Instead of 500
   ```
2. Use high-quality paper
3. Print at 300 DPI or higher
4. Test scan before mass printing

## Deployment Issues

### Problem: Blank page after deployment

**Cause**: Incorrect routing configuration or build path.

**Solution**:

**For Netlify**:
Create `public/_redirects` file:
```
/*    /index.html   200
```

**For Vercel**:
Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**For Apache**:
Create `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Problem: 404 error on page refresh

**Cause**: Server not configured for client-side routing.

**Solution**: Apply server configuration above for your hosting provider.

### Problem: Assets not loading (404 for CSS/JS)

**Cause**: Incorrect `homepage` in package.json.

**Solution**:
1. If deploying to subdirectory:
   ```json
   "homepage": "https://yourdomain.com/subfolder"
   ```
2. If deploying to root:
   ```json
   "homepage": "https://yourdomain.com"
   ```
3. Or remove `homepage` field entirely
4. Rebuild: `npm run build`

### Problem: HTTPS not working

**Cause**: SSL certificate not configured.

**Solution**:
- **Netlify/Vercel**: HTTPS is automatic
- **Your server**: Get free SSL from [Let's Encrypt](https://letsencrypt.org)
- **cPanel**: Enable AutoSSL in hosting panel

## Google Review Issues

### Problem: Redirect not working

**Cause**: Incorrect Google Review URL.

**Solution**:
1. Test your Google Review URL in browser
2. Update `GOOGLE_REVIEW_URL` in `ReviewRedirect.js`
3. Rebuild and redeploy

### Problem: Google Review link changed

**Cause**: Google updated their URL format.

**Solution**:
1. Get new review link:
   - Google your business
   - Click "Write a review"
   - Copy the URL
2. Update in `ReviewRedirect.js`
3. Redeploy

### Problem: Review not showing up on Google

**Cause**: Google moderation process.

**Solution**:
- Reviews can take 24-48 hours to appear
- Google filters suspicious reviews
- Ensure reviews are genuine and varied
- Don't use same feedback repeatedly

## Browser Compatibility Issues

### Problem: Not working in Internet Explorer

**Cause**: IE is not supported.

**Solution**: Ask users to use modern browsers:
- Chrome
- Firefox
- Safari
- Edge (new version)

### Problem: Animations not smooth on old phones

**Cause**: Low-end device performance.

**Solution**:
1. Reduce animations in CSS:
   ```css
   /* Add to ReviewRedirect.css */
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

## URL Parameter Issues

### Problem: ID parameter not working

**Cause**: Incorrect URL format or React Router issue.

**Solution**:
1. URL should be: `/review?id=0` (not `/review/0`)
2. Check browser console for errors
3. Verify `useSearchParams` is working
4. Test with different IDs: 0, 50, 100, 199

### Problem: "Invalid ID" showing

**Cause**: ID is out of range or not a number.

**Solution**:
- Valid IDs are 0-199
- Non-numeric IDs fall back to random
- This is expected behavior

## Mobile Device Issues

### Problem: QR code won't scan

**Cause**: Poor lighting, damaged QR code, or small size.

**Solution**:
1. Ensure good lighting
2. Print QR codes at least 2x2 inches
3. Use high-quality print
4. Test with multiple phones
5. Check if QR code image is clear

### Problem: Redirect too fast on mobile

**Cause**: Delay is too short.

**Solution**:
1. Increase `REDIRECT_DELAY` in `ReviewRedirect.js`:
   ```javascript
   const REDIRECT_DELAY = 2500; // 2.5 seconds
   ```
2. Rebuild and redeploy

### Problem: Buttons too small on mobile

**Cause**: CSS needs adjustment.

**Solution**:
1. In `ReviewRedirect.css`, increase button size:
   ```css
   button {
     padding: 18px 36px;  /* Increase from 15px 30px */
     font-size: 18px;     /* Increase from 16px */
   }
   ```

## Performance Issues

### Problem: Slow page load

**Cause**: Large bundle size or slow server.

**Solution**:
1. Check bundle size:
   ```bash
   npm run build
   # Check build/static/js/*.js file sizes
   ```
2. Optimize images if you added any
3. Use CDN (Netlify/Vercel provide this)
4. Enable compression on server

### Problem: High memory usage

**Cause**: React DevTools or memory leak.

**Solution**:
1. Disable React DevTools in production
2. Check for memory leaks with Chrome DevTools
3. Use production build: `npm run build`

## Analytics Issues

### Problem: Google Analytics not tracking

**Cause**: GA not configured or blocked.

**Solution**:
1. Verify GA code is uncommented in `index.html`
2. Replace `GA_MEASUREMENT_ID` with your actual ID
3. Check browser console for GA errors
4. Disable ad blockers for testing
5. Allow 24-48 hours for data to appear in GA

### Problem: Events not showing in GA

**Cause**: gtag not loaded or wrong event name.

**Solution**:
1. Check if gtag is loaded: Type `window.gtag` in browser console
2. Verify event name in GA dashboard
3. Test in GA's RealTime view

## Data Issues

### Problem: Want to update feedback messages

**Cause**: Not an issue - this is by design!

**Solution**:
1. Edit `src/data/feedbackMessages.js`
2. Add, remove, or modify messages
3. Rebuild: `npm run build`
4. Redeploy
5. Regenerate QR codes if IDs changed

### Problem: Need more than 200 feedbacks

**Cause**: Array limit.

**Solution**:
1. Add more messages to array in `feedbackMessages.js`
2. Update `TOTAL_FEEDBACKS` in `generateQRCodes.js`
3. Regenerate QR codes

## Getting Help

### Check These First:
1. Browser console for errors (F12)
2. Network tab in DevTools
3. React error overlay messages
4. Terminal output when running

### Still Stuck?

**Debugging Checklist**:
- [ ] Cleared browser cache
- [ ] Restarted development server
- [ ] Checked all URLs are correct
- [ ] Verified files are saved
- [ ] Tested on different browser
- [ ] Checked terminal for errors
- [ ] Tried on different device

### Useful Commands:

```bash
# See npm version
npm --version

# See node version
node --version

# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# Build and check for errors
npm run build

# Check for security issues
npm audit

# Update packages
npm update
```

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| "Module not found" | Missing dependency | `npm install` |
| "port already in use" | Port 3000 is busy | Kill process or use different port |
| "Cannot find module" | Import path wrong | Check file paths |
| "Unexpected token" | Syntax error | Check recent code changes |

## Prevention Tips

To avoid issues:
1. ✅ Always test locally before deploying
2. ✅ Keep Node.js and npm updated
3. ✅ Use version control (Git)
4. ✅ Test on multiple browsers
5. ✅ Test on mobile devices
6. ✅ Keep backups of working versions
7. ✅ Document any custom changes
8. ✅ Test QR codes before printing many

---

**Still having issues?**
- Check README.md for detailed documentation
- Review code comments for implementation details
- Test with the simplest possible setup first

Most issues are related to:
1. Installation/dependencies (50%)
2. Configuration/URLs (30%)
3. Browser compatibility (15%)
4. Server setup (5%)
