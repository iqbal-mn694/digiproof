const puppeteer = require('puppeteer');
const { HTMLContent, PDFBufferConfiguration } = require('../helpers/pdfHelper');

// pdf from html and css
async function generatePDF(HTML) {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = HTMLContent(HTML);

  // Menyeting konten halaman
  await page.setContent(htmlContent);

  // set pdf configuration
  const pdfBuffer  = await PDFBufferConfiguration(page);

  // Menutup browser
  await browser.close();

  return pdfBuffer;
}

module.exports = { generatePDF };