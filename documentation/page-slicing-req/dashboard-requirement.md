# Dokumen Spesifikasi Kebutuhan (Dashboard Requirements Document)

**Sistem Informasi Keuangan – Kas Pemuda Nogotirto 5**

Dokumen ini memuat spesifikasi teknis, fungsi, dan tipe visualisasi grafik yang dibutuhkan pada Dashboard Keuangan. Spesifikasi ini disusun berdasarkan struktur database (_Entity-Relationship Diagram_) dan rencana kebutuhan pelaporan organisasi.

---

## 1. Komponen Informasi Ringkasan (Statistik Utama)

Pada bagian paling atas dashboard, sistem harus menampilkan tiga kartu informasi (_summary cards_) untuk memberikan gambaran cepat mengenai kondisi keuangan berjalan:

- **Pemasukan Bulan Ini:** Menampilkan total akumulasi dana yang masuk selama bulan berjalan (diambil dari total nominal data di tabel transaksi dengan `jenis_transaksi: pemasukan`).
- **Pengeluaran Bulan Ini:** Menampilkan total akumulasi dana yang keluar selama bulan berjalan (diambil dari total nominal data di tabel transaksi dengan `jenis_transaksi: pengeluaran`).
- **Total Saldo Saat Ini:** Menampilkan sisa saldo bersih gabungan dari seluruh kas yang dikelola saat ini.

**Filter Interaktif:** Terdapat pilihan `Badge` untuk memilih kas mana yang ditampilkan (Kas Pemuda / 17-an) di samping judul "Ringkasan Keuangan".

---

## 2. Spesifikasi Grafik Dashboard

Dashboard ini wajib mengimplementasikan 4 grafik utama dengan rincian kebutuhan teknis sebagai berikut:

### A. Tren Saldo Kas Bulanan

- **Tipe Grafik:** `Line Chart` (Grafik Garis - Jalur Tunggal)
- **Judul Grafik:** `Tren Saldo Kas Bulan Ini`
- **Fungsi Visualisasi:** Menampilkan visualisasi naik-turunnya akumulasi total saldo kas organisasi dari hari ke hari secara kronologis sepanjang bulan berjalan. Grafik ini menggunakan satu garis tunggal yang merepresentasikan pergerakan total uang gabungan.

### B. Perbandingan Pemasukan dan Pengeluaran Harian

- **Tipe Grafik:** `Double Bar Chart / Side-by-Side Bar Chart` (Grafik Batang Berpasangan)
- **Judul Grafik:** `Perbandingan Pemasukan & Pengeluaran Per Minggu`
- **Fungsi Visualisasi:** Menyandingkan dua buah batang vertikal setiap harinya (Senin s.d. Minggu). Batang pertama berwarna hijau untuk memvisualisasikan total nominal uang masuk, dan batang kedua berwarna merah untuk total nominal uang keluar pada hari yang sama. Grafik ini bertujuan untuk memantau perputaran arus kas harian dalam satu minggu secara instan.

### C. Tren Pertumbuhan Saldo per Jenis Kas (Akun)

- **Tipe Grafik:** `Multi-Line Chart` (Grafik Garis - Banyak Jalur)
- **Judul Grafik:** `Tren Pertumbuhan Saldo per Jenis Akun`
- **Fungsi Visualisasi:** Menampilkan beberapa jalur garis tren sekaligus dalam satu bidang grafik untuk memantau performa masing-masing akun. Jumlah garis yang muncul bersifat dinamis mengikuti isi data master pada tabel `akun` (berdasarkan kolom enum `kas`).
  - _Contoh:_ Menampilkan Garis Jalur 1 untuk pergerakan saldo **Kas Ditangan (Retail)**, Garis Jalur 2 untuk **Kas Modal**, Garis Jalur 3 untuk **Kas Operasional**, Garis Jalur 4 untuk **Bank BCA**, dan Garis Jalur 5 untuk **Bank Mandiri**.
- **Filter Interaktif:** Terdapat pilihan `Badge` untuk memilih akun mana yang ditampilkan pada grafik.

### D. Rekonsiliasi Kas (Pencatatan Sistem vs Fisik Lapangan)

- **Tipe Grafik:** `Multi-Bar Chart / Grouped Bar Chart`
- **Judul Grafik:** `Log Rekonsiliasi Kas (Aplikasi vs Riil)`
- **Fungsi Visualisasi:** Grafik pembanding untuk kebutuhan audit keuangan (_opname kas_). Grafik ini membandingkan data nominal saldo yang dihitung secara otomatis oleh sistem (dari akumulasi tabel `transaksi`) dengan data nominal uang fisik asli yang dihitung manual lalu diinput oleh bendahara ke dalam tabel `riil_history`.
- **Kebutuhan Tambahan:** Grafik harus dapat merepresentasikan status data yang sudah diverifikasi atau belum (berdasarkan indeks `verified: bool` pada database).

---

## 3. Aturan Desain Tata Letak (Layout) & Implementasi Kode

1.  **Format Kebersihan Data Antarmuka:** Pengembang hanya berfokus pada implementasi tipe grafik dan kedinamisan judul di atas. Abaikan teks keterangan statis, label persentase perbandingan bulan lalu, atau teks _footer_ bawaan komponen chart generik pada tahap _slicing layout_.
2.  **Rekomendasi Struktur Baris:**
    - **Baris 1 (Atas):** Tiga kartu informasi ringkasan (Pemasukan, Pengeluaran, Total Saldo).
    - **Baris 2 (Tengah):** Grafik `Tren Saldo Kas Bulan Ini` (Line Chart Tunggal) bersanding di sebelah grafik `Perbandingan Pemasukan & Pengeluaran Per Minggu` (Bar Chart Berpasangan).
    - **Baris 3 (Bawah):** Grafik `Tren Pertumbuhan Saldo per Jenis Akun` (Multi-Line Chart) bersanding di sebelah grafik `Log Rekonsiliasi Kas (Aplikasi vs Riil)` (Multi-Bar Chart).
3.  **Standar Implementasi UI (Sesuai AI Slicing Guide):**
    - **Konsistensi Komponen:** Gunakan komponen UI yang konsisten dengan halaman lain yang sudah diimplementasikan.
    - **Elemen Interaktif:** Gunakan `Badge` untuk status/kategori, `Switch` untuk toggle, dan `Select` untuk pilihan dropdown sesuai dengan spesifikasi desain global.
    - **Data Mock:** Buat data mock yang representatif dan sesuai dengan struktur database untuk keperluan pengembangan dan testing sebelum integrasi API.
    - **Struktur Kode:** Pastikan struktur folder, penamaan route, dan organisasi komponen konsisten dengan pola yang sudah ada di project `FE-Akuntansi-Pemuda`.
