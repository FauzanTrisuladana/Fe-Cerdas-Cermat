# Requirement Slicing: Halaman Mutasi Rekening

## Deskripsi Umum

Halaman Mutasi Rekening digunakan untuk mencatat dan mengelola transaksi perpindahan dana antar akun keuangan (kas/bank) dalam satu sistem.

## Struktur Folder & File (Wajib Diikuti)

Sesuai dengan pola yang ada di `src/components/penanggung-jawab` dan `src/components/pengaturan-akun-keuangan`:

- **Route**: `src/routes/_auth/mutasi-rekening.tsx`
- **Components Folder**: `src/components/mutasi-rekening/`
  - `index.ts` (Export semua komponen)
  - `types.ts` (Definisi interface dan Mock Data)
  - `mutasi-rekening-table.tsx` (Tabel utama dan logika dialog)
  - `mutasi-rekening-add-dialog.tsx` (Form tambah mutasi)
  - `mutasi-rekening-edit-dialog.tsx` (Form edit mutasi)
  - `mutasi-rekening-delete-dialog.tsx` (Konfirmasi hapus)
  - `mutasi-rekening-filter-bar.tsx` (Filter tanggal, kas, dll)

## Spesifikasi UI & Fitur

### 1. Header & Filter

- **Header**: Menggunakan `HeaderComp` dengan judul "Mutasi Rekening", deskripsi "Lakukan Transaksi Transaksi antar akun di kas yang sama", icon `Plus`, dan action label "Lakukan Mutasi Rekening".
- **Search Bar**: Input pencarian global untuk keterangan atau akun.
- **Filter Bar**:
  - Input Tanggal Mulai (Date Picker).
  - Input Tanggal Selesai (Date Picker).
  - Select Dropdown untuk filter "KAS".
  - Select Dropdown untuk filter "AKUN".

### 2. Tabel Mutasi Rekening

- **Kolom Tabel**:
  - No.
  - Tanggal (icon kalender di sebelah kiri).
  - Akun Debit
  - Akun Kredit
  - Kas
  - Jumlah (Format mata uang Rp)
  - Keterangan
  - Aksi (Icon Edit dan Icon Trash/Hapus)
- **Pagination**:
  - Default `per_page` = 10.
  - Logika paging: `pageIndex = page - 1`.
  - Slice data: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`.
  - Menggunakan `DataTablePagination` yang konsisten dengan halaman lain.

### 3. Dialogs (Harus berada di dalam `mutasi-rekening-table.tsx`)

- **Add Dialog (Tambah Mutasi)**:
  - Judul: "Lakukan Mutasi Rekening"
  - Field:
    - Tanggal (Required, Date Picker)
    - Asal Dana / Akun Kredit (Required, Select Dropdown)
    - Tujuan Dana / Akun Debit (Required, Select Dropdown)
    - Jumlah (Required, Number Input)
    - Keterangan (Optional, Textarea)
  - Button: "Batal" (Red/Outline) dan "Simpan" (Dark/Solid).
- **Edit Dialog (Edit Mutasi)**:
  - Judul: "Edit Mutasi Rekening"
  - Field:
    - Tanggal (Required, Date Picker)
    - Akun Kredit (Read-only/Disabled)
    - Akun Debit (Read-only/Disabled)
    - Jumlah (Required, Number Input)
    - Keterangan (Optional, Textarea)
  - Button: "Batal" (Red/Outline) dan "Simpan" (Dark/Solid).
- **Delete Dialog (Hapus Mutasi)**:
  - Judul: "Hapus Transaksi Mutasi Rekening"
  - Pesan: "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
  - Button: "Batal" (Dark/Solid) dan "Ya, Hapus" (Red/Solid).

## Ketentuan Teknis (AI Guide)

1. **Zod Schema**: Gunakan `z.object` untuk `validateSearch` di route dengan `.catch(10)` untuk `per_page`.
2. **Tanstack Query**: Gunakan `useQuery` untuk fetch data mock dari `types.ts`.
3. **State Management**: Gunakan `useNavigate` dari `@tanstack/react-router` untuk update search params (page, per_page, filters).
4. **Consistency**: Cek `src/routes/_auth/users.tsx` atau `src/routes/_auth/pengaturan-akun-keuangan.tsx` sebagai referensi utama implementasi logic.
5. **Mock Data**: Buat data mock yang realistis di `types.ts` mencakup field: `id`, `tanggal`, `akun_debit`, `akun_kredit`, `kas`, `jumlah`, `keterangan`.

## Verifikasi Akhir

- Jalankan `pnpm fix` setelah implementasi.
- Pastikan tidak ada lint error.
- Pastikan navigasi pagination dan filter berfungsi secara reaktif melalui URL.
