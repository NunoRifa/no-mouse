# Fondasi No Mouse dan CI Minimal

Status: disetujui pengguna dalam percakapan. Cakupan hanya proyek dasar dan CI, bukan implementasi seluruh PRD. Pembaruan berikutnya mengizinkan commit/push `development`; merge `master` tetap menunggu aplikasi selesai dan QA rilis lulus. Aturan terkini: `CLAUDE.md`.

## Tujuan

Menyediakan aplikasi dasar Android/iOS dan pendamping Windows yang dapat dibangun ulang serta diperiksa otomatis sebelum fitur remote dikembangkan.

## Konteks dan batas

- Pengembang bekerja dari Windows dan hanya memiliki iPhone, tanpa Mac.
- Repository Git dan remote GitHub sudah tersedia; jangan membuat repository baru.
- Flutter 3.47.5 tersedia. .NET SDK yang terdeteksi hanya 9.0.313.
- Tidak mengasumsikan Apple Developer Program, akses Mac cloud, atau anggaran layanan sudah disetujui.
- PRD tetap draf. Persetujuan desain ini hanya berlaku untuk fondasi dan CI.

## Pendekatan

1. **Flutter untuk Android/iOS + C#/.NET 10 LTS WPF untuk Windows — rekomendasi.** Berbagi UI mobile dan memakai integrasi Windows langsung. Konsekuensi: dua bahasa dan dua toolchain.
2. **Flutter untuk mobile dan Windows.** UI lebih seragam, tetapi kontrol desktop tetap memerlukan integrasi native. Tidak dipilih sebagai rekomendasi karena target pendamping hanya Windows.

Pilihan Flutter mobile + C#/.NET 10 LTS WPF disetujui pengguna. Versi SDK dikunci setelah kompatibilitas diverifikasi; jangan memakai tag SDK mengambang.

## Jalur iOS tanpa Mac lokal

- Fondasi menyertakan target iOS dan job macOS GitHub Actions untuk build simulator tanpa signing.
- Build simulator hanya membuktikan kompilasi target simulator; bukan bukti aplikasi terpasang atau berjalan pada iPhone.
- Uji iPhone fisik berstatus terblokir sampai akses signing dan pemasangan tersedia.
- Jalur lanjutan yang disarankan: akses sementara Mac yang kompatibel dengan Xcode untuk debug/pemasangan pribadi. Alternatif: build bertanda tangan pada macOS dan distribusi TestFlight setelah membership serta signing disetujui.
- TestFlight memerlukan Apple Developer Program. Akun Apple gratis dapat digunakan untuk pengujian pribadi melalui Xcode dengan batas provisioning, bukan distribusi TestFlight.
- Tidak membeli layanan, mendaftarkan akun, atau mengunggah kredensial Apple pada tahap fondasi.
- Simulator/runner cloud tidak menggantikan uji iPhone dan Windows pada LAN yang saling terjangkau. Jangan menghubungkan runner publik ke LAN pengguna.

## Hasil tahap ini

- `apps/mobile/`: aplikasi Flutter Android/iOS minimal dengan status belum terhubung; tidak menampilkan komputer atau sesi palsu.
- `apps/windows/`: aplikasi WPF minimal dengan status belum ada sesi; tidak membuka listener jaringan atau menjalankan input OS.
- `README.md`: prasyarat, perintah build/test, batas verifikasi, dan jalur uji iPhone.
- `.github/workflows/`: CI untuk pull request dan push ke branch utama yang diverifikasi dari repository.
- `.gitignore` dan konfigurasi SDK/dependensi yang diperlukan. Pertahankan PRD serta screenshot referensi; jangan memasukkan pengaturan lokal, rahasia, signing, atau hasil build ke Git.
- Usulan identifier awal memakai namespace pengembangan, bukan mengklaim identifier distribusi final. Identifier final diputuskan sebelum provisioning/store.

## CI minimal

- Mobile pada Linux: format, analisis statis, satu tes UI kondisi awal, build APK debug.
- Windows pada runner Windows: restore, pemeriksaan format, build Release, dan pemeriksaan dasar yang relevan tanpa menambah logika produk demi tes.
- iOS pada runner macOS: build simulator tanpa signing. Versi runner/Xcode harus kompatibel dengan Flutter yang dipilih.
- Pemeriksaan bersifat read-only terhadap repository, tanpa deploy, signing, akses LAN, atau kredensial rilis.
- Gunakan izin minimum, hindari menjalankan kode pull request dengan rahasia atau trigger berprivilege, dan batalkan run lama pada perubahan branch yang sama.
- Ketersediaan runner dan kuota/biaya GitHub perlu dicek sebelum aktivasi. Tidak menganggap semua runner gratis pada semua repository.

## Tidak termasuk

Pairing QR, autentikasi jaringan, remote input, screen capture, clipboard, panel lengkap, layanan cloud, CD, signing, installer produksi, publikasi store, commit, dan push otomatis.

## Penerimaan

- Build/test lokal yang tersedia selesai tanpa error; kegagalan atau SDK yang belum tersedia dilaporkan apa adanya.
- Aplikasi dasar tidak mengaku tersambung atau memiliki fitur remote yang belum dibuat.
- Pemeriksaan sederhana ditinggalkan untuk kondisi awal mobile; tidak ada test suite palsu yang selalu lulus.
- YAML CI diperiksa. Job GitHub belum disebut lulus sebelum benar-benar dijalankan di GitHub.
- Build dan uji runtime iPhone tidak disebut selesai hanya karena build simulator berhasil.
- Pengembangan fitur besar dimulai setelah fondasi dan batas pengujian ini diverifikasi.

## Langkah setelah persetujuan

Buat rencana implementasi ringkas, verifikasi toolchain dan akses runner, lalu buat fondasi serta CI. Instalasi .NET 10 dilakukan melalui izin tool bila diperlukan. Upload/push, biaya, signing, dan pembelian layanan membutuhkan izin terpisah.
