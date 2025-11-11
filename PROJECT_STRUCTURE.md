# Project Structure

Complete overview of the Auto-Review System project structure.

```
Auto-Review/
│
├── 📁 public/                          # Static files served directly
│   └── index.html                      # Main HTML template
│
├── 📁 src/                             # Source code
│   ├── 📁 components/                  # React components
│   │   ├── ReviewRedirect.js          # Main review redirect component ⭐
│   │   ├── ReviewRedirect.css         # Styles for review component
│   │   ├── Home.js                    # Home page component (optional)
│   │   └── Home.css                   # Home page styles
│   │
│   ├── 📁 data/                        # Data files
│   │   └── feedbackMessages.js        # 200 feedback messages ⭐
│   │
│   ├── App.js                          # Main app component with routing
│   ├── App.css                         # App-level styles
│   ├── index.js                        # Entry point
│   └── index.css                       # Global styles
│
├── 📁 scripts/                         # Utility scripts
│   └── generateQRCodes.js             # QR code generator script ⭐
│
├── 📁 qr-codes/                        # Generated QR codes (created after npm run generate-qr)
│   ├── review-qr-0.png                # QR code for feedback ID 0
│   ├── review-qr-1.png                # QR code for feedback ID 1
│   ├── ...                            # QR codes 2-199
│   ├── review-qr-random.png           # Random feedback QR code
│   ├── qr-codes-list.csv              # CSV list of all URLs
│   └── qr-codes-preview.html          # HTML preview page
│
├── 📁 node_modules/                    # Dependencies (created after npm install)
│
├── 📁 build/                           # Production build (created after npm run build)
│
├── 📄 package.json                     # Project dependencies and scripts ⭐
├── 📄 package-lock.json                # Locked dependency versions (auto-generated)
│
├── 📄 .gitignore                       # Git ignore rules
│
├── 📄 README.md                        # Main documentation ⭐
├── 📄 SETUP_GUIDE.md                   # Quick setup instructions
├── 📄 DEPLOYMENT_GUIDE.md              # Deployment instructions
├── 📄 FEATURES.md                      # Feature documentation
├── 📄 TROUBLESHOOTING.md               # Troubleshooting guide
├── 📄 PROJECT_STRUCTURE.md             # This file
│
└── 📄 config.example.js                # Configuration example

⭐ = Most important files to understand/configure
```

## File Descriptions

### Core Application Files

#### `src/components/ReviewRedirect.js`
**Purpose**: Main component that handles the review flow
**Key Functions**:
- Fetches feedback message by ID
- Copies text to clipboard automatically
- Shows countdown and success/error states
- Redirects to Google Reviews
- Handles fallback for failed copy

#### `src/data/feedbackMessages.js`
**Purpose**: Contains all 200 pre-written feedback messages
**Key Functions**:
- `feedbackMessages` - Array of 200 messages
- `getFeedbackById(id)` - Get specific feedback
- `getRandomFeedback()` - Get random feedback
- `getTotalFeedbackCount()` - Get total count

#### `scripts/generateQRCodes.js`
**Purpose**: Generates QR codes for all feedback messages
**Key Functions**:
- Generates 201 QR code images (200 + 1 random)
- Creates HTML preview page
- Generates CSV list
- Configurable settings

### Configuration Files

#### `package.json`
**Contains**:
- Project metadata
- Dependencies
- Scripts (start, build, generate-qr)
- Browser compatibility settings

**Key Scripts**:
```json
{
  "start": "react-scripts start",       // Development server
  "build": "react-scripts build",       // Production build
  "generate-qr": "node scripts/generateQRCodes.js"  // Generate QR codes
}
```

#### `public/index.html`
**Contains**:
- HTML shell
- Meta tags
- Google Analytics placeholder
- Root div for React

### Styling Files

#### `src/components/ReviewRedirect.css`
**Styles**:
- Main component layout
- Success/error states
- Buttons and animations
- Responsive design
- Gradient backgrounds

#### `src/components/Home.css`
**Styles**:
- Home page layout (if using)
- Info cards
- Test buttons
- Stats section

### Generated Files

#### `qr-codes/` Directory
Created after running `npm run generate-qr`:
- **PNG files**: Individual QR code images
- **CSV file**: List of all URLs and QR codes
- **HTML file**: Visual preview of all QR codes

#### `build/` Directory
Created after running `npm run build`:
- Optimized production-ready files
- Minified JavaScript and CSS
- Compressed assets
- Ready to deploy

#### `node_modules/` Directory
Created after running `npm install`:
- All project dependencies
- React, React Router, QRCode library
- Build tools and scripts

## Data Flow

```
User scans QR code
      ↓
Opens URL: /review?id=123
      ↓
React Router loads ReviewRedirect component
      ↓
Component reads ID from URL
      ↓
Fetches feedback from feedbackMessages.js
      ↓
Attempts auto-copy to clipboard
      ↓
Shows success/failure UI
      ↓
Countdown timer starts
      ↓
Redirects to Google Reviews
      ↓
User pastes and submits review
```

## Component Hierarchy

```
App (Router)
 │
 ├── Route: /
 │    └── ReviewRedirect
 │
 └── Route: /review
      └── ReviewRedirect
```

## Key Dependencies

### Production Dependencies
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM rendering
- **react-router-dom** (^6.22.0) - Routing
- **react-scripts** (5.0.1) - Build tools

### Dev Dependencies
- **qrcode** (^1.5.3) - QR code generation

## Directory Sizes (Approximate)

```
node_modules/    ~250 MB
build/           ~500 KB
src/             ~50 KB
qr-codes/        ~20 MB (after generation)
```

## Important Paths to Know

### Development URLs:
- **Home**: `http://localhost:3000/`
- **Review with ID**: `http://localhost:3000/review?id=0`
- **Random review**: `http://localhost:3000/review`

### Production Paths:
- **Main app**: `build/index.html`
- **Assets**: `build/static/`
- **QR codes**: `qr-codes/*.png`

## Files You'll Modify Often

1. **`src/data/feedbackMessages.js`** - Update feedback messages
2. **`src/components/ReviewRedirect.js`** - Change Google Review URL
3. **`scripts/generateQRCodes.js`** - Update BASE_URL for QR codes
4. **`src/components/ReviewRedirect.css`** - Customize colors/styling

## Files You Won't Need to Touch

- `src/index.js` - Entry point (already configured)
- `src/App.js` - Router setup (already configured)
- `.gitignore` - Git ignore rules (already set)
- `node_modules/` - Dependencies (auto-managed)

## Build Output Structure

After `npm run build`, the `build/` directory contains:

```
build/
├── index.html                          # Main HTML
├── static/
│   ├── css/
│   │   └── main.[hash].css            # Bundled CSS
│   ├── js/
│   │   ├── main.[hash].js             # Main app bundle
│   │   └── [number].[hash].chunk.js   # Code-split chunks
│   └── media/                          # Images/fonts (if any)
└── asset-manifest.json                 # Build metadata
```

## Git Repository Structure

Recommended `.gitignore` already includes:
- `node_modules/` - Dependencies
- `build/` - Production build
- `qr-codes/*.png` - QR code images (optional)
- `.env` files - Environment variables

## Environment Setup

### Required:
- Node.js (v14+)
- npm (v6+)

### Optional:
- Git (for version control)
- VS Code (recommended editor)

## Documentation Structure

- **README.md** - Main documentation, overview
- **SETUP_GUIDE.md** - Step-by-step setup
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **FEATURES.md** - Feature documentation
- **TROUBLESHOOTING.md** - Problem solving
- **PROJECT_STRUCTURE.md** - This file

## Quick Reference

### Most Important Files:

1. **Components**:
   - `src/components/ReviewRedirect.js` - Main logic
   - `src/components/ReviewRedirect.css` - Main styling

2. **Data**:
   - `src/data/feedbackMessages.js` - All feedback messages

3. **Scripts**:
   - `scripts/generateQRCodes.js` - QR generation

4. **Config**:
   - `package.json` - Dependencies and scripts
   - `public/index.html` - HTML template

### Commands You'll Use:

```bash
npm install              # Install dependencies
npm start                # Start development server
npm run build            # Build for production
npm run generate-qr      # Generate QR codes
```

### URLs to Configure:

1. **Google Review URL**: In `ReviewRedirect.js`
2. **QR Code Base URL**: In `generateQRCodes.js`
3. **Google Analytics**: In `index.html` (optional)

---

**This structure is designed to be simple, organized, and easy to maintain!**
