# Requirement Slicing: Halaman Transaksi Keuangan

## Deskripsi Umum

Halaman untuk mengelola transaksi keuangan yang mencakup pencatatan pemasukan dan pengeluaran kas. Halaman ini terdiri dari tabel data transaksi, filter pencarian, dan dialog untuk tambah/edit/hapus transaksi serta melihat bukti transaksi.

## Panduan Implementasi (Untuk AI)

Ikuti standar coding yang ada di project `FE-Akuntansi-Pemuda`. Pastikan struktur komponen konsisten dengan modul lain (seperti `mutasi-rekening` atau `penanggung-jawab`).

### 1. Standar Pagination & Data

Sesuai dengan `ai-slicing-guide-fauzan.md`:

- **Default per_page**: Set schema `per_page` default ke `10` (gunakan `.catch(10)`).
- **Logika Paging**:
  - `pageIndex = page - 1`
  - Slice data: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`
- **Mock Data**: Buat data mock yang realistis untuk transaksi keuangan (Tanggal, Deskripsi, Akun Transaksi, Penanggung Jawab, Karyawan, Kas, Tipe, Jumlah, Bukti).

### 2. Struktur Komponen

- **Route**: Implementasikan di `src/routes/_auth/transaksi-keuangan.tsx`.
- **Komponen**: Buat folder baru di `src/components/transaksi-keuangan/` yang berisi:
  - `transaksi-keuangan-table.tsx`: Tabel utama dan logika pagination.
  - `transaksi-keuangan-filter-bar.tsx`: Filter rentang tanggal, filter Kas, dan filter Akun.
  - `transaksi-keuangan-add-dialog.tsx`: Dialog tambah transaksi.
  - `transaksi-keuangan-edit-dialog.tsx`: Dialog edit transaksi.
  - `transaksi-keuangan-delete-dialog.tsx`: Dialog konfirmasi hapus.
  - `transaksi-keuangan-evidence-dialog.tsx`: Dialog untuk melihat preview bukti transaksi.
  - `types.ts`: Definisi tipe data transaksi.
- **Penempatan Dialog**: Semua dialog yang berhubungan dengan tabel harus ditempatkan di dalam komponen tabel.

### 3. Detail UI & Komponen (Sesuai Gambar)

#### A. Halaman Utama

- **Header**: Judul "Transaksi Keuangan" dengan sub-deskripsi "Lakukan Transaksi antar akun di kas yang sama".
- **Action Button**: Tombol "Lakukan Mutasi Rekening" (Warna Hijau) di pojok kanan atas.
- **Search Bar**: Input pencarian "Akun Keuangan".
- **Filter Bar**:
  - Rentang Tanggal (Date Picker Start & End).
  - Select "Kas".
  - Select "Akun".
  - Checkbox/Toggle untuk "Pemasukan" dan "Pengeluaran".

#### B. Tabel Transaksi

Kolom yang harus ada:

- **No**: Nomor urut.
- **Tanggal**: Format YYYY-MM-DD.
- **Deskripsi**: Teks deskripsi transaksi.
- **Akun Transaksi**: Nama akun (contoh: Kas Ditangan (Retail)).
- **Penanggung Jawab**: Nama singkat (contoh: fauzan).
- **Karyawan**: Avatar + Nama + Email (contoh: Alice Smith @alicesmith).
- **Kas**: Nama kas (contoh: Kas Pemuda, 17 an).
- **Tipe**: Gunakan `Badge`.
  - Pemasukan: Warna Hijau dengan icon panah atas.
  - Pengeluaran: Warna Merah dengan icon panah bawah.
- **Jumlah**: Format mata uang (contoh: Rp 500.000).
- **Bukti**: Tombol "Lihat Bukti" (Warna Biru).
- **Aksi**: Icon Edit (Kuning) dan Icon Trash (Merah).

#### C. Dialog Tambah/Edit Transaksi

- **Judul**: "Lakukan Transaksi" (Tambah) atau "Edit Transaksi" (Edit).
- **Fields**:
  - **Deskripsi** (Input Text, Required).
  - **Tanggal** (Date Picker, Required).
  - **Tipe Transaksi** (Toggle/Segmented Control: Pemasukan vs Pengeluaran, Required).
  - **Kas Keuangan** (Toggle/Segmented Control: contoh "17 an", "Pemuda", Required).
  - **Akun Transaksi** (Select, Required).
  - **Penanggung Jawab** (Select).
  - **Jumlah** (Input Number/Currency, Required).
  - **Preview Area**: Area image hasil upload untuk preview bukti.
  - **Upload File Bukti** (Input File).
- **Footer**: Tombol "Batal" (Merah) dan "Simpan" (Hitam).

#### D. Dialog Hapus

- **Judul**: "Hapus Transaksi Mutasi Rekening".
- **Pesan**: "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
- **Footer**: Tombol "Batal" (Hitam) dan "Ya, Hapus" (Merah).

#### E. Dialog Bukti Transaksi

- **Judul**: "Bukti Transaksi {deskripsi}".
- **Content**: Area preview gambar bukti transaksi.
- **Footer**: Tombol "Batal" (Hitam).

## Verifikasi Akhir

Setelah implementasi, jalankan:

```bash
cd FE-Akuntansi-Pemuda
pnpm fix
```

Pastikan tidak ada lint error dan UI konsisten dengan halaman lain.
