# Tambahan Requirement: Ringkasan Total Berdasarkan Filter

## Deskripsi

Menambahkan komponen ringkasan total (Summary Card) di sebelah kanan filter pada halaman Transaksi Keuangan untuk menampilkan total nominal pemasukan dan pengeluaran berdasarkan filter yang sedang aktif.

## Detail Implementasi

### 1. Komponen Baru: `TransaksiKeuanganSummary`

Buat komponen baru di `src/components/transaksi-keuangan/transaksi-keuangan-summary.tsx` dengan spesifikasi berikut:

- **Layout**: Card dengan background gelap (slate-900 atau similar) dan teks putih.
- **Konten**:
  - **Judul**: "Total Berdasarkan Filter" (font-bold, text-sm/base).
  - **Baris Pemasukan**:
    - Label: "Pemasukan"
    - Value: Nominal total pemasukan (format mata uang, warna hijau/emerald).
  - **Baris Pengeluaran**:
    - Label: "Pengeluaran"
    - Value: Nominal total pengeluaran (format mata uang, warna merah/rose).
- **Styling**:
  - Border radius yang konsisten dengan card lain.
  - Padding yang proporsional.
  - Flexbox untuk memisahkan label dan value (justify-between).

### 2. Integrasi di `transaksi-keuangan.tsx` (Route)

- **Logika Kalkulasi**:
  - Hitung total pemasukan dan pengeluaran dari data yang sudah difilter (`transaksiKeuanganQuery.data?.data`).
  - Gunakan `.reduce()` untuk menjumlahkan `jumlah` berdasarkan `tipe === 'pemasukan'` dan `tipe === 'pengeluaran'`.
- **Layouting**:
  - Bungkus `TransaksiKeuanganFilterBar` dan `TransaksiKeuanganSummary` dalam satu container `div` dengan `display: flex`, `gap: 4`, dan `items-start`.
  - `TransaksiKeuanganFilterBar` diberikan `flex-1` agar mengambil ruang utama.
  - `TransaksiKeuanganSummary` diberikan lebar tetap (fixed width) atau `w-fit` agar tidak terlalu lebar.

### 3. Contoh Struktur Layout

```tsx
<div className="flex flex-col lg:flex-row gap-4 mb-4">
  <TransaksiKeuanganFilterBar
    // ...props
    className="flex-1"
  />
  <TransaksiKeuanganSummary
    totalPemasukan={totalPemasukan}
    totalPengeluaran={totalPengeluaran}
  />
</div>
```

## Kriteria Keberhasilan

- Komponen summary muncul di sebelah kanan filter pada layar besar (desktop).
- Nominal yang ditampilkan berubah secara otomatis saat filter (tanggal, kas, akun, tipe) diubah.
- Warna nominal sesuai dengan tipe (Hijau untuk pemasukan, Merah untuk pengeluaran).
- Tampilan konsisten dengan desain gambar (Dark theme card).
