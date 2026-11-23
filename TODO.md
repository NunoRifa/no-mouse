# TODO — No Mouse

Pembaruan: 23 November 2026. Snapshot implementasi: `c472014` pada branch `development`, sudah dipush ke `origin/development`.

**Status: fondasi tersedia, fitur remote belum dibuat, QA menyeluruh belum lulus. Jangan merge ke `master`.**

## Cara membaca dan memperbarui

- `[x]` berarti hasil pada item tersebut sudah tersedia atau memiliki bukti verifikasi yang disebutkan; bukan berarti seluruh fitur/produk lulus QA.
- `[ ]` berarti belum selesai, terblokir, atau belum diverifikasi. Keterangan menjelaskan perbedaannya.
- PRD tetap sumber kebutuhan: [PRD.md](PRD.md). Detail hasil uji: [QA fondasi](docs/qa/foundation.md).
- Perbarui checklist setelah perubahan dan verifikasi nyata; cantumkan commit/run CI atau bukti QA. Jangan centang build hanya karena source tersedia.
- Instruksi branch lintas sesi: [CLAUDE.md](CLAUDE.md). Commit/push pengembangan ke `development`; `master` hanya setelah aplikasi selesai dan QA rilis lulus.

## 1. Sudah tersedia di development

### Dokumentasi dan workflow

- [x] PRD mencakup tujuan, dua profil pengguna, delapan user story, prioritas MVP, alur, halaman, risiko, dan kriteria penerimaan. Status PRD masih draf; seluruh usulannya belum otomatis disetujui.
- [x] Delapan screenshot referensi tersimpan di `asset/` sebagai referensi fungsi, bukan aset visual rilis.
- [x] Desain fondasi dan rencana implementasi tersedia di `docs/superpowers/` dan cakupan fondasi disetujui.
- [x] Branch `development` dibuat dan melacak `origin/development`; fondasi dipush melalui commit `c472014`.
- [x] Aturan commit/push dan gate merge `master` dicatat di `CLAUDE.md`.
- [x] README memuat toolchain, perintah pengembangan, keterbatasan, dan jalur uji iOS.
- [x] Laporan QA fondasi mencatat hasil uji serta blocker. Beberapa status laporan masih snapshot sebelum push; hasil Git terbaru dicatat pada TODO ini.

### Proyek dasar

- [x] Scaffold Flutter Android dan iOS pada `apps/mobile/`.
- [x] Halaman awal mobile menampilkan komputer kosong dan menjelaskan pairing belum tersedia, tanpa sesi palsu.
- [x] Dua tes widget: kondisi awal dan viewport 320×640 dengan ukuran teks 2x.
- [x] Pemeriksaan lokal terakhir: tes widget **2/2 lulus**, format Dart bersih, analisis Flutter tanpa masalah. Bukti tercatat pada QA fondasi; bukan pengujian perangkat fisik.
- [x] Source pendamping C# WPF pada `apps/windows/`, hanya jendela status belum ada sesi.
- [x] Konfigurasi versi: Flutter 3.47.5, Dart bawaannya 3.13.4, SDK .NET 10.0.404 pada `global.json`, serta `pubspec.lock`.
- [x] `.gitignore` mengecualikan konfigurasi lokal, rahasia/signing, cache, dan hasil build; `.editorconfig` tersedia.

### Konfigurasi CI — belum berarti run lulus

- [x] `.github/workflows/ci.yml` berisi job Linux untuk Flutter/Android, Windows untuk WPF, dan macOS untuk iOS Simulator tanpa signing.
- [x] Trigger untuk push dan pull request pada `development`/`master`; izin minimum, timeout, concurrency, tanpa signing/deployment.
- [x] Flutter source dipin pada revision `6a19cca56475dbfba1478ee68d7bd0c2ef891da1`; fetch tag versi dan verifikasi SHA ditambahkan setelah review independen.
- [x] YAML dapat diparse dan sintaks XML/JSON WPF/SDK diperiksa. Ini bukan bukti job Actions atau kompilasi WPF berhasil.
- [x] Pengguna memberi izin eksekusi sumber Flutter terkunci pada CI untuk push fondasi ini.

## 2. Prioritas sekarang: tuntaskan verifikasi fondasi

- [ ] Periksa run GitHub Actions untuk commit `c472014`: status ketiga job, log, dan kompatibilitas runner/Xcode. **Belum diverifikasi**, jangan diasumsikan gagal maupun berhasil.
- [ ] Pulihkan akses DNS/jaringan Maven untuk unduhan dependensi Android. Build terakhir gagal mengunduh `kotlin-compiler-embeddable-2.2.21.jar` dari `repo.maven.apache.org`.
- [ ] Pengguna membaca dan memutuskan lisensi Android melalui `flutter doctor --android-licenses`; tidak diterima otomatis atas nama pengguna.
- [ ] Jalankan ulang build APK debug tanpa build Gradle paralel; catat hasil.
- [ ] Lengkapi instalasi SDK .NET 10.0.404. Unduhan sebelumnya terputus/reset/timeout; jangan mengekstrak atau menjalankan arsip parsial tanpa checksum valid.
- [ ] Jalankan restore, format check, dan build WPF Release menggunakan SDK terkunci. Percobaan build terakhir terblokir SDK yang belum tersedia; tidak fallback ke .NET 9.
- [ ] Jalankan aplikasi WPF dan periksa startup serta status kosong.
- [ ] Buktikan build iOS Simulator pada macOS CI. Tidak ada Mac lokal; build ini bukan QA iPhone.
- [ ] Perbarui laporan QA dengan hasil Git/CI/build terbaru dan tautan run yang benar.

## 3. Keputusan produk yang perlu ditutup

Lihat OQ-01–OQ-10 pada PRD untuk alasan dan metode validasi. Berikut belum merupakan keputusan final.

- [ ] Validasi masalah, dua profil pengguna, dan alasan memilih No Mouse dibanding aplikasi sejenis.
- [ ] Konfirmasi makna seluruh ikon referensi media/jendela; buat checklist aksi agar tidak ada fungsi wajib terlewat.
- [ ] Tetapkan versi minimum Android/iOS/Windows dan dukungan arsitektur.
- [ ] Tetapkan aplikasi media, browser, serta peluncur yang dijamin didukung.
- [ ] Setujui detail pairing: konfirmasi pasangan baru di Windows, masa berlaku QR, dan pembatasan percobaan.
- [ ] Setujui detail sesi: konflik pengontrol, lock/background, monitor pilihan, dan perilaku reconnect.
- [ ] Kalibrasi dan setujui target latensi/keterbacaan/stabilitas serta batas clipboard melalui prototipe.
- [ ] Tetapkan bahasa UI, cakupan aksesibilitas, kanal distribusi, biaya, identifier final, dan kebijakan privasi.

## 4. Fitur MVP yang belum dibuat

Tidak ada endpoint/listener remote, pairing, atau kendali OS pada fondasi saat ini. Checklist berikut mengacu FR-01–FR-10 di PRD; detail berstatus usulan perlu disepakati sebelum implementasi terkait.

### Koneksi, pairing, dan sesi — FR-01, FR-02, FR-03

- [ ] Koneksi LAN dan identitas komputer terverifikasi; Ethernet–Wi-Fi dan beda SSID yang saling terjangkau.
- [ ] QR di Windows, pemindai di HP, izin kamera saat diperlukan, dan penanganan QR salah/kedaluwarsa.
- [ ] Pairing terautentikasi dan terenkripsi; QR tidak menjadi kredensial permanen.
- [ ] Penyimpanan perangkat tepercaya yang aman, daftar pasangan, cabut per perangkat/cabut semua.
- [ ] Autentikasi koneksi ulang, penolakan akses dicabut, dan penghentian semua kemampuan sesi.
- [ ] Indikator sesi Windows, putus sesi, konflik pengontrol, dan perilaku lock/background/pergantian pengguna.

### Mouse, keyboard, dan layar — FR-04, FR-05, FR-06

- [ ] Touchpad: gerak, klik kiri/kanan/tengah, klik ganda, drag, scroll vertikal/horizontal.
- [ ] Sentuh langsung pada gambar desktop dengan pemetaan koordinat yang benar.
- [ ] Penanganan resolusi, DPI, monitor, perubahan viewport, serta penolakan klik pada gambar basi.
- [ ] Keyboard teks, Unicode/komposisi yang didukung, navigasi, F1–F12, numpad, dan shortcut modifier.
- [ ] Pelepasan input/modifier saat sesi putus, mode berubah, atau aplikasi berhenti aktif.
- [ ] Tampilan layar dan kursor aktual yang cukup terbaca; aktif/nonaktif eksplisit dan status terpisah dari input.
- [ ] Penanganan capture gagal, DRM, serta batas UAC/secure desktop tanpa bypass.

### Panel fungsi — FR-07, FR-08, FR-09

- [ ] Media dan volume, dengan target serta matriks kompatibilitas jelas.
- [ ] Akses/pindah aplikasi dan kontrol jendela sesuai inventaris referensi terkonfirmasi.
- [ ] Browser: navigasi, tab/jendela, zoom, home, refresh, dan shortcut situs bawaan.
- [ ] Clipboard teks HP ke Windows dan sebaliknya atas tindakan eksplisit, tanpa paste/Enter otomatis.
- [ ] Penanganan clipboard kosong, nonteks, Unicode, ukuran berlebih, izin ditolak, dan hasil transfer belum diketahui.
- [ ] Shutdown, sleep, restart, logout dengan konfirmasi dan tanpa memaksa tutup pekerjaan belum disimpan.

### Pemulihan dan keamanan — FR-10, SEC-01–SEC-10

- [ ] Status koneksi dan panduan error yang dapat ditindaklanjuti.
- [ ] Reconnect tanpa replay klik/ketikan/clipboard/perintah daya lama.
- [ ] Input tertahan dilepas, gambar basi ditandai, dan sentuh langsung diblokir sampai aman.
- [ ] Validasi batas data/perintah, penolakan pasangan asing, replay, dan identitas palsu.
- [ ] Privasi layar/clipboard, log tersanitasi, izin minimum, tanpa telemetry konten sensitif.
- [ ] Kebijakan privasi, retensi data lokal, keaslian paket, dan distribusi resmi.

## 5. QA perangkat nyata dan gate rilis

- [ ] Siapkan akses pengujian Android fisik/emulator sesuai matriks; belum ada bukti runtime Android.
- [ ] Siapkan akses Mac sementara atau jalur signing/TestFlight dengan persetujuan terpisah; pengguna hanya memiliki iPhone dan Windows.
- [ ] Pasang dan uji pada iPhone fisik; verifikasi kamera, jaringan lokal, keyboard, clipboard, background, dan LAN ke Windows.
- [ ] Uji pairing tanpa bantuan pengguna, respons input, keterbacaan layar, dan sesi penggunaan panjang.
- [ ] Uji jaringan terisolasi/putus, IP berubah, konflik perangkat, DPI/monitor, UAC/DRM, dan tindakan daya.
- [ ] Jalankan review keamanan serta privasi; tidak ada temuan kritis/tinggi yang belum ditangani.
- [ ] Verifikasi aksesibilitas TalkBack/VoiceOver, ukuran teks, label kontrol, dan konfirmasi berisiko.
- [ ] Siapkan aset sendiri/berlisensi, signing, informasi dukungan, deklarasi store, dan batas kompatibilitas.
- [ ] Semua fungsi wajib dan gate rilis PRD lulus dengan bukti terdokumentasi.
- [ ] **Baru setelah aplikasi selesai dan QA rilis lulus:** merge `development` ke `master` sesuai aturan proyek. Belum diizinkan oleh status saat ini.

## 6. Ditunda, bukan kekurangan MVP

Tidak termasuk pekerjaan aktif sampai scope diubah:

- Kontrol melalui internet, relay/cloud, akun dan sinkronisasi cloud.
- Komputer target macOS/Linux.
- Streaming film berkualitas tinggi dan audio komputer.
- Transfer file/gambar clipboard serta sinkronisasi clipboard otomatis.
- Kontrol simultan beberapa HP/komputer dan Wake-on-LAN.
- Iklan/freemium; evaluasi setelah definisi jumlah pengguna dan keputusan monetisasi disepakati.
- Tambahan kenyamanan: sensitivitas, landscape yang dipoles, getaran, kustomisasi shortcut, diagnosis mendalam, dan autostart Windows.
- Zoom/pan merupakan tambahan kecuali dibutuhkan untuk memenuhi kriteria keterbacaan; jika dibutuhkan, perlakukan sebagai wajib.
