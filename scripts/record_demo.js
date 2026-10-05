import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demoDir = path.resolve(__dirname, '../demo');

if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function recordDemo() {
  console.log('🚀 Starting Chrome to record end-to-end platform demo...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  const frames = [];

  async function captureStep(name, filename, delayMs = 1200) {
    console.log(`📸 Capturing: ${name}`);
    await page.waitForTimeout(delayMs);
    const screenshotPath = path.join(demoDir, filename);
    const buffer = await page.screenshot({ path: screenshotPath });
    frames.push({ buffer, name });
    return buffer;
  }

  // Polyfill waitForTimeout for puppeteer-core
  page.waitForTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    console.log('🌐 Navigating to http://127.0.0.1:5173...');
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0', timeout: 15000 });

    // Step 1: Finance View
    await captureStep('Finance Controller Macro View', '01_finance_overview.png', 1500);

    // Step 2: Open Lineage Modal (click first table row in ledger)
    const ledgerRow = await page.$('table tbody tr');
    if (ledgerRow) {
      await ledgerRow.click();
      await captureStep('Cost Lineage Trace Inspector Modal', '02_lineage_trace_modal.png', 1000);

      // Close modal (click X or close button)
      const closeBtn = await page.$('button[title="Close"]') || await page.$('button svg.lucide-x') || await page.$('div[role="dialog"] button');
      if (closeBtn) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Step 3: Engineering View
    const buttons = await page.$$('nav button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Engineering')) {
        await btn.click();
        break;
      }
    }
    await captureStep('Engineering Lead & Ephemeral Dev Clusters View', '03_engineering_preview_clusters.png', 1200);

    // Step 4: Product View (Highlighting Derived Unit Costs)
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Product')) {
        await btn.click();
        break;
      }
    }
    await captureStep('Product Manager & Dynamic Feature Unit Economics Matrix', '04_product_derived_unit_costs.png', 1200);

    // Step 5: Reconciliation View
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Reconciliation')) {
        await btn.click();
        break;
      }
    }
    await captureStep('Zero-Discrepancy Reconciliation ($0.00 Variance)', '05_reconciliation_zero_variance.png', 1200);

    // Step 6: 1-Click Rollback Toggle
    const rollbackBtn = await page.$('button');
    const allBtns = await page.$$('button');
    for (const b of allBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Rollback')) {
        await b.click();
        break;
      }
    }
    await captureStep('1-Click Rollback to Snapshot v1.0.0 Active', '06_rollback_active.png', 1200);

    // Promote back
    const promoteBtns = await page.$$('button');
    for (const b of promoteBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Promote')) {
        await b.click();
        break;
      }
    }
    await page.waitForTimeout(800);

    // Step 7: Edge Case Runner
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Edge Cases')) {
        await btn.click();
        break;
      }
    }
    await captureStep('Automated Edge-Case & Failure Validation Suite Runner', '07_edge_cases_runner.png', 1200);

    // Step 8: Documentation Viewer
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Documentation')) {
        await btn.click();
        break;
      }
    }
    await captureStep('Interactive In-App Documentation Viewer', '08_documentation_guide.png', 1200);

    console.log('🎞️ Encoding animated demo GIF from captured steps...');
    await createAnimatedGif(frames);

    console.log('✅ End-to-end demo recorded successfully in demo/');
  } catch (err) {
    console.error('Error recording demo:', err);
  } finally {
    await browser.close();
  }
}

async function createAnimatedGif(frames) {
  if (frames.length === 0) return;

  const width = 1280;
  const height = 800;
  const encoder = new GIFEncoder(width, height, 'neuquant', true);

  const gifPath = path.join(demoDir, 'end_to_end_demo.gif');
  const writeStream = fs.createWriteStream(gifPath);
  encoder.createReadStream().pipe(writeStream);

  encoder.start();
  encoder.setDelay(2200); // 2.2 seconds per slide
  encoder.setRepeat(0); // 0 = loop indefinitely
  encoder.setQuality(10); // 10 is balanced quality

  for (const frame of frames) {
    const png = PNG.sync.read(frame.buffer);
    encoder.addFrame(png.data);
  }

  encoder.finish();

  await new Promise(resolve => writeStream.on('finish', resolve));
  console.log(`🎉 Demo animation saved to: ${gifPath} (${(fs.statSync(gifPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

recordDemo();
