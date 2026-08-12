# Requirement Slicing: Pengaturan Akun Keuangan

Dokumen ini adalah panduan teknis untuk implementasi halaman **Pengaturan Akun Keuangan**. AI pengembang harus mengikuti instruksi ini secara ketat untuk menjaga konsistensi UI/UX dengan modul lain.

## 1. Informasi Route & Struktur

- **Path**: `/_auth/pengaturan-akun-keuangan`
- **Komponen Utama**: `RouteComponent` di dalam file route.
- **Komponen Pendukung**:
  - `akun-keuangan-table`: Tabel data akun keuangan.
  - `akun-keuangan-add-dialog`: Dialog tambah akun.
  - `akun-keuangan-edit-dialog`: Dialog edit akun.
  - `akun-keuangan-delete-dialog`: Dialog konfirmasi hapus.
  - `akun-keuangan-transactions-dialog`: Dialog detail transaksi (Meniru `coa-transactions-dialog`).

## 2. Spesifikasi UI (Slicing Guide)

### A. Header & Layout

- Gunakan `HeaderComp` dengan:
  - `title`: "Pengaturan Akun Keuangan"
  - `description`: "Kelola Akun Keuangan"
  - `icon`: `<Plus />`
  - `actionLabel`: "Tambah Akun"
  - `onAction`: Membuka `AkunKeuanganAddDialog`.

### B. Filter & Search

- Gunakan `SearchBar` dengan placeholder "Akun Keuangan".
- Tambahkan filter dropdown untuk "KAS" (menggunakan komponen `Select` dari UI).

### C. Tabel Data (`AkunKeuanganTable`)

- **Kolom**:
  1. `No`: Nomor urut.
  2. `Nama Akun`: Teks nama akun.
  3. `Kas`: Nama kas terkait.
  4. `Jumlah`: Format mata uang (contoh: `Rp 500.000`), warna teks hijau jika ada nilai.
  5. `Keterangan`: Teks keterangan.
  6. `Aksi`:
     - Icon Mata (`Eye`): Membuka `AkunKeuanganTransactionsDialog`.
     - Icon Edit (`Pencil`): Membuka `AkunKeuanganEditDialog`.
     - Icon Trash (`Trash2`): Membuka `AkunKeuanganDeleteDialog`.
- **Pagination**:
  - Default `per_page`: 10.
  - Logika: `pageIndex = page - 1`.
  - Slice: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`.

### D. Dialogs (Container & Style)

Semua dialog harus menggunakan struktur `Dialog` dari `@/components/ui/dialog` dengan layout:

- `DialogHeader` $\rightarrow$ `DialogTitle` & `DialogDescription`.
- `DialogBody` $\rightarrow$ Konten form/tabel.
- `DialogFooter` $\rightarrow$ Tombol aksi.

#### 1. Tambah & Edit Akun

- **Fields**:
  - `Nama Akun` (Input, Required `*`)
  - `Kas` (Select, Required `*`)
  - `Keterangan` (Textarea/Input, Optional)
- **Buttons**:
  - `Batal`: Variant `destructive` (Warna merah).
  - `Simpan`: Variant `default` (Warna gelap/hitam).

#### 2. Hapus Akun

- **Title**: "Hapus Data Akun Keuangan"
- **Description**: "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
- **Buttons**:
  - `Batal`: Variant `default` (Warna gelap).
  - `Ya, Hapus`: Variant `destructive` (Warna merah).

#### 3. Detail Transaksi (`AkunKeuanganTransactionsDialog`)

- **Referensi**: Meniru `src/components/deprecated/akuntansi/coa/coa-transactions-dialog.tsx`.
- **Fitur**:
  - Tabel transaksi dengan kolom: Tanggal, Jenis Transaksi, Deskripsi, Pemasukan, Pengeluaran, Saldo.
  - Footer menampilkan "Saldo Akhir" dengan warna teks `#4F46E5`.
  - Tombol `Tutup` (Destructive) dan tombol `Print` (Dark) dengan icon `Printer`.

## 3. Logika Data & State

- Gunakan `tanstack-query` untuk manajemen state.
- Implementasikan data mock yang realistis untuk:
  - Daftar Akun Keuangan.
  - Daftar Kas.
  - Riwayat Transaksi per akun.
- Gunakan `zod` untuk validasi search params di route.

## 4. Verifikasi Akhir

Setelah implementasi, jalankan:

```bash
pnpm fix
```

Pastikan tidak ada lint error dan UI konsisten dengan `users.tsx`.
