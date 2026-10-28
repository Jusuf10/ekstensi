# Pencarian Barang & Alkes

Ekstensi browser untuk mencari data barang dan alat kesehatan dari file Excel yang dibundel di dalam extension.

## Fitur
- Mencari data dari file Excel yang tersimpan di dalam ekstensi
- Menampilkan hasil pencarian dari `Aset_Alkes.xlsx`
- Menampilkan data dari `Nomenklatur Alat Kesehatan.xls`
- Mudah dipakai sebagai popup browser extension

## Cara menjalankan
1. Pastikan Node.js terpasang.
2. Jalankan perintah berikut untuk menginstal dependensi:
   ```bash
   npm install
   ```
3. Buka browser Chromium/Chrome dengan mode extension developer.
4. Pilih folder project ini sebagai extension.
5. Aktifkan ekstensi dan buka popup untuk mulai mencari.

## Struktur file
- `manifest.json` - konfigurasi ekstensi Chrome
- `popup.html` - tampilan popup
- `popup.js` - logika pencarian dan parsing data
- `xlsx.full.min.js` - library Excel parser
- `Aset_Alkes.xlsx` - data aset
- `Nomenklatur Alat Kesehatan.xls` - master nomenklatur

## Catatan
Repositori ini diatur agar source code bisa dipublikasikan secara terbuka di GitHub.
