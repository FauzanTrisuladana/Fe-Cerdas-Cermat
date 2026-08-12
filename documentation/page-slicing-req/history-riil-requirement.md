# Requirement Slicing: Halaman History Riil

## Deskripsi Halaman

Halaman ini menampilkan riwayat transaksi keuangan riil dengan fitur filter periode, pencarian, dan verifikasi data.

## Panduan Implementasi untuk AI (Slicing Guide)

### 1. Struktur File & Konsistensi Kode

Ikuti pola implementasi yang ada pada halaman `penanggung-jawab`.

- **Route**: Buat di `src/routes/_auth/history-riil.tsx`.
- **Components**: Buat folder baru di `src/components/history-riil/` yang berisi:
  - `history-riil-table.tsx` (Komponen utama tabel)
  - `history-riil-verify-dialog.tsx` (Dialog konfirmasi verifikasi)
  - `history-riil-filter-bar.tsx` (Komponen filter bar - container untuk filter)
  - `types.ts` (Definisi tipe data dan Mock Data)
  - `index.ts` (Export components)

### 2. Spesifikasi UI & Komponen

- **Header**: Gunakan `HeaderComp` dengan:
  - Title: "History Riil"
  - Description: "Berikut ini adalah riwayat uang riil"
- **Filter & Search**:
  - `SearchBar`: Untuk mencari periode buku.
  - **Filter Row**: Implementasikan baris filter yang berisi:
    - Input Tanggal Mulai (Date Picker)
    - Input Tanggal Selesai (Date Picker)
    - Select Kas (Dropdown untuk memilih kategori Kas, contoh: "KAS :")
- **Tabel Data**:
  - Kolom: `No.`, `Tanggal`, `Nama Akun`, `Kas`, `Nilai Riil`, `Aksi Status`.
  - **Nilai Riil**: Format mata uang (contoh: Rp 500.000) dengan warna teks hijau.
  - **Aksi Status**: Gunakan `Button` dengan icon checkmark.
    - Status Belum Verifikasi: Tombol "Verifikasi" (Warna default/outline).
    - Status Sudah Verifikasi: Tombol "Ter - Verifikasi" (Warna hijau/Badge style) tidak bisa diklik/tidak aktif.
- **Dialog Verifikasi**:
  - Trigger: Saat tombol "Verifikasi" diklik.
  - Konten: "Verifikasi {nama akun} pada tanggal {Tanggal} Sudah sesuai"
  - Sub-text: "Pastikan nilai yang tercantum sama dengan aslinya"
  - Actions: Tombol "Batal" (Warna Merah) dan "Ya, Verifikasi" (Warna Gelap/Hitam).

### 3. Logika Pagination & State (Sesuai ai-slicing-guide-fauzan.md)

- **Search Params Schema**:
  - `page`: default `1` (`z.number().int().positive().catch(1)`)
  - `per_page`: default `10` (`z.number().int().positive().catch(10)`)
  - `search`: optional string.
  - `tanggal_mulai`: default awal bulan ini (format: YYYY-MM-DD)
  - `tanggal_selesai`: default hari ini (format: YYYY-MM-DD)
- **Logika Paging**:
  - `pageIndex = page - 1`
  - Slice data: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`
- **Pagination Component**: Integrasikan dengan `DataTablePagination` yang mendukung `pageIndex`, `pageSize`, `pageCount`, `onPageChange`, dan `onPageSizeChange` (tanpa `total`).

### 4. Data Mocking

Buat data mock di `types.ts` yang mencakup:

- `id`, `tanggal`, `nama_akun`, `kas`, `nilai_riil`, `is_verified`.
- Pastikan ada variasi data untuk testing pagination (minimal 20+ data).

### 5. Verifikasi Akhir

Setelah implementasi, jalankan:

```bash
cd FE-Akuntansi-Pemuda
pnpm fix
```

## Kriteria Keberhasilan

- Tampilan konsisten dengan desain gambar.
- Pagination default `per_page` = 10.
- Dialog verifikasi muncul dengan data dinamis sesuai baris yang diklik.
- Filter tanggal dan kas berfungsi secara lokal (filter mock data).
- Kode mengikuti standar `penanggung-jawab.tsx`.
