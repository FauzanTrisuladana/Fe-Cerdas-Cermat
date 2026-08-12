# Slicing Requirement: Halaman Laporan Keuangan

## 1. Tujuan

Implementasi halaman Laporan Keuangan sesuai dengan desain UI yang diberikan. Halaman ini berfungsi untuk menampilkan ringkasan keuangan berdasarkan periode tanggal, filter kas, dan akun.

## 2. Struktur File & Konsistensi Kode

Ikuti pola struktur folder dan penamaan yang sudah ada di project (contoh: `transaksi-keuangan` atau `mutasi-rekening`):

- **Route**: `src/routes/_auth/laporan-keuangan.tsx`
- **Components**: `src/components/laporan-keuangan/`
  - `laporan-keuangan-transaksi-table.tsx` (Tabel Transaksi Keuangan)
  - `laporan-keuangan-mutasi-table.tsx` (Tabel Mutasi Kas)
  - `laporan-keuangan-posisi-table.tsx` (Tabel Posisi Keuangan)
  - `laporan-keuangan-filter-bar.tsx` (Komponen filter tanggal, kas, akun, tipe)
  - `laporan-keuangan-summary.tsx` (Komponen ringkasan total di bagian atas/bawah)
  - `types.ts` (Definisi tipe data dan mock data)
  - `index.ts` (Export components)

## 3. Spesifikasi UI & Fitur

### A. Header & Filter (Filter Bar)

- **Judul Halaman**: "Laporan Keuangan"
- **Tombol Aksi**: Tombol "Print Laporan PDF" di pojok kanan atas.
- **Filter Rentang Tanggal**: Input date range (Tanggal Mulai & Tanggal Selesai).
- **Filter Kas**: Badge style (Hijau untuk Kas Pemuda, Oranye untuk 17 an) - default "Kas Pemuda".
- **Filter Akun**: Dropdown/Select untuk memilih Akun.
- **Filter Tipe**: Checkbox untuk pemilihan ganda (Pemasukan & Pengeluaran) - default keduanya terpilih.

### B. Konten Utama (Tabel-Tabel)

Halaman ini terdiri dari beberapa bagian tabel. Setiap tabel harus memiliki judul di atasnya dengan format: **"Nama Tabel (Nama Kas)"** (contoh: "Transaksi Keuangan (Kas Pemuda)").

#### 1. Tabel Transaksi Keuangan (Kas Keuangan)

- **Judul**: "Transaksi Keuangan ({nama_kas})"
- **Keterangan di bawah judul**: "Transaksi dari {tgl mulai} - {tgl selesai}"
- **Kolom**: No, Tanggal, Deskripsi, Akun Transaksi, Penanggung Jawab, Penginput, Tipe, Jumlah, Bukti.
- **Styling**:
  - Kolom **Tipe**: Gunakan `Badge` (Hijau untuk Pemasukan, Merah untuk Pengeluaran).
  - Kolom **Jumlah**: Format currency (Rp).
  - Kolom **Bukti**: Tombol "Lihat Bukti" yang membuka link di tab baru.
- **Pagination**: TANPA pagination (menampilkan semua data).

#### 2. Tabel Transaksi Mutasi Kas (Kas Keuangan)

- **Judul**: "Transaksi Mutasi Kas ({nama_kas})"
- **Keterangan di bawah judul**: "Transaksi dari {tgl mulai} - {tgl selesai}"
- **Kolom**: No, Tanggal, Akun Debit, Akun Kredit, Jumlah, Keterangan.
- **Styling**: Format currency untuk kolom Jumlah.
- **Pagination**: TANPA pagination (menampilkan semua data).

#### 3. Tabel Posisi Keuangan (Kas Keuangan)

- **Judul**: "Posisi Keuangan ({nama_kas})"
- **Keterangan di bawah judul**: "Posisi Keuangan ketika tanggal {tgl selesai}"
- **Kolom**: No, Nama Akun, Saldo Awal, Pemasukan, Pengeluaran, Total, Riil, Selisih, Keterangan.
- **Styling**:
  - Format currency untuk semua kolom angka.
  - Kolom **Keterangan**: Gunakan `Badge` untuk status (contoh: "Seimbang", "Uang Kurang", "Uang Lebih").
- **Pagination**: TANPA pagination (menampilkan semua data).

### C. Ringkasan (Summary Card)

- Tampilkan card di bagian kanan atas yang berisi:
  - Saldo Awal
  - Pemasukan
  - Pengeluaran
  - Kas Di tangan/Bank Terakhir

## 4. Ketentuan Teknis (AI Slicing Guide)

1. **Pagination**: TANPA pagination - tabel menampilkan semua data langsung.
2. **State Management**: Gunakan `@tanstack/react-router` untuk search params dan `@tanstack/react-query` untuk data fetching (mock).
3. **UI Components**: Gunakan komponen dari `@/components/ui/` (Table, Button, Badge, Input, Select, Card, dll).
4. **Mock Data**: Buat data mock yang realistis di `types.ts` untuk ketiga tabel di atas.
5. **Konsistensi**: Pastikan padding, margin, dan warna konsisten dengan halaman `transaksi-keuangan.tsx`.

## 5. Verifikasi

Setelah implementasi, jalankan:

```bash
cd FE-Akuntansi-Pemuda
pnpm fix
```

## 6. Format Laporan Akhir

Laporkan hasil dalam format:

- **Changed files**: (List path file)
- **Edits**: (Ringkasan perubahan per file)
- **Lint errors**: (Before vs After)
- **Commands**: (List perintah yang dijalankan)
- **Notes**: (Catatan tambahan)
