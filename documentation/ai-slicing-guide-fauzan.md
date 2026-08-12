## Instruksi singkat (untuk AI)

Tujuan: jalankan perubahan UI seragam di kode Frontend lalu laporkan hasilnya dalam format JSON.

Input: project root `FE-Akuntamnsi-Pemuda`.

Langkah (eksekusi otomatis):

1. Temukan semua route yang pakai pagination di `src/routes/_auth/**`.
2. Untuk tiap route: set schema `per_page` default ke `10` (z.catch(10) atau .catch(10)).
3. Ganti logika paging menjadi:
   - `pageIndex = page - 1`
   - slice: `data.slice(pageIndex * per_page, pageIndex * per_page + per_page)`
4. Dialog yang berhubungan dengan tabel ditempatkan di dalam komponen tabel.
5. buat data mock yang sesuai
6. stuktur kode konsisten dengan yang sudah ada cek path orutes dan component dari yaang sebelum2 nyaa

Verifikasi (perintah yang harus dijalankan setelah perubahan):

```bash
cd FE-Akuntansi-Pemuda
pnpm fix
```

Output (laporan — format manusia, isi detail):

Changed files:

- path/changed/file1
- path/changed/file2

Edits (ringkasan per file):

- path/changed/file1: Ubah pagination default ke 10; ganti safePageIndex dengan pageIndex
- path/changed/file2: Ganti checkbox menjadi Switch; pakai Badge untuk kolom multiple

Lint errors:

- before: N
- after: M

Commands yang dijalankan:

- pnpm fix

Notes:

- Catatan tambahan dan hal yang perlu dilanjutkan.

Kriteria keberhasilan:

- halaman harus konsisten semuanya dengan yang sudah diterapkan sebelumnya
- Semua route pagination default `per_page` = 10
- Dialog/table menggunakan `Badge`/`Switch`/`Select`/lainnnya sesuai spesifikasi yang diminta

---

Gunakan format laporan manusia di atas untuk laporan akhir; sertakan semua field yang disebut (changed files, edits, lintErrors, commands, notes).
