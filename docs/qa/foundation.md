# QA Fondasi No Mouse

Pembaruan: 24 November 2026. Branch: `development`. Source fondasi: `c472014`; snapshot CI terbaru yang diperiksa: `21b10d9`.

## Kesimpulan

**CI tiga platform lulus. Build dan startup WPF lokal lulus. Build APK lokal masih gagal karena timeout unduhan artefak Flutter dari `storage.googleapis.com`. QA perangkat mobile nyata dan QA rilis produk belum dilakukan; jangan merge ke `master`.**

Fitur remote belum dibuat. Kelulusan fondasi tidak berarti pairing, keamanan sesi, kontrol OS, atau seluruh kebutuhan PRD sudah diuji.

## Bukti CI remote

Diperiksa melalui GitHub Actions API, termasuk status setiap job dan step. Tidak hanya mengandalkan status commit atau YAML yang valid.

| Run | Commit | Status |
|---|---|---|
| [45129526212](https://github.com/NunoRifa/no-mouse/actions/runs/45129526212) | `c472014d04a40d28436b02c9a7330ae69cb5788f` | Completed / success |
| [45132269694](https://github.com/NunoRifa/no-mouse/actions/runs/45132269694) | `21b10d9e1dfd7f097313c8e5690555882601c983` | Completed / success; seluruh job/step diperiksa |

Pada run `45132269694`:

- **Android and Flutter checks:** format, analisis, tes, dan build APK debug berhasil.
- **Windows build:** SDK setup, restore, format check, serta build Release berhasil.
- **iOS Simulator build:** Xcode version check, Flutter setup, dependency restore, dan build simulator tanpa signing berhasil pada runner macOS.

Run tersebut membuktikan kompatibilitas toolchain pada image runner yang dipakai. Versi Xcode tepat tidak dikutip karena isi log versi belum dibaca; jangan mengasumsikan semua versi Xcode didukung. Build simulator bukan runtime iPhone, signing, atau QA LAN.

## Bukti lokal

| Pemeriksaan | Hasil | Bukti / batas |
|---|---|---|
| Flutter widget RED | Teramati pada tahap awal | Dua tes gagal pada demo bawaan sebelum halaman kosong produk dibuat |
| Flutter widget GREEN | Lulus 2/2 pada fondasi | `flutter test --no-pub`: empty state jujur; viewport 320×640 dengan teks 2x tanpa exception; CI snapshot sama juga lulus |
| Format Dart / analisis Flutter | Lulus pada fondasi dan CI | Format 2 files, 0 changed; `flutter analyze --no-pub`: No issues found |
| Lisensi Android | Selesai dan dikonfirmasi toolchain | Pengguna menjalankan `flutter doctor --android-licenses`; pemeriksaan ulang `flutter doctor -v` menampilkan Android toolchain bertanda lulus, build-tools 36.0.0, dan `All Android licenses accepted.` Pemeriksaan doctor keseluruhan belum dijadikan bukti lulus semua platform |
| Build Android debug lokal | Gagal, blocker jaringan | `flutter build apk --debug --no-pub` gagal di `:app:mergeDebugAssets`: empat artefak engine `io.flutter` dari `storage.googleapis.com/download.flutter.io` mengalami `Read timed out`, termasuk retry bawaan Flutter. Pemeriksaan URL POM embedding memakai curl juga timeout setelah 25 detik tanpa data. Build-tools 36.0.0 berhasil dipasang; bukan kegagalan lisensi |
| SDK .NET 10.0.404 | Terpasang dan diverifikasi | Arsip resmi lengkap diverifikasi SHA-512 sebelum ekstraksi ke `%USERPROFILE%\.dotnet\no-mouse-10.0.404`; `dotnet --version` menghasilkan `10.0.404` |
| Restore WPF | Lulus | `dotnet restore apps/windows/NoMouse.Windows.csproj` menggunakan SDK lokal terkunci |
| Format WPF | Lulus | `dotnet format apps/windows/NoMouse.Windows.csproj --verify-no-changes --no-restore` exit 0 |
| Build WPF Release | Lulus | `dotnet build apps/windows/NoMouse.Windows.csproj --configuration Release --no-restore`: 0 warnings, 0 errors |
| Runtime WPF | Lulus pemeriksaan UI dasar | Aplikasi asli dijalankan memakai dotnet lokal; UI Automation menemukan `No Mouse`, `Belum ada sesi aktif.`, dan `Pairing belum tersedia pada versi fondasi.`; jendela ditutup melalui WindowPattern |
| YAML / XML / JSON | Lulus parse pada fondasi | Parser YAML bawaan `flutter_tools`, XML WPF/csproj, dan global.json; bukan pengganti CI |
| Review independen | Temuan penting diperbaiki sebelum push | Metadata tag Flutter pada checkout dangkal diperbaiki dengan fetch tag tepat dan verifikasi SHA; reproduksi RED/GREEN pada repository sementara |
| Runtime Android/iPhone dan LAN | Belum dilakukan | Belum ada signing/pemasangan iOS atau fitur remote; tidak diklaim lulus |

Checksum SDK yang terverifikasi:

```text
330ddd2665b43cd2e428216a0d8ea1ac7bb19b5434fdc530e62010dc3b52823a620bf95489d628e1ed6f5122401793ee4887cca4a019122361a1231497f632ee
```

SDK ditempatkan di folder pengguna, bukan repository, dan PATH mesin tidak diubah. Gunakan PATH sesi atau path dotnet lokal seperti dijelaskan README. Inisialisasi pertama SDK menampilkan pembuatan sertifikat pengembangan HTTPS; sertifikat tidak di-trust manual dan tidak diperlukan oleh aplikasi fondasi ini.

### Diagnosis yang sudah selesai

- Build Android awal gagal DNS Maven ketika mengunduh `kotlin-compiler-embeddable-2.2.21.jar`. Percobaan paralel kemudian timeout pada lock milik build pertama; tidak menghapus lock atau mematikan proses sembarang. Pemeriksaan lokal terbaru menerima HTTP 200 untuk URL JAR Maven yang sebelumnya gagal dan metadata repository Android Google. Ini membuktikan keterjangkauan endpoint saat diperiksa, bukan kelulusan build; hasil build lokal tetap dicatat terpisah.
- Unduhan .NET sebelumnya terputus/reset/timeout. Resume kini selesai dan checksum cocok; tidak menurunkan target ke .NET 9.
- `WaitForInputIdle` pada host `dotnet.exe` sempat gagal karena host tersebut bukan indikator GUI yang andal. Proses yang sama kemudian terbukti memiliki jendela `No Mouse`; pemeriksaan UI Automation dan penutupan jendela berhasil. Tidak mengubah kode aplikasi untuk menyembunyikan masalah alat uji.
- Instalasi actionlint eksternal tidak diizinkan saat tahap fondasi; tidak diakali. YAML diparse dengan dependency yang sudah ada dan workflow kini terbukti berjalan di GitHub.

### Diagnosis jaringan lanjutan — 24 November 2026

- Reproduksi GET dan HEAD pada URL POM engine yang gagal masih timeout 12–20 detik tanpa respons HTTP. `curl -v` menunjukkan resolusi IPv4, koneksi TCP 443, dan negosiasi TLS/ALPN selesai, lalu request terkirim tetapi tidak ada byte respons.
- Permintaan IPv4 eksplisit (`curl -4`) juga gagal; tidak ada bukti bahwa preferensi IPv6 merupakan akar masalah. Root host Storage juga timeout, sehingga bukan hanya satu artefak hilang.
- WinHTTP direct, user proxy tidak aktif, PAC tidak dikonfigurasi, dan tidak ada variabel proxy/Flutter storage aktif yang ditemukan. Tidak mengubah proxy, DNS, firewall, atau hosts.
- Query DNS standar dan query eksplisit ke resolver publik menghasilkan jawaban; alamat berubah antar pemeriksaan. Belum dapat dipastikan apakah masalah berasal dari jalur jaringan, intersepsi, atau layanan upstream; tidak mengklaim penyebab spesifik tanpa bukti.
- Host alias resmi Storage yang dicoba juga timeout atau gagal verifikasi nama sertifikat (`SEC_E_WRONG_PRINCIPAL`). Alias yang gagal validasi tidak dipakai; TLS tidak dinonaktifkan dan tidak memasang mirror pihak ketiga.
- Tidak mengulang build panjang karena endpoint prasyarat masih gagal. Untuk menyelesaikan build lokal dibutuhkan jalur internet yang dapat mengakses endpoint resmi, misalnya uji koneksi lain/hotspot yang diaktifkan pengguna. Kelulusan CI tidak diubah menjadi klaim kelulusan build lokal.

## Git dan izin

- Fondasi `c472014` dan TODO awal `21b10d9` telah dipush ke `origin/development`.
- Pengguna mengizinkan CI menjalankan sumber Flutter pada revision terkunci `6a19cca56475dbfba1478ee68d7bd0c2ef891da1`.
- `master` tetap branch rilis stabil; tidak di-merge. Aturan permanen ada di `CLAUDE.md`.
- Pembelian layanan, signing/store, dan perubahan scope tetap membutuhkan persetujuan terpisah.

## Tindak lanjut

1. Pulihkan akses lokal ke `storage.googleapis.com/download.flutter.io` melalui diagnosis koneksi/proxy yang disetujui pengguna, lalu ulangi build APK satu proses. Jangan mengganti mirror sembarang, menonaktifkan TLS, atau mengklaim CI hijau menyelesaikan blocker lokal. Ada peringatan SDK XML versi 3/4 pada log; evaluasi keselarasan command-line tools bila masih muncul setelah jaringan pulih, tanpa menganggapnya penyebab timeout.
2. Perbarui TODO berdasarkan bukti di atas; commit/push hanya `development`.
3. Siapkan akses Mac sementara atau jalur signing/TestFlight dengan persetujuan terpisah sebelum QA iPhone nyata.
4. Tutup keputusan produk dan implementasikan fitur melalui tahap berikutnya; tidak menyatakan produk selesai berdasarkan CI fondasi.
5. Setelah fitur lengkap, jalankan seluruh gate QA rilis PRD sebelum merge `master`.
