function HTMLContent(htmlCode) {
  return htmlCode;
}


async function PDFBufferConfiguration(page) {
  const uint8Array = await page.pdf({
    format: 'A4', 
    printBackground: true, 
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  return Buffer.from(uint8Array);
}

module.exports = { HTMLContent, PDFBufferConfiguration }