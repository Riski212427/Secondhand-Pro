# SecondPhone Pro — Sistem Penjualan HP Bekas (Second) & Simulasi Cicilan Kredit (Sales POS)

Sistem penjualan smartphone bekas (*pre-owned/refurbished*) kelas *mid-range* hingga *flagship/high-end* (iPhone & Android) dengan transparansi kondisi fisik/grade unit, dilengkapi kalkulator simulasi pembiayaan cicilan kredit (bunga flat & DP fleksibel), modul pengajuan Surat Pesanan Konsumen (SPK) oleh sales, kasir POS, dan cetak dokumen resmi.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Penyesuaian Kebutuhan Baru**:
> 1. **Fokus Produk**: Khusus **Smartphone Bekas / Second** kelas *mid-to-high end* (Apple iPhone seri 13 s/d 15 Pro, Samsung Galaxy S & Z Fold/Flip series, Google Pixel, Xiaomi Flagship series).
> 2. **Variasi Kondisi (Grading System)**:
>    - **Grade A+ (Like New 98%–99%)**: Bodi mulus sempurna tanpa baret, Battery Health (BH) 90%–100%, Fullset Box & Aksesoris Asli.
>    - **Grade A (Mulus 94%–97%)**: Baret mikroskopis sangat halus pemakaian wajar, BH 85%–90%, Box OEM + Fast Charger.
>    - **Grade B (Good Condition 88%–92%)**: Ada *scratches* / *dent* minor di bezel, fungsi hardware & layar 100% normal, Unit Only (Batangan) + Charger.
> 3. **Fitur Kredit & Sales Tetap Komplit Sesuai Permintaan Dosen**:
>    - Simulasi DP (Down Payment) mulai 15%–50% atau nominal kustom.
>    - Tenor cicilan 3, 6, 9, 12, hingga 18 bulan dengan bunga flat per bulan.
>    - Tabel amortisasi jadwal pembayaran per bulan.
>    - Formulir SPK Sales lengkap dengan NIK, nama sales, rincian unit HP yang dibeli (Grade, IMEI/SN), status approval (Pending/Approved/Rejected), dan cetak PDF/print dokumen resmi.
>    - Kasir POS untuk transaksi tunai langsung atau pelunasan DP kredit dengan cetak struk nota.

- **Penyimpanan**: `localStorage` terisi data awal smartphone second siap demonstrasi (foto produk, varian grade, IMEI dummy, daftar SPK aktif).

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**: Web aplikasi penjualan HP bekas spesialis kredit & cash, menjembatani tim sales toko dengan pembeli yang ingin memiliki smartphone high-end dengan skema cicilan terjangkau dan verifikasi kondisi yang jelas.
- **Nilai Tambah untuk Tugas Dosen**:
  - Dosen langsung melihat keunikan bisnis HP bekas: ada penilaian kondisi (Grade, Battery Health, Kelengkapan) yang mempengaruhi harga dan nilai DP/cicilan.
  - Alur sales sangat nyata: Konsumen datang $\to$ Sales memilihkan HP second sesuai budget $\to$ Hitung simulasi cicilan di depan konsumen $\to$ Buat SPK Kredit $\to$ Admin/Supervisor Review $\to$ Bayar DP di Kasir & Cetak Invoice/SPK.

---

### 2. User Experience & Visual Design

#### A. Alur Kerja Pengguna (User Flows)
1. **Katalog HP Second & Filter Kondisi**:
   - Tampilan unit HP bekas (iPhone 15 Pro Max, iPhone 14 Pro, Samsung Galaxy S24 Ultra, S23+, Pixel 8 Pro).
   - Filter cepat: Merk (Apple, Samsung, Google, Xiaomi), Rentang Grade (Grade A+, Grade A, Grade B), dan Kisaran Harga.
   - Kartu produk menampilkan: Foto detail unit, Kapasitas (misal 256GB), Warna, Grade Fisik, Battery Health (misal: BH 92%), Kelengkapan (Fullset/Batangan), Harga Cash, dan Estimasi Cicilan ("Cicilan mulai Rp 620rb/bln").
2. **Kalkulator Simulasi Kredit HP Second**:
   - Pengguna memilih HP bekas dari katalog atau memasukkan harga custom.
   - Slider DP: 15%, 20%, 30%, 40%, 50%, atau nominal rupiah langsung.
   - Pilihan Tenor: 3 bulan, 6 bulan, 9 bulan, 12 bulan, 18 bulan.
   - Bunga flat bulanan (default 1.5% / bln, dapat disesuaikan) + Biaya Administrasi Kredit (Rp 50.000).
   - Ringkasan Finansial: Harga HP, Uang Muka (DP), Pokok Utang, Total Bunga, Total Bayar, dan Angsuran Bulanan.
   - **Tabel Amortisasi Angsuran**: Menampilkan jadwal cicilan bulan ke-1 s/d selesai, tanggal jatuh tempo, rincian pokok + bunga, dan sisa utang.
3. **Pengajuan SPK Kredit oleh Tim Sales**:
   - Dari hasil simulasi, klik "Buat SPK Kredit".
   - Form Data Konsumen: Nama Lengkap, NIK KTP, No WhatsApp, Alamat Domisili, Pekerjaan, Estimasi Penghasilan Bulanan.
   - Data Sales: Pilih Sales Executive in-charge (misal: Dimas Pratama, Siti Nurhaliza, Reza Firmansyah).
   - Data Unit: Otomatis memuat Nama HP, Grade, Battery Health, dan Nomor IMEI unit bekas.
   - Status: Tersimpan otomatis ke antrean SPK dengan status *Pending Approval*.
4. **Verifikasi & Cetak SPK Resmi**:
   - Supervisor dapat mengubah status menjadi *Approved* atau *Rejected*.
   - Fitur **Cetak Formulir SPK & Kontrak Pembiayaan** resmi dengan kop toko, barcode pesanan, detail spesifikasi & IMEI unit bekas, rincian DP, skema angsuran, serta kolom tanda tangan Sales, Konsumen, dan Manajer.
5. **Kasir POS & Transaksi Tunai/Kredit**:
   - Kasir melayani pelunasan DP kredit (SPK yang sudah disetujui) atau transaksi pembelian HP secara tunai langsung.
   - Cetak struk nota belanja kasir format thermal receipt.

#### B. Visual Identity & Theme
- **Nuansa Tampilan**: Tech-retailer modern, bersih, dan terpercaya (*Clean Slate & Deep Cobalt Blue*).
- **Color Palette (60-30-10)**:
  - 60% Canvas: Slate-50 (`#F8FAFC`) dan white card surfaces (`#FFFFFF`).
  - 30% Structural: Slate-900 (`#0F172A`) untuk header & teks judul, Slate-200 (`#E2E8F0`) untuk hairline borders, Slate-600 untuk deskripsi.
  - 10% Accent: Blue-600 (`#2563EB`) untuk tombol aksi utama & slider kredit, Emerald-600 (`#16A34A`) untuk unit Like New & status Approved.
- **Tipografi**: `Plus Jakarta Sans` / modern sans untuk display, dipadukan dengan tabular numerals (`tabular-nums font-mono`) pada seluruh nominal Rupiah, IMEI, Battery Health, dan tabel angsuran.

---

### 3. Key Product Decisions & Trade-Offs

- **Grading & Atribut Khusus HP Bekas**:
  Setiap unit HP di katalog memiliki properti nyata ponsel second:
  - `grade`: `'Grade A+'` (Like New), `'Grade A'` (Mulus), atau `'Grade B'` (Baret Wajar).
  - `batteryHealth`: misal `94%`.
  - `completeness`: `'Fullset Original'` vs `'Box OEM + Charger'` vs `'Unit Only (Batangan)'`.
  - `imei`: Nomor identifikasi unik per unit.
  - `warranty`: Garansi toko (misal 30 hari hingga 90 hari tukar unit/servis).
- **Perhitungan Kredit Bunga Flat**:
  $$\text{Pokok Pinjaman} = \text{Harga HP} - \text{Down Payment (DP)}$$
  $$\text{Bunga Bulanan} = \text{Pokok Pinjaman} \times \left(\frac{\text{Suku Bunga}}{100}\right)$$
  $$\text{Angsuran per Bulan} = \frac{\text{Pokok Pinjaman}}{\text{Tenor}} + \text{Bunga Bulanan} + \frac{\text{Biaya Admin}}{\text{Tenor}}$$
  Formula ini sangat mudah dibuktikan dan dijelaskan mahasiswa kepada dosen penguji.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SecondPhone Pro Architecture                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Top Navigation: [SecondPhone Pro] ── [Katalog HP | Simulasi | SPK | Kasir]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   Used Smartphone Catalog   │  │    Used-Phone Financing Calculator   │  │
│  │  - iPhone & Android Flagship│  │  - DP Slider (15%-50% / Rupiah)      │  │
│  │  - Grade A+/A/B & BH Filter │──│  - Tenor (3, 6, 9, 12, 18 bln)       │  │
│  │  - IMEI & Completeness info │  │  - Flat Interest & Monthly Rate      │  │
│  │  - "Simulasi Cicilan" CTA   │  │  - Full Monthly Amortization Table   │  │
│  └─────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                       │                     │
│                                                       ▼                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Sales & SPK Management                        │  │
│  │  - Input Data Pembeli (NIK, WhatsApp, Alamat, Slip Gaji/Penghasilan)  │  │
│  │  - Auto-fill Data Unit (Grade, IMEI, Battery Health, Sisa Garansi)    │  │
│  │  - Assigned Sales Rep & Komisi Tracker                                │  │
│  │  - Approval Status (Pending / Approved / Rejected)                    │  │
│  │  - Printable Official SPK Contract & Credit Fact Sheet (CSS Print)    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      POS Cashier & DP Settlement                      │  │
│  │  - Pelunasan DP Kredit & Pembelian Tunai Langsung                     │  │
│  │  - Cetak Struk Nota Kasir Termal                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ localStorage Persistence Engine + Pre-seeded Second Smartphone Inventory    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Entitas Data Utama
- `UsedPhone`: ID, Model/Nama, Brand (`Apple` / `Samsung` / `Google` / `Xiaomi`), Storage, Warna, Harga Cash, Grade (`A+`, `A`, `B`), Battery Health (%), Kelengkapan, Garansi Toko, No. IMEI, Foto Unit.
- `CreditSimulation`: Harga Barang, Nilai DP, Pokok Hutang, Bunga (%/bln), Tenor, Biaya Admin, Angsuran/Bulan, Total Pembayaran, Jadwal Amortisasi.
- `SalesOrder (SPK)`: No. SPK (`SPK-SEC-2026-001`), Tanggal, Data Pembeli (NIK, Nama, No. HP, Alamat, Pekerjaan, Gaji), Data Sales (Nama, NIP), Detail Unit HP Second, Rincian Kredit, Status (`PENDING`, `APPROVED`, `REJECTED`), Status Bayar DP.
- `Transaction`: No. Nota, Tanggal, Tipe (`TUNAI` / `DP_KREDIT`), Metode Pembayaran (Cash / QRIS / Transfer), Nominal, Status.
