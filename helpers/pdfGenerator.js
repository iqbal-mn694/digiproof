const puppeteer = require('puppeteer');

// pdf from html and css
function HTMLContent(studentName) {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .diploma-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background-color: #fff;
            position: relative;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 2px solid #8B4513;
          }
          .diploma-border {
            border: 15px double #8B4513;
            height: calc(100% - 30px);
            width: calc(100% - 30px);
            margin: 15px;
            position: relative;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #8B4513;
            margin: 0 40px;
          }
          .header h1 {
            color: #8B4513;
            font-size: 28px;
            margin: 0;
            letter-spacing: 2px;
          }
          .header p {
            color: #555;
            margin: 5px 0 0;
            font-style: italic;
          }
          .seal {
            position: absolute;
            top: 20px;
            right: 40px;
            width: 80px;
            opacity: 0.8;
          }
          .content {
            padding: 30px 60px;
            text-align: center;
          }
          .main-text {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
          }
          .recipient {
            font-size: 24px;
            font-weight: bold;
            margin: 30px 0;
            color: #8B4513;
            text-decoration: underline;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding: 0 40px;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin: 60px auto 10px;
            width: 150px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          .watermark {
            position: absolute;
            opacity: 0.1;
            font-size: 120px;
            color: #8B4513;
            transform: rotate(-45deg);
            top: 30%;
            left: 10%;
            z-index: -1;
          }
          .gold-stamp {
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            color: gold;
            font-size: 14px;
            background: rgba(139, 69, 19, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="diploma-container">
          <div class="diploma-border">
            <div class="watermark">IJAZAH</div>
            
            <div class="header">
              <h1>IJAZAH PENDIDIKAN TINGGI</h1>
              <p>Diberikan atas penyelesaian studi dengan memuaskan</p>
            </div>
            
            <div class="content">
              <div class="main-text">
                <p>Dengan ini menerangkan bahwa:</p>
                <div class="recipient">${studentName}</div>
                <p>Telah menyelesaikan pendidikan pada Program Studi</p>
                <p><strong>TEKNIK INFORMATIKA</strong></p>
                <p>Dengan predikat <strong>SANGAT MEMUASKAN</strong></p>
                <p>Pada tanggal 31 Desember 2023</p>
              </div>
              
              <div class="signature-section">
                <div class="signature-box">
                  <p>Ketua Program Studi</p>
                  <div class="signature-line"></div>
                  <p>Prof. Dr. John Doe, M.Sc.</p>
                </div>
                <div class="signature-box">
                  <p>Rektor Universitas</p>
                  <div class="signature-line"></div>
                  <p>Prof. Dr. Jane Smith, Ph.D.</p>
                </div>
              </div>
              
              <div class="footer">
                <p>Ijazah ini diterbitkan secara sah dan dicatat dalam register dengan nomor: 12345/VI/2023</p>
              </div>
            </div>
            
            <div class="gold-stamp">ASLI</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function PDFConfiguration(page, studentName) {
  await page.pdf({
    path: `documents/ijazah_${studentName}.pdf`,
    format: 'A4', 
    printBackground: true, // Menyertakan latar belakang
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });
}

async function generatePDF(studentName) {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = HTMLContent(studentName);

  // Menyeting konten halaman
  await page.setContent(htmlContent);

  // set pdf configuration
  await PDFConfiguration(page, studentName);

  // Menutup browser
  await browser.close();
  return "PDF generated successfully!";;
}

module.exports = { generatePDF }