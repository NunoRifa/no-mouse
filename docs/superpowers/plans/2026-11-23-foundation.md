# Fondasi No Mouse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat proyek dasar mobile/Windows dan CI minimal tanpa fitur remote.

**Architecture:** Satu repository, Flutter Android/iOS pada `apps/mobile/`, WPF pada `apps/windows/`. CI memeriksa masing-masing target pada runner sesuai platform; tidak ada listener jaringan, server cloud, atau distribusi otomatis.

**Tech Stack:** Flutter 3.47.5 / Dart bawaan, C#/.NET 10 LTS WPF, GitHub Actions. Kandidat SDK .NET 10.0.404 berasal dari metadata resmi; verifikasi tersedia sebelum mengunci. Jangan mengganti versi diam-diam bila unduhan/toolchain tidak tersedia.

**Spec:** `docs/superpowers/specs/2026-11-23-foundation-design.md`, disetujui pengguna dalam percakapan. Frasa status usulan pada spec merupakan status saat ditulis; persetujuan hanya mencakup fondasi ini.

## Global Constraints

- Pengembang bekerja dari Windows dan hanya memiliki iPhone, tanpa Mac.
- Target HP Android/iOS; pendamping Windows memakai WPF dan .NET 10 LTS.
- Tidak membuat repository baru. Branch lokal saat pemeriksaan: `master`; belum ada `origin/HEAD` lokal yang dapat diverifikasi.
- Pembaruan instruksi pengguna: kerja pada `development`, commit dan push ke `origin development` diizinkan. Jangan merge `master` sampai aplikasi selesai dan QA rilis lulus. Jangan mengunggah rahasia, signing, atau membeli layanan tanpa izin terpisah.
- Jangan mengubah PRD, screenshot referensi, atau pengaturan lokal pengguna.
- Tidak ada pairing, autentikasi jaringan, capture layar, clipboard, input OS, signing, CD, dan installer produksi pada tahap ini.
- SDK/dependensi dikunci; identifier sementara `dev.nomouse` untuk mobile dan namespace `NoMouse.Windows` untuk WPF bukan identifier distribusi final.
- Semua keterbatasan uji iOS dinyatakan; build simulator bukan uji iPhone fisik.

## Review Focus

1. Kondisi awal tidak memuat komputer/sesi contoh yang terlihat nyata; tes mobile harus memastikan status belum terhubung.
2. Teks diperbesar dan viewport sempit tidak menyebabkan overflow; tes widget menggunakan viewport sempit dan text scaling 2x.
3. CI memakai SDK yang sama dengan lokal; konfigurasi versi harus dibandingkan dengan lockfile/README saat review.
4. Workflow pull request tidak memiliki rahasia/signing, izin tulis, atau trigger berprivilege; pemeriksaan konfigurasi dilakukan sebelum selesai.
5. Ketidaktersediaan .NET 10, macOS, atau runner tidak disamarkan sebagai keberhasilan; README dan laporan membedakan terverifikasi lokal dari belum dijalankan.

---

### Task 1: Aplikasi mobile dasar

**Files:** `apps/mobile/` berisi scaffold Android/iOS resmi; ubah `lib/main.dart`, `test/widget_test.dart`, dan metadata aplikasi. Jangan membuat target web/desktop Flutter.

**Interfaces:** Menghasilkan `NoMouseApp` tanpa parameter wajib; belum mengonsumsi endpoint/protokol apa pun.

- [ ] Verifikasi Android SDK/JDK melalui `flutter doctor -v`; konfirmasi Flutter 3.47.5 tersedia untuk CI sebelum dipakai. Instalasi/unduhan mengikuti persetujuan tool.
- [ ] Buat scaffold `flutter create --platforms=android,ios --org dev.nomouse --project-name no_mouse apps/mobile`. Hapus contoh counter dan dependensi contoh yang tidak dipakai; pertahankan dependensi test/lint bawaan.
- [ ] Tulis tes widget sebelum pengganti UI: `NoMouseApp` menampilkan `No Mouse`, `Komputer Saya`, serta `Belum ada komputer terhubung.`; tidak ada counter atau status sesi aktif.
- [ ] Tambahkan skenario viewport 320×640 dan text scaling 2x; assert tidak ada exception layout. Jalankan `flutter test` dan amati kegagalan sebelum implementasi.
- [ ] Implementasikan satu tampilan awal memakai widget Flutter standar dan layout yang dapat scroll. Beri penjelasan `Pairing belum tersedia pada versi fondasi.` Tidak ada tombol yang berpura-pura dapat pairing atau izin kamera/jaringan tambahan.
- [ ] Jalankan `dart format --output=none --set-exit-if-changed lib test`, `flutter analyze`, `flutter test`, dan `flutter build apk --debug`. Catat kegagalan toolchain, jangan mengubah scope agar tampak lulus.

### Task 2: Pendamping Windows dasar

**Files:** `apps/windows/NoMouse.Windows.csproj`, scaffold WPF standar, `MainWindow.xaml`, `MainWindow.xaml.cs`, `global.json`, `.editorconfig`, dan `.gitignore` root.

**Interfaces:** Menghasilkan executable WPF `NoMouse.Windows`; tanpa port jaringan, API remote, atau state machine sesi.

- [ ] Verifikasi SDK .NET 10 yang dipilih dari sumber resmi. Jika perlu, instal secara lokal di folder tool pengguna melalui persetujuan tool, bukan ke repository; jangan mengunduh/mengeksekusi installer tanpa pemeriksaan asal.
- [ ] Kunci SDK dalam `global.json` dengan roll-forward dinonaktifkan. Buat `dotnet new wpf -n NoMouse.Windows -o apps/windows --framework net10.0` menggunakan SDK tersebut; gunakan TFM Windows yang dihasilkan template dan jangan menargetkan .NET 9 sebagai pengganti.
- [ ] Ganti jendela kosong dengan judul `No Mouse`, status `Belum ada sesi aktif.`, dan penjelasan `Pairing belum tersedia pada versi fondasi.` Gunakan kontrol/aksesibilitas WPF standar tanpa framework UI tambahan.
- [ ] Tambahkan ignore untuk build/cache Flutter/.NET, `.claude/`, secrets, keystore, provisioning dan signing. Jangan mengabaikan `pubspec.lock` atau file proyek platform iOS/Android yang diperlukan.
- [ ] Jalankan restore, `dotnet format apps/windows/NoMouse.Windows.csproj --verify-no-changes --no-restore`, dan build Release. Untuk scaffold tanpa logika produk, build dan pemeriksaan startup cukup; jangan membuat kelas/tes palsu demi menambah tes.
- [ ] Jalankan aplikasi Windows secara lokal untuk memeriksa startup serta teks status jika tool runtime tersedia; jika tidak, catat pemeriksaan runtime belum dilakukan.

### Task 3: CI dan petunjuk pengembangan

**Files:** `.github/workflows/ci.yml`, `README.md`. Gunakan satu workflow dengan job `mobile`, `windows`, dan `ios`.

**Interfaces:** Mengonsumsi versi terkunci dan perintah Task 1–2; tidak menghasilkan rilis publik.

- [ ] Verifikasi default branch dari metadata remote bila diizinkan. Jika tetap tidak dapat diverifikasi, gunakan trigger `push` tanpa filter branch dan `pull_request` tanpa filter, sehingga CI tetap bekerja di default branch tanpa tebakan `main`. Dokumentasikan pilihan ini.
- [ ] Job Linux: checkout, Flutter versi tepat, JDK yang kompatibel dengan template Android, restore, format/analyze/test, build APK debug. Gunakan `pubspec.lock` untuk dependency resolution terkunci.
- [ ] Job Windows: checkout, setup-dotnet memakai `global.json`, restore, format check, build Release. Jangan menambahkan job `dotnet test` tanpa test project nyata.
- [ ] Job macOS: checkout, Flutter versi tepat, catat Xcode yang dipakai, restore, `flutter build ios --simulator --debug --no-codesign`. Pilih image macOS/Xcode yang kompatibel setelah memeriksa persyaratan Flutter; jangan menyatakan lolos sebelum runner berjalan.
- [ ] Gunakan `permissions: contents: read`, timeout, concurrency yang membatalkan run lama pada ref yang sama, serta action resmi/terverifikasi yang dipin commit SHA. Jangan gunakan `pull_request_target`, signing, secret, deployment, atau upload artifact tanpa kebutuhan.
- [ ] README memuat versi SDK, struktur, perintah lokal, cara menjalankan kedua aplikasi, CI, batas fondasi, biaya/kuota runner, dan jalur iOS: Mac sementara atau signing/TestFlight setelah persetujuan. Nyatakan uji iPhone LAN belum dilakukan.
- [ ] Validasi YAML melalui parser yang sudah tersedia atau validator yang diperiksa; cocokkan setiap path, versi, trigger, izin, dan perintah dengan proyek. Bila tersedia, pakai actionlint; jangan menambahkan dependency aplikasi untuk validasi workflow.
- [ ] Ulangi pemeriksaan lokal yang relevan setelah perubahan, lalu minta satu review independen read-only atas diff. Perbaiki temuan penting dan jalankan ulang pemeriksaan terdampak.
- [ ] Laporkan daftar file/perubahan, hasil perintah, dan hal yang belum diverifikasi. Commit dan push hanya `development` sesuai instruksi pengguna terbaru; CI remote, build iOS, serta uji fisik tetap belum terbukti sampai benar-benar dijalankan. Jangan merge `master`.

## Handoff

Rekomendasi eksekusi: **Native**, implementasi inline oleh sesi ini lalu satu review independen; hanya tiga task fondasi dengan antarmuka sederhana. Tunggu review rencana dan pilihan cara eksekusi pengguna sesuai workflow sebelum membuat scaffold.
