const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://yourdomain.com/review'; // Change this to your actual domain
const TOTAL_FEEDBACKS = 200;
const OUTPUT_DIR = path.join(__dirname, '../qr-codes');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// QR Code options
const qrOptions = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 1,
  width: 500,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

// Generate QR codes for all feedback IDs
async function generateAllQRCodes() {
  console.log('🚀 Starting QR Code generation...\n');

  const promises = [];

  for (let id = 0; id < TOTAL_FEEDBACKS; id++) {
    const url = `${BASE_URL}?id=${id}`;
    const filename = path.join(OUTPUT_DIR, `review-qr-${id}.png`);

    promises.push(
      QRCode.toFile(filename, url, qrOptions)
        .then(() => {
          console.log(`✅ Generated QR code ${id + 1}/${TOTAL_FEEDBACKS}`);
          return { id, success: true };
        })
        .catch((err) => {
          console.error(`❌ Failed to generate QR code ${id}:`, err.message);
          return { id, success: false, error: err.message };
        })
    );
  }

  const results = await Promise.all(promises);

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n📊 Generation Summary:');
  console.log(`   Total: ${TOTAL_FEEDBACKS}`);
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n📁 QR codes saved to: ${OUTPUT_DIR}`);

  // Generate a general random QR code (no ID parameter)
  const randomUrl = BASE_URL;
  const randomFilename = path.join(OUTPUT_DIR, 'review-qr-random.png');

  try {
    await QRCode.toFile(randomFilename, randomUrl, qrOptions);
    console.log('\n✅ Generated random QR code (no ID parameter)');
  } catch (err) {
    console.error('❌ Failed to generate random QR code:', err.message);
  }
}

// Generate a CSV file with all URLs for reference
function generateURLList() {
  const csvContent = ['ID,URL,QR_Code_File'];

  for (let id = 0; id < TOTAL_FEEDBACKS; id++) {
    const url = `${BASE_URL}?id=${id}`;
    const qrFile = `review-qr-${id}.png`;
    csvContent.push(`${id},${url},${qrFile}`);
  }

  // Add random entry
  csvContent.push(`random,${BASE_URL},review-qr-random.png`);

  const csvPath = path.join(OUTPUT_DIR, 'qr-codes-list.csv');
  fs.writeFileSync(csvPath, csvContent.join('\n'));

  console.log(`\n📄 URL list saved to: ${csvPath}`);
}

// Generate an HTML page to view all QR codes
function generateHTMLPreview() {
  let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Codes - Ansh Dental And Physio Care</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      text-align: center;
      color: #333;
    }
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .qr-card {
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
    }
    .qr-card img {
      width: 100%;
      max-width: 200px;
      height: auto;
    }
    .qr-card h3 {
      margin: 10px 0 5px;
      color: #667eea;
    }
    .qr-card p {
      font-size: 12px;
      color: #666;
      word-break: break-all;
    }
    .download-btn {
      display: inline-block;
      margin-top: 10px;
      padding: 8px 16px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 14px;
    }
    .download-btn:hover {
      background: #5568d3;
    }
    .special {
      border: 2px solid #48bb78;
    }
  </style>
</head>
<body>
  <h1>QR Codes for Review System</h1>
  <h2 style="text-align: center; color: #666;">Ansh Dental And Physio Care</h2>
  <div class="container">
`;

  // Add random QR card first
  htmlContent += `
    <div class="qr-card special">
      <img src="review-qr-random.png" alt="Random Review QR Code">
      <h3>Random Feedback</h3>
      <p>${BASE_URL}</p>
      <a href="review-qr-random.png" download class="download-btn">Download</a>
    </div>
`;

  // Add all numbered QR cards
  for (let id = 0; id < TOTAL_FEEDBACKS; id++) {
    const url = `${BASE_URL}?id=${id}`;
    const qrFile = `review-qr-${id}.png`;

    htmlContent += `
    <div class="qr-card">
      <img src="${qrFile}" alt="Review QR Code ${id}">
      <h3>Feedback #${id}</h3>
      <p>${url}</p>
      <a href="${qrFile}" download class="download-btn">Download</a>
    </div>
`;
  }

  htmlContent += `
  </div>
  <div style="text-align: center; margin-top: 40px; padding: 20px; background: white; border-radius: 10px;">
    <h3>Instructions</h3>
    <p>1. Click "Download" to save individual QR codes</p>
    <p>2. Print and place QR codes at your business location</p>
    <p>3. Customers scan to leave a review with pre-written feedback</p>
    <p>4. The random QR code (green border) provides a random feedback message</p>
  </div>
</body>
</html>
`;

  const htmlPath = path.join(OUTPUT_DIR, 'qr-codes-preview.html');
  fs.writeFileSync(htmlPath, htmlContent);

  console.log(`\n🌐 HTML preview saved to: ${htmlPath}`);
  console.log('   Open this file in a browser to view all QR codes');
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   QR Code Generator for Review System');
  console.log('   Ansh Dental And Physio Care');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`📋 Configuration:`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Total QR Codes: ${TOTAL_FEEDBACKS + 1} (including random)`);
  console.log(`   Output Directory: ${OUTPUT_DIR}\n`);

  // Check if BASE_URL needs to be updated
  if (BASE_URL.includes('yourdomain.com')) {
    console.log('⚠️  WARNING: Please update BASE_URL in this script to your actual domain!\n');
  }

  await generateAllQRCodes();
  generateURLList();
  generateHTMLPreview();

  console.log('\n✨ All done! You can now use the generated QR codes.\n');
}

// Run the script
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
