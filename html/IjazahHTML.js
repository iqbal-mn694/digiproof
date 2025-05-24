function IjazahHTML(ijazahData) {
  // get ijazah data object
  const { 
    university_address,
    rector_name, 
    nip,
    student_name,
    birth_place,
    birth_date,
    npm,
    study,
    ipk,
    ijazah_date
  } = ijazahData;


  // console.log(ijazahData)
  // create html for generate to pdf
  return `
  <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Ijazah Sarjana</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          font-family: 'Playfair Display', serif;
          background-color: #f5f5f0;
        }
        .border-gold {
          border-color: #d4af37;
        }
        .seal {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          position: absolute;
          right: 60px;
          top: 50px;
        }
        .watermark {
          position: absolute;
          opacity: 0.1;
          font-size: 180px;
          font-weight: bold;
          color: #d4af37;
          transform: rotate(-30deg);
          z-index: 0;
          top: 30%;
          left: 15%;
        }
        .signature-line {
          border-top: 1px solid #333;
          width: 200px;
          margin: 0 auto;
        }
        
        .digital-signature {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.5rem;
        }
      </style>
    </head>
    <body class="bg-gray-50 py-16 px-8">
      <div class="relative max-w-4xl mx-auto bg-white border-4 border-gold p-12 shadow-lg">
        <!-- Watermark -->
        <div class="watermark">IJAZAH</div>
         
        <!-- Header -->
        <div class="text-center mb-12 relative z-10">
          <h1 class="text-2xl font-bold text-gray-800 tracking-wider">KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN</h1>
          <h2 class="text-3xl mt-4 font-bold text-gold-800" style="color: #8b0000;">UNIVERSITAS MUGARSARI</h2>
          <p class="text-lg mt-2 text-gray-600">${ university_address }</p>
        </div>

        <!-- Title -->
        <div class="text-center my-12 relative z-10">
          <h3 class="text-4xl font-bold uppercase tracking-widest" style="color: #8b0000;">IJAZAH</h3>
          <p class="text-lg mt-4">Nomor: <span class="font-semibold">2025/UNIV/XI/0987</span></p>
          <div class="mt-6 mx-auto w-32 border-t-2 border-gold"></div>
        </div>

        <!-- Content -->
        <div class="text-lg leading-relaxed px-6 relative z-10">
          <p class="mb-6">Yang bertanda tangan di bawah ini:</p>
          
          <div class="ml-8 mb-8">
            <div class="flex mb-2">
              <div class="w-48 font-semibold">Nama Rektor</div>
              <div>: ${ rector_name }</div>
            </div>
            <div class="flex">
              <div class="w-48 font-semibold">NIP</div>
              <div>: ${ nip }</div>
            </div>
          </div>

          <p class="mb-6">Menerangkan bahwa:</p>
          
          <div class="ml-8 mb-8">
            <div class="flex mb-2">
              <div class="w-48 font-semibold">Nama</div>
              <div>: <span class="text-xl font-bold" style="color: #8b0000;">${ student_name }</span></div>
            </div>
            <div class="flex mb-2">
              <div class="w-48 font-semibold">Tempat/Tgl. Lahir</div>
              <div>: ${ birth_place}, ${ birth_date }</div>
            </div>
            <div class="flex mb-2">
              <div class="w-48 font-semibold">Nomor Pokok Mahasiswa</div>
              <div>: ${ npm } </div>
            </div>
            <div class="flex mb-2">
              <div class="w-48 font-semibold">Program Studi</div>
              <div>: ${ study } </div>
            </div>
            <div class="flex">
              <div class="w-48 font-semibold">Indeks Prestasi Kumulatif</div>
              <div>: ${ ipk } <span class="italic"></span></div>
            </div>
          </div>

          <p class="mb-6 text-justify">
            Telah memenuhi seluruh persyaratan akademik dan dinyatakan <strong>LULUS</strong> pada tanggal <strong>${ ijazah_date }</strong> dari Program Sarjana (Strata-1)  <strong> ${ study } </strong>.
          </p>

          <p class="mt-10 mb-6">
            Diberikan di Tasikmalaya, pada tanggal <strong>${ ijazah_date }</strong>.
          </p>
        </div>

        <!-- Signatures -->
        <div class="flex justify-between items-center mt-20 px-6 relative z-10">
          <div class="text-center">
            <p class="mb-12">Rektor</p>
            <div class="signature-line"></div>
            <p class="mt-2 font-semibold">${ rector_name }</p>
            <p class="text-sm">NIP. ${ nip }</p>
            <p class="digital-signature">Tanda tangan digital tersertifikasi</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-16 text-center text-sm text-gray-600">
          <p>Ijazah ini diterbitkan berdasarkan Keputusan Rektor Universitas Mugarsari</p>
          <p>Nomor: 1234/UNIV/AKAD/2025 ${ ijazah_date} </p>
          <p class="mt-2 text-xs">Dokumen ini sah dan dapat diverifikasi melalui sistem sertifikasi digital Universitas Mugarsari</p>
        </div>
      </div>
    </body>
  </html>
  `
}

module.exports = { IjazahHTML }