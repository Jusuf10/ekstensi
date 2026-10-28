let dataExcelA = []; // BMD
let dataExcelB = []; // ASPAK

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', searchData);
  loadAllExcelFiles();
});

async function loadAllExcelFiles() {
  const statusEl = document.getElementById('status');
  
  try {
    await Promise.all([loadExcelA(), loadExcelB()]);

    statusEl.textContent = `Data siap! (BMD: ${dataExcelA.length}, ASPAK: ${dataExcelB.length})`;
    statusEl.style.color = 'green';

    const searchInput = document.getElementById('searchInput');
    searchInput.disabled = false;
    
    document.getElementById('resultBody').innerHTML = 
      '<tr><td colspan="4" class="no-result">Ketik kata kunci di atas untuk mencari...</td></tr>';
  } catch (error) {
    console.error('Gagal membaca file Excel:', error);
    statusEl.textContent = 'Gagal memuat database Excel. Periksa nama file.';
    statusEl.style.color = 'red';
  }
}

// Membaca Aset_Alkes.xlsx (BMD)
async function loadExcelA() {
  const fileUrl = chrome.runtime.getURL('Aset_Alkes.xlsx');
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  dataExcelA = rawData.map(row => {
    const kode = String(row['kode'] || row['Kode'] || '').trim();
    const nama = String(row['uraian'] || row['Uraian'] || '').trim();
    const sinonim = String(row['sinonim'] || row['Sinonim'] || '').trim();

    return {
      kode: kode,
      nama: nama,
      searchKey: `${kode} ${nama} ${sinonim}`.toLowerCase()
    };
  }).filter(item => item.kode !== '' || item.nama !== '');
}

// Membaca Nomenklatur Alat Kesehatan.xls (ASPAK)
async function loadExcelB() {
  const fileUrl = chrome.runtime.getURL('Nomenklatur Alat Kesehatan.xls');
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  const dataRows = rawData.slice(3); // Lewati 3 baris header merger

  dataExcelB = dataRows.map(row => {
    const kode = String(row[1] || '').trim();
    const nama = String(row[2] || '').trim();
    const sinonim = String(row[3] || '').trim();

    return {
      kode: kode,
      nama: nama,
      searchKey: `${kode} ${nama} ${sinonim}`.toLowerCase()
    };
  }).filter(item => item.kode !== '' || item.nama !== '');
}

// Fungsi Pencarian
function searchData() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultBody = document.getElementById('resultBody');
  resultBody.innerHTML = '';

  if (!query) {
    resultBody.innerHTML = '<tr><td colspan="4" class="no-result">Ketik kata kunci untuk mencari...</td></tr>';
    return;
  }

  // Filter masing-masing database secara terpisah
  const filteredBMD = dataExcelA.filter(item => item.searchKey.includes(query));
  const filteredASPAK = dataExcelB.filter(item => item.searchKey.includes(query));

  if (filteredBMD.length === 0 && filteredASPAK.length === 0) {
    resultBody.innerHTML = '<tr><td colspan="4" class="no-result">Tidak ditemukan hasil untuk "${query}".</td></tr>';
    return;
  }

  let htmlContent = '';

  // 1. Tampilkan Bagian Hasil BMD (jika ada)
  if (filteredBMD.length > 0) {
    htmlContent += `<tr class="section-header"><td colspan="4">Hasil dari Aset Alkes (BMD) (${filteredBMD.length} ditemukan)</td></tr>`;
    filteredBMD.forEach(item => {
      htmlContent += `
        <tr>
          <td><b>${item.kode}</b></td>
          <td>${item.nama}</td>
          <td colspan="2" style="color: #ccc; text-align: center;">-</td>
        </tr>
      `;
    });
  }

  // 2. Tampilkan Bagian Hasil ASPAK (jika ada)
  if (filteredASPAK.length > 0) {
    htmlContent += `<tr class="section-header"><td colspan="4">Hasil dari Nomenklatur (ASPAK) (${filteredASPAK.length} ditemukan)</td></tr>`;
    filteredASPAK.forEach(item => {
      htmlContent += `
        <tr>
          <td colspan="2" style="color: #ccc; text-align: center;">-</td>
          <td><b>${item.kode}</b></td>
          <td>${item.nama}</td>
        </tr>
      `;
    });
  }

  resultBody.innerHTML = htmlContent;
}