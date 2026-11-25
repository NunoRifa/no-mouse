# TODO — No Mouse

Pembaruan: 25 November 2026. Source fondasi: `c472014`; keputusan discovery sampai `c2ab7d8` sudah dipush ke `development`. PRD v0.2 mengonsolidasikan keputusan berikutnya tanpa mengubah kode atau bukti QA.

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
- [x] Laporan QA fondasi diperbarui dengan bukti CI remote `21b10d9`, SDK .NET terpasang, build dan runtime WPF, serta batas uji perangkat nyata.

### Proyek dasar

- [x] Scaffold Flutter Android dan iOS pada `apps/mobile/`.
- [x] Halaman awal mobile menampilkan komputer kosong dan menjelaskan pairing belum tersedia, tanpa sesi palsu.
- [x] Dua tes widget: kondisi awal dan viewport 320×640 dengan ukuran teks 2x.
- [x] Pemeriksaan lokal terakhir: tes widget **2/2 lulus**, format Dart bersih, analisis Flutter tanpa masalah. Bukti tercatat pada QA fondasi; bukan pengujian perangkat fisik.
- [x] Source pendamping C# WPF pada `apps/windows/`, hanya jendela status belum ada sesi.
- [x] Konfigurasi versi: Flutter 3.47.5, Dart bawaannya 3.13.4, SDK .NET 10.0.404 pada `global.json`, serta `pubspec.lock`.
- [x] `.gitignore` mengecualikan konfigurasi lokal, rahasia/signing, cache, dan hasil build; `.editorconfig` tersedia.

### Konfigurasi CI — tiga job terverifikasi lulus

- [x] `.github/workflows/ci.yml` berisi job Linux untuk Flutter/Android, Windows untuk WPF, dan macOS untuk iOS Simulator tanpa signing.
- [x] Trigger untuk push dan pull request pada `development`/`master`; izin minimum, timeout, concurrency, tanpa signing/deployment.
- [x] Flutter source dipin pada revision `6a19cca56475dbfba1478ee68d7bd0c2ef891da1`; fetch tag versi dan verifikasi SHA ditambahkan setelah review independen.
- [x] YAML dapat diparse dan sintaks XML/JSON WPF/SDK diperiksa. Ini bukan bukti job Actions atau kompilasi WPF berhasil.
- [x] Pengguna memberi izin eksekusi sumber Flutter terkunci pada CI untuk push fondasi ini.

## 2. Prioritas sekarang: tuntaskan verifikasi fondasi

- [x] Periksa CI `c472014` dan `21b10d9`: keduanya success. [Run 45132269694](https://github.com/NunoRifa/no-mouse/actions/runs/45132269694) diverifikasi per job/step: Android, Windows, iOS Simulator lulus. Versi tepat Xcode tidak dikutip tanpa membaca log; kompatibilitas hanya dibuktikan untuk runner yang dipakai.
- [x] Endpoint Maven yang sebelumnya gagal kembali HTTP 200; build lokal melewati kendala Kotlin sebelumnya. Blocker unduhan berikutnya ada pada `storage.googleapis.com`, bukan lisensi/Maven.
- [x] Lisensi Android diterima sendiri oleh pengguna: output `All SDK package licenses accepted.`
- [ ] Selesaikan build APK debug lokal: percobaan terbaru gagal `:app:mergeDebugAssets` karena artefak engine Flutter dari `storage.googleapis.com` mengalami `Read timed out`. Diagnosis 24 November: TCP/TLS berhasil tetapi HTTP tidak membalas, termasuk IPv4 eksplisit; tidak ada proxy aktif. Alias yang gagal sertifikat tidak dipakai. Perlu uji jalur koneksi lain/hotspot oleh pengguna sebelum retry build; CI Android tetap lulus.
- [x] SDK .NET 10.0.404 terpasang lokal setelah SHA-512 arsip resmi cocok; PATH mesin tidak diubah.
- [x] Restore, format check, build WPF Release lokal lulus: 0 warning, 0 error; SDK tetap .NET 10 sesuai `global.json`.
- [x] Aplikasi WPF asli dibuka, ketiga teks status diverifikasi melalui UI Automation, lalu jendela ditutup.
- [x] Build iOS Simulator tanpa signing lulus di macOS CI. **Bukan QA runtime iPhone.**
- [x] Laporan [QA fondasi](docs/qa/foundation.md) diperbarui dengan tautan run, hasil lokal, serta blocker Android `storage.googleapis.com`. Poin 2 belum selesai seluruhnya sampai APK lokal berhasil dibangun.

## 3. Keputusan produk, desain terbuka, dan validasi

**Keputusan inti discovery sudah tercatat; poin 3 belum seluruhnya selesai.** Centang bagian 3.1 berarti keputusan ditutup, bukan kode/QA lulus. Referensi detail: PRD bagian 4, FR-01–FR-10, bagian 13 dan OQ-01–OQ-10.

### 3.1 Keputusan final dari pengguna

- [x] Windows 11 x64; Android 10/API 29+; iOS 18.0+. Windows 10/ARM, macOS/Linux dan OS HP lebih lama ditunda.
- [x] LAN saja, pairing QR 120 detik sekali pakai; persetujuan Windows hanya untuk pasangan baru; kepercayaan sampai dicabut.
- [x] Satu HP mengontrol komputer; koneksi kedua ditolak sampai sesi pertama berakhir. HP lock/background mengakhiri sesi tanpa menghapus kepercayaan.
- [x] Windows lock mempertahankan sesi; HP tepercaya boleh reconnect jika tidak sibuk. Ganti pengguna mengakhiri sesi. Kontrol lock screen/password manual **wajib MVP**, komponen tambahan dapat diperlukan; bukan bypass atau penyimpanan password.
- [x] Saat Windows terkunci: hanya mouse, keyboard login dan tampilan lock screen manual; Browser, Media/volume, Aplikasi, clipboard serta daya nonaktif.
- [x] Touchpad dan sentuh langsung; pilih satu atau semua monitor. Semua monitor berupa desktop gabungan sesuai susunan Windows, zoom/pan wajib; gerak remote mode satu monitor dibatasi monitor pilihan tanpa mengunci mouse fisik.
- [x] Tampilan layar diaktifkan manual, termasuk setelah reconnect.
- [x] Chrome, Edge, Firefox; sasaran media Netflix, YouTube, YouTube Music, Spotify web/desktop. Target dipilih di HP dan tetap selama sesi; volume mengatur Windows. Tombol tak didukung nonaktif dengan alasan jelas, tanpa mengganti aksi diam-diam.
- [x] Queue tampil di pemutar komputer, stop, Win+Tab dan Win+D terkonfirmasi. X merah media dan tombol paling kanan `key-panel-2.jpg` ditunda dari MVP. Laporan kompatibilitas aplikasi referensi bukan hasil uji No Mouse.
- [x] Aplikasi berjalan ditampilkan per jendela dengan nama/judul. Shortcut pilihan diatur di Windows dan dijalankan HP, bukan path/perintah bebas.
- [x] Clipboard teks manual dua arah tanpa paste/Enter otomatis; kontrol daya memerlukan konfirmasi. Keduanya hanya saat Windows terbuka.
- [x] HP dan Windows mendukung Indonesia/Inggris mengikuti OS dengan override manual lokal. Fallback Windows Inggris; fallback HP masih usulan.
- [x] Google Play, App Store, GitHub Releases Windows. Akun Apple Developer Program/Google Play Console belum tersedia; keputusan kanal bukan izin pembelian atau publikasi.
- [x] Tanpa analytics/crash upload otomatis; diagnosis lokal tanpa konten sensitif, pembagian laporan eksplisit.
- [x] Target uji LAN sehat: p95 input ≤100 ms, delay layar ≤500 ms, reconnect ≤5 detik; stabilitas 60 menit per Android/iOS; pairing tanpa bantuan 9/10 pengguna dalam ≤2 menit setelah instalasi. **Belum ada hasil uji fitur remote.**

### 3.2 Studi kelayakan dan desain — belum selesai

- [x] Riset dokumentasi awal lock screen selesai: [studi kelayakan](docs/feasibility/windows-lock-screen.md). Tray biasa tidak cukup; Session 0, UIPI dan akses capture secure desktop memiliki batas terpisah. Rekomendasi kandidat broker/helper terisolasi, **bukan bukti runtime atau persetujuan arsitektur**.
- [ ] **Prioritas pertama: buktikan lock screen Windows 11 x64.** Desain spike lokal terisolasi perlu disetujui sebelum eksekusi/pemasangan komponen privilege; uji input/capture, hak minimum, isolasi akun, IPC, instalasi/signing, secure attention, dan penolakan panel terlarang. Tidak ada service dipasang atau fitur lock screen yang sudah diuji.
- [x] Studi kompatibilitas dokumentasi diselesaikan: [media/browser](docs/feasibility/media-browser.md). Windows GSMTC menyediakan sesi/capability/playback request, tetapi tidak menjamin identitas tab atau queue. Media Session API milik situs bukan kontrol universal bagi desktop. Kandidat pertama GSMTC read-only; **belum ada uji runtime No Mouse atau dukungan layanan terbukti**.
- [x] Probe API GSMTC baca-saja lokal berhasil pada Windows 11 Home x64 build 26200, host PowerShell non-admin: satu sesi `Playing`, Pause/Stop true, Play/Next/Previous false. Tanpa baca judul/URL/source ID atau perintah playback. Bukti di studi media bagian 9; bukan integrasi WPF/No Mouse atau dukungan layanan tertentu.
- [ ] Tahap berikut: fixture media uji nonpribadi di beberapa tab dan Spotify desktop; buktikan atribusi/identitas target dan capability tanpa mengakses sesi personal sembarang. Belum memasang ekstensi atau mengirim transport sebelum uji inventory read-only cukup dan izin eksplisit untuk tahap transport. Queue/stop tiap layanan tetap belum dibuktikan; queue Netflix referensi belum dikonfirmasi.
- [ ] Buktikan desktop gabungan, koordinat negatif/celah antar monitor, DPI/resolusi berbeda, hotplug, batas gerak remote dan interaksi mouse fisik; tentukan kapasitas/performa dengan bukti.
- [ ] Desain keamanan pairing/protokol: identitas kedua pihak, replay, rate limit, pencabutan, penyimpanan kredensial, kapan token QR dikonsumsi, serta pembatalan halaman. Durasi QR/persetujuan pertama tidak perlu ditanyakan ulang.
- [ ] Tetapkan timeout liveness, perpindahan capture saat lock/unlock, apakah aktivasi layar perlu diulang saat lock tanpa reconnect, dan batas satu komputer aktif per HP yang masih usulan.
- [ ] Selaraskan minSdk Android/iOS deployment target serta target Windows dengan keputusan produk; pilih build Windows 11 yang aman/didukung. Konfigurasi proyek belum dinyatakan berubah hanya karena PRD diperbarui.
- [ ] Lengkapi aksi browser/jendela referensi yang belum jelas, shortcut situs bawaan, dan tipe aplikasi Windows yang dapat didaftarkan. Jangan menghidupkan kembali dua tombol yang sudah ditunda.
- [ ] Tetapkan parameter usulan lewat bukti: batas clipboard 100 KB, log 7 hari/batas ukuran, fallback HP Inggris, fps, kondisi LAN/sampel, keterbacaan dan target tugas inti.

### 3.3 Validasi pengguna, perangkat, dan distribusi — belum selesai

- [ ] Wawancara calon pengguna untuk masalah, dua profil, pembeda, dan alasan berpindah; pengalaman pribadi belum bukti pasar.
- [ ] Siapkan pengujian iPhone XS/iOS 18.7.11 dan iPhone 13/iOS 26.1; catat versi aktual. Belum ada HP Android fisik; siapkan pinjaman/penguji beta berizin, bukan menganggap emulator cukup.
- [ ] Uji target pairing, latensi, stabilitas, keterbacaan dan pemulihan di perangkat nyata setelah fitur ada; pisahkan uji gangguan dari sesi LAN sehat.
- [ ] Uji lokalisasi dua bahasa, font besar, TalkBack/VoiceOver dan aksesibilitas Windows; tulis batas aksesibilitas desktop remote.
- [ ] Siapkan akun developer, biaya, identifier final, signing, kebijakan privasi dan disclosure izin/komponen privilege dengan persetujuan pengguna terpisah.

### 3.4 Urutan kerja yang direkomendasikan

Tuntaskan blocker build APK lokal poin 2 saat endpoint resmi dapat diakses. Studi dokumentasi lock screen dan media/browser tersedia, tetapi belum membuktikan runtime; berikutnya rancang spike lokal lock screen yang aman, lalu jalankan hanya setelah target mesin uji, privilege, dan pemulihan disetujui. Studi media berikutnya bersifat read-only/local sesuai `docs/feasibility/media-browser.md`. Belum ada izin baru untuk memasang service/extension berprivilege, membeli layanan, atau mengubah gate `master`.

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
- [ ] Pilih satu/semua monitor, desktop gabungan sesuai susunan Windows, zoom/pan, batas gerak remote monitor pilihan, serta penanganan DPI/hotplug/gambar basi.
- [ ] Keyboard teks, Unicode/komposisi yang didukung, navigasi, F1–F12, numpad, dan shortcut modifier.
- [ ] Pelepasan input/modifier saat sesi putus, mode berubah, atau aplikasi berhenti aktif.
- [ ] Tampilan layar dan kursor aktual yang cukup terbaca; aktif/nonaktif eksplisit, aktivasi ulang manual setelah reconnect, dan status terpisah dari input.
- [ ] Penanganan capture gagal/DRM dan batas UAC tanpa bypass; kontrol lock screen sesi aktif wajib melalui jalur berizin, bukan dikecualikan diam-diam.
- [ ] Reconnect hanya perangkat tepercaya saat Windows terkunci, input password manual tanpa penyimpanan/log/replay, serta penolakan panel terlarang di sisi Windows.

### Panel fungsi — FR-07, FR-08, FR-09

- [ ] Media dengan pilihan target persisten per sesi, capability/error jelas, dan volume Windows; Browser/Media nonaktif saat lock.
- [ ] Akses/pindah per jendela dan shortcut yang diatur Windows; panel Aplikasi nonaktif saat lock.
- [ ] Browser: navigasi, tab/jendela, zoom, home, refresh, dan shortcut situs bawaan.
- [ ] Clipboard teks HP ke Windows dan sebaliknya atas tindakan eksplisit, tanpa paste/Enter otomatis.
- [ ] Penanganan clipboard kosong, nonteks, Unicode, ukuran berlebih, izin ditolak, dan hasil transfer belum diketahui.
- [ ] Shutdown, sleep, restart, logout dengan konfirmasi dan tanpa memaksa tutup pekerjaan belum disimpan.

### Pemulihan dan keamanan — FR-10, SEC-01–SEC-10

- [ ] Status koneksi dan panduan error yang dapat ditindaklanjuti.
- [ ] Reconnect tanpa replay klik/ketikan/clipboard/perintah daya lama.
- [ ] Input tertahan dilepas, gambar basi ditandai, dan sentuh langsung diblokir sampai aman.
- [ ] Validasi batas data/perintah, penolakan pasangan asing, replay, dan identitas palsu.
- [ ] Privasi layar/clipboard, log lokal tersanitasi, izin minimum, tanpa analytics/crash upload otomatis; ekspor diagnosis atas tindakan eksplisit.
- [ ] Lokalisasi Indonesia/Inggris mobile/Windows dengan ikuti OS, override manual tersimpan dan fallback sesuai keputusan.
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
- Bukan lagi fitur ditunda: zoom/pan serta pemilihan satu/semua monitor wajib MVP sesuai keputusan 25 November 2026. Mode semua monitor berupa desktop gabungan mengikuti susunan Windows.
