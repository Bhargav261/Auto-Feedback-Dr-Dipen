# Quick Setup Guide

Follow these steps to get your Auto-Review system up and running!

## Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (~2-3 minutes).

## Step 2: Configure Your Google Review URL

Your current Google Review URL is already configured in the system:
```
https://www.google.com/search?sca_esv=7c031b0b1e1c228d&rlz=1C1UEAD_enIN1021IN1021...
```

If you need to update it later:

1. Open `src/components/ReviewRedirect.js`
2. Find the line with `GOOGLE_REVIEW_URL`
3. Replace with your new URL

## Step 3: Test the Application Locally

Run the development server:

```bash
npm start
```

This will open your browser at `http://localhost:3000`

**Test URLs to try:**
- `http://localhost:3000/review?id=0` - Test with first feedback
- `http://localhost:3000/review?id=50` - Test with feedback #50
- `http://localhost:3000/review` - Test with random feedback

## Step 4: Update Your Domain for QR Codes

Before generating QR codes, update your domain:

1. Open `scripts/generateQRCodes.js`
2. Find this line:
   ```javascript
   const BASE_URL = 'https://yourdomain.com/review';
   ```
3. Replace `yourdomain.com` with your actual domain, for example:
   ```javascript
   const BASE_URL = 'https://anshdentalcare.com/review';
   ```

## Step 5: Generate QR Codes

After deploying your site, generate QR codes:

```bash
npm run generate-qr
```

This creates:
- 200 unique QR codes in `qr-codes/` folder
- 1 random QR code
- A CSV file with all URLs
- An HTML preview page

**View QR Codes:**
Open `qr-codes/qr-codes-preview.html` in your browser to see all QR codes.

## Step 6: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Step 7: Deploy Your Site

### Option A: Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop your `build` folder
4. Done! Netlify gives you a URL

### Option B: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Done!

### Option C: Your Own Server

1. Upload contents of `build/` folder to your web server
2. Configure server to serve `index.html` for all routes
3. Done!

## Step 8: Regenerate QR Codes with Real Domain

After deployment:

1. Update `BASE_URL` in `scripts/generateQRCodes.js` with your actual deployed URL
2. Run: `npm run generate-qr` again
3. Download and print the QR codes

## Step 9: Print and Use QR Codes

1. Open `qr-codes/qr-codes-preview.html`
2. Right-click on each QR code and "Download"
3. Print them on:
   - Business cards
   - Table tents
   - Flyers
   - Posters
   - Receipts

## Testing Checklist

Before going live, test:

- [ ] QR code scans correctly on your phone
- [ ] Text copies to clipboard automatically
- [ ] Redirect to Google Reviews works
- [ ] Fallback copy button works (try on iPhone Safari)
- [ ] Try multiple different feedback IDs
- [ ] Test on different devices (iPhone, Android, Desktop)

## Customization Options

### Change Colors

Edit `src/components/ReviewRedirect.css`:

```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your brand colors, example: */
background: linear-gradient(135deg, #4CAF50 0%, #2196F3 100%);
```

### Change Redirect Delay

Edit `src/components/ReviewRedirect.js`:

```javascript
const REDIRECT_DELAY = 1500; // Change to 2000 for 2 seconds
```

### Add Your Logo

1. Add your logo file to `public/` folder (e.g., `logo.png`)
2. Edit `src/components/ReviewRedirect.js` to include it in the UI

## Troubleshooting

### Problem: "npm: command not found"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### Problem: QR codes not generating

**Solution**:
```bash
cd scripts
node generateQRCodes.js
```

### Problem: Clipboard not working on phone

**Solution**: This is normal for some devices. The app automatically shows a manual copy button.

### Problem: Can't access on phone

**Solution**: Make sure your phone and computer are on the same WiFi network. Use the URL shown in terminal (e.g., `http://192.168.1.5:3000`).

## Next Steps

1. ✅ Install dependencies
2. ✅ Test locally
3. ✅ Build for production
4. ✅ Deploy to hosting
5. ✅ Update QR code domain
6. ✅ Generate QR codes
7. ✅ Print QR codes
8. ✅ Place QR codes at your business
9. ✅ Monitor reviews coming in!

## Need Help?

Common commands:

```bash
npm install          # Install dependencies
npm start            # Start development server
npm run build        # Build for production
npm run generate-qr  # Generate QR codes
```

## Important Notes

- **Privacy**: No customer data is collected or stored
- **Compliance**: System is 100% Google-compliant
- **Cost**: Free to run (just hosting costs)
- **Updates**: You can update feedback messages anytime in `src/data/feedbackMessages.js`

---

**You're all set!** 🎉

If you have any questions, refer to the main README.md file for detailed documentation.
