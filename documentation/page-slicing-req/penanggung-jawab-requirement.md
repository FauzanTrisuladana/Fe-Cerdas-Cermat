# Panduan Slicing Halaman Penanggung Jawab (PJ)

Tujuan: Mengimplementasikan halaman Manajemen Penanggung Jawab dengan mengikuti standar desain dan struktur kode yang telah diterapkan pada halaman `Pengaturan Akun Keuangan`.

## 1. Struktur File & Folder

Ikuti pola struktur komponen yang ada di `src/components/pengaturan-akun-keuangan`. Buat folder baru di `src/components/penanggung-jawab/` dengan file sebagai berikut:

- `penanggung-jawab-table.tsx`: Komponen tabel utama, termasuk logika pagination dan trigger dialog.
- `penanggung-jawab-add-dialog.tsx`: Dialog untuk menambah data PJ.
- `penanggung-jawab-edit-dialog.tsx`: Dialog untuk mengedit data PJ.
- `penanggung-jawab-delete-dialog.tsx`: Dialog konfirmasi penghapusan data PJ.
- `penanggung-jawab-transactions-dialog.tsx`: Dialog untuk melihat detail transaksi per PJ (sesuai gambar).
- `types.ts`: Definisi tipe data dan Mock Data.
- `index.ts`: Export semua komponen.

Route file: `src/routes/_auth/penanggung-jawab.tsx`

## 2. Spesifikasi Teknis (Sesuai AI Slicing Guide)

### A. Pagination & Search Params

- Gunakan `zod` untuk validasi search params di route.
- **Default `per_page`**: Harus `10` (`z.number().int().positive().catch(10)`).
- **Logika Paging**:
  - `pageIndex = page - 1`
  - Slice data: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`
- Implementasikan `safePage` untuk menangani navigasi jika halaman melebihi total data.

### B. Komponen UI & Styling

- **Header**: Gunakan `HeaderComp` dengan:
  - `title`: "Pengaturan Penanggung Jawab"
  - `description`: "Kelola Penanggung Jawab"
  - `icon`: `<Plus />`
  - `actionLabel`: "Tambah PJ"
- **Search**: Gunakan `SearchBar` dengan placeholder "Cari periode buku..." untuk filter nama PJ.
- **Tabel**:
  - Kolom: No, Nama, Valuasi Transaksi, Aksi.
  - Aksi: Icon Mata (Detail Transaksi), Icon Edit, Icon Trash (Hapus).
  - Valuasi Transaksi: Tampilkan dengan format mata uang (Rp) dan warna hijau (misal: `text-green-600`).
- **Dialog**:
  - Letakkan trigger dialog di dalam `PenanggungJawabTable`.
  - Gunakan `Dialog` dari `@/components/ui/dialog`.
  - **Dialog Tambah/Edit**:
    - Judul: "Tambah Penanggung Jawab" / "Edit Penanggung Jawab".
    - Deskripsi: "Silakan tambah data Akun Keuangan" (sesuai gambar).
    - Field: Input "Nama" dengan tanda asterisk merah (`*`) sebagai penanda required.
    - Tombol: "Batal" (Warna Merah/Destructive), "Simpan" (Warna Hitam/Dark).
  - **Dialog Hapus**:
    - Judul: "Hapus Data Penanggung Jawab".
    - Pesan: "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
    - Tombol: "Batal" (Warna Hitam/Dark), "Ya, Hapus" (Warna Merah/Destructive).

### C. Fitur Detail Transaksi

- Saat icon mata diklik, buka `PenanggungJawabTransactionsDialog`.
- **Header Dialog**: Menampilkan nama PJ (contoh: "Fauzan") dan tombol close (X).
- **Tabel Transaksi**:
  - Kolom: Tanggal, Deskripsi, Akun, Pemasukan, Pengeluaran.
  - Footer: Tombol "Tutup" berwarna merah di pojok kanan bawah.

## 3. Mock Data

Buat data mock di `types.ts` yang mencakup:

- List Penanggung Jawab (Nama, Valuasi Transaksi).
- List Transaksi yang terhubung dengan PJ tertentu.

## 4. Alur Kerja Implementasi

1. Definisikan tipe data dan mock data di `types.ts`.
2. Buat route `src/routes/_auth/penanggung-jawab.tsx` dengan schema search params.
3. Implementasikan `PenanggungJawabTable` dan integrasikan dengan `useQuery` (mock).
4. Buat dialog Add, Edit, Delete, dan Transactions.
5. Pastikan konsistensi penggunaan komponen UI (`Badge`, `Button`, `Input`, dll).

## 5. Verifikasi & Pelaporan

Setelah selesai, jalankan:

```bash
cd FE-Akuntansi-Pemuda
pnpm fix
```

Laporkan hasil dalam format:

- **Changed files**: List file yang dibuat/diubah.
- **Edits**: Ringkasan perubahan per file.
- **Lint errors**: Jumlah error sebelum dan sesudah.
- **Commands**: Perintah yang dijalankan.
- **Notes**: Catatan tambahan.
