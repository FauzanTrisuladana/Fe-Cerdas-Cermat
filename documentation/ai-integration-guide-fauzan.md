# Panduan Ringkas Integrasi Halaman TanStack Start + Laravel

## Konteks Proyek Ini

- Frontend memakai TanStack Start, TanStack Query, Zod, Sonner, Axios, dan service layer di `src/services`.
- Route aktif ada di `src/routes/_auth/**` dan beberapa halaman masih memakai pola lokal/mock, jadi jangan bikin arsitektur baru kalau pola existing sudah ada.
- Backend memakai Laravel 12, Sanctum token-based auth.
- Axios frontend mengirim `Authorization: Bearer <token>`

## Tujuan

Integrasikan halaman yang diberikan ke backend Laravel secara penuh, dengan mengikuti pattern yang sudah dipakai project ini.

## Yang Wajib Dibaca

1. Route TanStack Start untuk halaman itu.
2. Controller Laravel terkait.
3. Form Request, Resource, Model, policy/permission dari role, enum/constant, dan relasi yang dipakai controller.
4. Service/API client dan route frontend lain yang mirip.
5. `routes/api.php` untuk memastikan endpoint memang ada.
6. contoh response yang ada di documentation backend atau di hoppscotch collection.

## Pola Frontend Yang Harus Diikuti

- Tempatkan logika API di `src/services`.
- logika service harus menggunakan createServerFn sehingga bisa berjalan di server.
- Kemudian token dibuat di cookies http-only untuk token, jadi tidak perlu baca localStorage di service. kalau data lain disimpan maka pakai cookie tanpa http-only atau localStorage, tapi pastikan itu memang diperlukan dan tidak bisa diambil dari response API langsung.
- Gunakan `createFileRoute`, `validateSearch`, dan search params untuk page/filter/sort/search.
- Gunakan TanStack Query untuk fetch dan mutation.
- Sinkronkan URL dengan state UI.
- Tampilkan loading, empty, error, dan submit state.
- Ikuti pattern komponen yang sudah ada di `src/components`.
- Jangan pakai `any` kalau bisa dihindari.
- gunakan useServerFn untuk memanggil service yang sudah dibuat, jangan panggil service langsung di komponen.

## Endpoint Laravel Yang Sudah Ada Di Proyek Ini

Gunakan endpoint yang benar-benar tersedia di `routes/api.php` yang nanti diberikan:

Kalau route frontend butuh data / backend minta data yang tidak ada inputnya / action yang belum tersedia di backend:

- tulis jelas `API NOT FOUND`
- tulis itu di documentation dengan file (route).md isinya adalah permintaan api terkait misalany penjelasan apa yang dibutuhkan, apa request dan apa yang diharapkan responsenya
- jangan mengarang endpoint
- jangan pakai fake data kecuali diminta

## Checklist Implementasi

- Baca alur bisnis halaman dari controller dan route frontend.
- Cocokkan request body, query params, response shape, pagination, dan permission.
- Implementasikan semua action yang memang ada: list, detail, create, update, delete, status toggle, dropdown, dan fetch relasi bila tersedia.
- Pastikan mutation meng-invalidate query yang tepat.
- Pastikan validasi frontend mengikuti FormRequest Laravel.
- Pastikan state submit tidak dobel dan error backend tampil jelas.

## Toast

- pemanggilan api pasti ada message (toast) kalau error taruh di form jika tanpa form maka hanya toast setiap api yang interaksi, yang menggubah data (selain get) tambahkan toast bahwa berhasil atau error
- penerapannya baca dari component yang sudah menerapkan di `src/components/deprecated` atau di route `src/routes`

## Checklist Verifikasi

Jalankan ini setelah perubahan:

```bash
cd Frontend
pnpm fix
```

Target akhir:

- tidak ada lint error
- tidak ada TypeScript error
- tidak ada unused import atau dead code dari perubahan
- semua endpoint yang ada sudah terhubung
- semua action UI yang memang tersedia benar-benar bekerja
- kalau endpoint belum ada, laporkan sebagai API NOT FOUND
- semua serverside function sudah menggunakan createServerFn
- semua serverside function dipanggil pakai useServerFn, tidak ada pemanggilan service langsung di komponen

## Format Laporan Akhir

Laporkan singkat:

1. Analisis singkat: endpoint yang dipakai, field penting, permission, dan endpoint yang hilang.
2. Implementasi: file yang diubah dan logic yang ditambahkan.
3. Validasi: hasil lint dan tsc.
