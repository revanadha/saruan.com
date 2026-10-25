# Panduan Undangan Pernikahan Digital (Botanical Sage & Warm Gold)

Selamat datang di website undangan pernikahan digital Anda. Website ini dirancang dengan gaya editorial modern yang elegan, perpaduan warna deep sage green dan aksen warm gold sesuai dokumen panduan `DESIGN.md`.

---

## 1. Cara Menjalankan & Membuka Website

### Cara Cepat (Langsung di Browser)
Cukup klik ganda (double-click) file `index.html` pada File Explorer untuk membukanya di browser apa pun (Google Chrome, Microsoft Edge, Safari, Firefox).

### Cara Menjalankan dengan Local Web Server (Opsional)
Jika Anda memiliki Node.js atau Python terpasang di komputer:
```bash
# Menggunakan Node.js npx serve
npx serve .

# ATAU menggunakan Python
python -m http.server 8080
```
Buka browser di `http://localhost:8080`.

---

## 2. Cara Mengganti Foto dengan Foto Anda Sendiri

Semua foto demonstrasi telah disiapkan di folder `assets/images/`. Untuk menggantinya dengan foto asli Anda dan pasangan:

1. **Foto Sampul Depan / Cover**:
   - Ganti file `assets/images/cover.jpg` dengan foto landscape berdua Anda dan pasangan (disarankan rasio 16:9 atau 4:3).
2. **Foto Mempelai Pria**:
   - Ganti file `assets/images/groom.jpg` dengan foto portrait mempelai pria (disarankan rasio 1:1 / persegi).
3. **Foto Mempelai Wanita**:
   - Ganti file `assets/images/bride.jpg` dengan foto portrait mempelai wanita (disarankan rasio 1:1 / persegi).
4. **Foto Galeri Prewedding**:
   - Ganti file `assets/images/gallery-1.jpg`
   - Ganti file `assets/images/gallery-2.jpg`
   - Ganti file `assets/images/gallery-3.jpg`
   - Ganti file `assets/images/gallery-4.jpg`

> **Tips:** Jika foto Anda menggunakan nama file lain (misal: `foto-kita.png`), Anda cukup mengubah nilai atribut `src="..."` pada file `index.html`.

---

## 3. Personalisasi Nama Tamu di Tautan Undangan

Anda dapat membagikan tautan undangan khusus untuk setiap tamu dengan menambahkan parameter `?to=Nama+Tamu` di akhir alamat website:

Contoh:
- `index.html?to=Bapak+Budi+Santoso+Sekeluarga`
- `index.html?to=Sahabat+Alumni+SMA+1`
- `https://undangan-anda.com/?to=Ibu+Siti+Rahmawati`

Nama tamu undangan akan langsung tampil di kartu pembuka cover secara personal dan elegan.

---

## 4. Cara Mengubah Data Pasangan, Acara, & Rekening

Buka file `index.html` dengan teks editor:
- **Nama Mempelai & Orang Tua**: Cari teks `Dimas Pratama` dan `Adinda Larasati` di seksi `#mempelai`.
- **Waktu & Lokasi Acara**: Cari seksi `#acara` untuk mengubah tanggal, jam, dan nama gedung.
- **Tanggal Hitung Mundur (Countdown)**: Buka file `js/app.js`, sesuaikan variabel `targetDate` (baris 45) dengan tanggal acara Anda.
- **Nomor Rekening / Amplop Digital**: Cari seksi `#hadiah` di `index.html` untuk mengganti nomor rekening BCA, Mandiri, atau alamat pengiriman kado.

---

## 5. Musik Latar (Background Music)

- Website ini telah dilengkapi dengan musik latar romantis harmonis bawaan (Web Audio API Synthesizer) yang berputar otomatis ketika tamu menekan tombol "Buka Undangan".
- **Jika Anda memiliki file lagu MP3 sendiri**:
  Cukup letakkan file lagu pernikahan favorit Anda di folder `assets/audio/wedding-song.mp3`. Sistem akan otomatis mendeteksi dan memutar lagu pilihan Anda.

---

## 6. Fitur Utama yang Telah Tersedia

1. **Layar Pembuka Interaktif (Cover Screen)**: Menampilkan nama tamu dan tombol "Buka Undangan" yang memicu alunan musik latar secara otomatis.
2. **Pengontrol Musik Melayang**: Tombol play/pause di pojok layar dengan animasi piringan berputar.
3. **Navigasi Cepat Melayang (Quick Nav)**: Memudahkan tamu melompat antar seksi acara di perangkat ponsel maupun desktop.
4. **Penghitung Mundur Real-Time (Countdown Timer)**: Menghitung hari, jam, menit, dan detik secara langsung.
5. **Simpan ke Kalender**: Tombol langsung untuk menambahkan acara ke Google Calendar dan mengunduh berkas kalender `.ics`.
6. **Petunjuk Peta Lokasi**: Tombol langsung menuju Google Maps lokasi acara.
7. **Galeri Foto & Lightbox Modal**: Pratinjau foto resolusi penuh dengan navigasi geser dan tombol keyboard (`Escape`, Panah Kanan, Panah Kiri).
8. **Buku Tamu & RSVP Interaktif**: Formulir konfirmasi kehadiran dan pengiriman doa restu yang tersimpan otomatis di browser (`localStorage`).
9. **Amplop Digital dengan Fitur Salin Rekening**: Tombol "Salin Nomor Rekening" yang menyalin ke clipboard disertai notifikasi toast konfirmasi.
10. **Aksesibilitas & Responsif Sempurna**: Ramah layar smartphone (Android & iPhone), rasio kontras warna tinggi (WCAG AA), dan navigasi keyboard yang nyaman.
