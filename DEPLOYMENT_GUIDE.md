# Deployment Guide

This guide will help you deploy your Auto-Review system to production.

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] You've tested the app locally (`npm start`)
- [ ] All feedback messages are correct in `src/data/feedbackMessages.js`
- [ ] Google Review URL is correct in `src/components/ReviewRedirect.js`
- [ ] You've built the production version (`npm run build`)

## Deployment Options

### Option 1: Netlify (Recommended for Beginners)

**Pros**: Free, easy, automatic HTTPS, custom domain support

**Steps**:

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:

   **Method A: Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or login
   - Drag the `build` folder to the upload area
   - Done! You'll get a URL like `https://your-site.netlify.app`

   **Method B: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   ```

3. **Add Custom Domain** (Optional):
   - Go to Site Settings → Domain Management
   - Add your custom domain
   - Update DNS records as instructed

4. **Update QR Codes**:
   - Update `BASE_URL` in `scripts/generateQRCodes.js` with your Netlify URL
   - Run `npm run generate-qr`

### Option 2: Vercel

**Pros**: Free, fast, great for React apps, automatic HTTPS

**Steps**:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel login
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project? No
   - Project name: `auto-review-system`
   - Directory: `./`
   - Override settings? No

4. **Production Deployment**:
   ```bash
   vercel --prod
   ```

5. **Update QR Codes**:
   - Update `BASE_URL` with your Vercel URL
   - Run `npm run generate-qr`

### Option 3: GitHub Pages

**Pros**: Free, integrated with GitHub

**Steps**:

1. **Add homepage to package.json**:
   ```json
   "homepage": "https://yourusername.github.io/auto-review-system"
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts to package.json**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Update QR Codes**:
   - Update `BASE_URL` with your GitHub Pages URL
   - Run `npm run generate-qr`

### Option 4: Your Own Server (cPanel, VPS, etc.)

**Pros**: Full control, use existing hosting

**Steps**:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload Files**:
   - Upload all files from the `build` folder to your server
   - Place them in your web root directory (e.g., `public_html`, `www`, or `htdocs`)

3. **Configure Server** (Important!):

   **For Apache** (create/edit `.htaccess` in your web root):
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

   **For Nginx** (edit your site config):
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

4. **Enable HTTPS**:
   - Get SSL certificate (Let's Encrypt is free)
   - Or use your hosting provider's SSL

5. **Update QR Codes**:
   - Update `BASE_URL` with your domain
   - Run `npm run generate-qr`

## Post-Deployment Steps

### 1. Test Your Deployment

Visit these URLs (replace with your domain):

- `https://yourdomain.com/review?id=0`
- `https://yourdomain.com/review?id=50`
- `https://yourdomain.com/review`

**Test checklist**:
- [ ] Page loads quickly
- [ ] Feedback copies automatically
- [ ] Countdown shows correctly
- [ ] Redirects to Google Reviews
- [ ] Works on mobile (iPhone & Android)
- [ ] Works on different browsers

### 2. Generate Final QR Codes

Now that you have your production URL:

1. Update `scripts/generateQRCodes.js`:
   ```javascript
   const BASE_URL = 'https://your-actual-domain.com/review';
   ```

2. Generate QR codes:
   ```bash
   npm run generate-qr
   ```

3. Verify in `qr-codes/qr-codes-preview.html` that all URLs are correct

### 3. Download and Print QR Codes

1. Open `qr-codes/qr-codes-preview.html` in browser
2. Download the QR codes you want to use
3. Print them at high quality (300 DPI recommended)

**Printing Tips**:
- Use high-quality paper
- Test scan before mass printing
- Print size: at least 2x2 inches for easy scanning
- Include text like "Scan to Review Us!"

### 4. Set Up Analytics (Optional)

If you want to track QR code usage:

1. Create Google Analytics account at [analytics.google.com](https://analytics.google.com)

2. Get your Measurement ID (looks like `G-XXXXXXXXXX`)

3. Update `public/index.html`:
   - Uncomment the Google Analytics code
   - Replace `GA_MEASUREMENT_ID` with your actual ID

4. Rebuild and redeploy:
   ```bash
   npm run build
   # Then redeploy using your chosen method
   ```

## Domain Configuration

### Using Custom Domain

Most hosting providers allow custom domains. General steps:

1. **Purchase domain** (from GoDaddy, Namecheap, Google Domains, etc.)

2. **Point domain to your hosting**:
   - For Netlify/Vercel: Use their nameservers or add DNS records
   - For your own server: Update A record to point to your server IP

3. **Wait for DNS propagation** (can take 24-48 hours)

4. **Update QR codes** with new domain and regenerate

### Using Subdomain

You can use a subdomain like `review.yourwebsite.com`:

1. Add a CNAME record pointing to your deployment
2. Configure in your hosting provider
3. Update QR codes and regenerate

## Updating Your Deployment

When you need to make changes:

1. **Update code locally**
2. **Test**: `npm start`
3. **Build**: `npm run build`
4. **Deploy using your chosen method**

For Netlify: Just drag and drop the new `build` folder
For Vercel: Run `vercel --prod`
For your server: Upload new files

## Security Best Practices

1. **Always use HTTPS** in production
2. **Keep dependencies updated**: Run `npm audit` regularly
3. **Don't commit sensitive data** to Git
4. **Use environment variables** for sensitive config

## Performance Optimization

Already optimized, but you can also:

1. **Enable CDN** (Netlify/Vercel do this automatically)
2. **Enable Gzip compression** (usually enabled by default)
3. **Use custom domain** instead of subdomain for better performance

## Troubleshooting Deployment Issues

### Issue: Blank page after deployment

**Solution**:
- Check browser console for errors
- Ensure all files from `build` folder were uploaded
- Verify server routing is configured correctly

### Issue: 404 on refresh

**Solution**: Configure server routing (see server configuration above)

### Issue: Images or assets not loading

**Solution**:
- Check `homepage` in `package.json` is correct
- Use relative paths for assets

### Issue: QR codes showing wrong domain

**Solution**:
- Update `BASE_URL` in `scripts/generateQRCodes.js`
- Regenerate QR codes: `npm run generate-qr`

## Cost Estimates

- **Netlify/Vercel Free Tier**: $0/month (sufficient for most use cases)
- **Domain Name**: $10-15/year
- **Custom Email** (optional): $5-10/month

## Monitoring

Keep an eye on:
- Google Review page - see reviews coming in!
- Analytics (if enabled) - track QR code usage
- Hosting dashboard - monitor traffic

## Backup

Important files to backup:
- `src/data/feedbackMessages.js` - your feedback messages
- `qr-codes/` folder - your generated QR codes
- `build/` folder - your production build

## Support

If you run into issues:
1. Check browser console for errors
2. Verify all URLs are correct
3. Test on multiple devices
4. Check hosting provider documentation

---

**Congratulations!** 🎉

Your Auto-Review system is now live and ready to collect Google reviews!

## Quick Reference

```bash
# Build for production
npm run build

# Generate QR codes
npm run generate-qr

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

**Need more help?** Refer to:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Initial setup instructions
- Your hosting provider's documentation
