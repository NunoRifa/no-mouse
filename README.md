# No Mouse

Fondasi aplikasi Android/iOS untuk mengontrol Windows melalui LAN. **Fitur remote belum dibuat:** belum ada pairing, listener jaringan, input komputer, capture layar, clipboard, atau kontrol daya.

Kebutuhan produk: [PRD.md](PRD.md). Aturan kerja lintas sesi: [CLAUDE.md](CLAUDE.md).

## Struktur

```text
apps/mobile/       Flutter Android dan iOS
apps/windows/      C# WPF Windows
.github/workflows/ CI tanpa signing atau deployment
docs/              Desain, rencana, dan hasil QA
```

## Toolchain

- Flutter **3.47.5**, revision `6a19cca56475dbfba1478ee68d7bd0c2ef891da1`, beserta Dart bawaannya **3.13.4**.
- .NET SDK **10.0.404**, dikunci di `global.json`; WPF berjalan pada Windows.
- JDK **17**, Android SDK dan lisensi platform/build tools yang dibutuhkan template Flutter. Persetujuan lisensi dilakukan oleh pengembang.
- Untuk iOS: macOS dan Xcode yang kompatibel; tidak dapat build iOS secara lokal dari Windows.

CI mengambil Flutter dari revision Git yang sama, bukan versi `stable` mengambang. Dependensi Dart dikunci melalui `apps/mobile/pubspec.lock`. SDK .NET dipasang terpisah bila hanya .NET 9 yang tersedia; jangan mengganti target menjadi .NET 9 agar build tampak berhasil.

Identifier `dev.nomouse.no_mouse`/`dev.nomouse.noMouse` adalah identifier pengembangan hasil template, bukan keputusan identifier distribusi. Pastikan nilai final di proyek platform sebelum provisioning atau rilis. Ikon bawaan Flutter masih placeholder pengembangan, bukan aset rilis.

## Mobile: pemeriksaan dan menjalankan

Jalankan dari root repository:

```powershell
Push-Location apps/mobile
flutter pub get --enforce-lockfile
dart format --output=none --set-exit-if-changed lib test
flutter analyze --no-pub
flutter test --no-pub
flutter build apk --debug --no-pub
flutter run -d <android-device-id>
Pop-Location
```

`<android-device-id>` diperoleh melalui `flutter devices`. Belum ada Android fisik yang diasumsikan tersedia. Halaman awal menampilkan daftar komputer kosong dan menyatakan pairing belum tersedia.

Jika `flutter doctor -v` melaporkan lisensi Android belum diterima, baca dan putuskan sendiri lewat:

```powershell
flutter doctor --android-licenses
```

Jangan menjalankan dua build Gradle pada proyek yang sama bersamaan. Error unduh Maven/DNS tidak membuktikan bug aplikasi; periksa koneksi tanpa menonaktifkan pemeriksaan TLS atau mengganti sumber paket sembarang.

## Windows: pemeriksaan dan menjalankan

Dengan SDK yang sesuai `global.json` tersedia pada PATH:

```powershell
dotnet --version
dotnet restore apps/windows/NoMouse.Windows.csproj
dotnet format apps/windows/NoMouse.Windows.csproj --verify-no-changes --no-restore
dotnet build apps/windows/NoMouse.Windows.csproj --configuration Release --no-restore
dotnet run --project apps/windows/NoMouse.Windows.csproj --configuration Release --no-build
```

SDK lokal khusus, jika dipasang pada mesin pengembangan ini, berada di `%USERPROFILE%\.dotnet\no-mouse-10.0.404`. Tambahkan direktori tersebut ke PATH sesi atau panggil `dotnet.exe` dari sana; jangan commit SDK ke repository. Pengguna lain cukup memasang SDK yang ditetapkan `global.json` dari sumber resmi.

Pendamping hanya menampilkan status belum ada sesi. Tidak membutuhkan Visual Studio workload Flutter Windows/C++ karena pendamping menggunakan WPF, bukan Flutter desktop.

## iOS saat hanya memiliki iPhone dan PC Windows

CI macOS menjalankan:

```sh
cd apps/mobile
flutter pub get --enforce-lockfile
flutter build ios --simulator --debug --no-codesign --no-pub
```

**Build simulator hanya memeriksa kompilasi.** Tidak memasang aplikasi pada iPhone dan tidak membuktikan izin kamera, jaringan lokal, keyboard, atau koneksi LAN ke Windows.

Pilihan uji perangkat nyata:

1. Akses sementara Mac dengan Xcode yang kompatibel; gunakan akun Apple pribadi untuk provisioning pengujian sesuai batas Apple, lalu jalankan pada iPhone.
2. Alternatif: build bertanda tangan pada Mac/layanan macOS dan distribusi TestFlight. Jalur ini memerlukan Apple Developer Program, signing, serta persetujuan biaya/pengelolaan kredensial terpisah.

Untuk pengujian remote kelak, iPhone dan Windows harus berada di LAN yang saling terjangkau. Jangan menghubungkan runner publik ke jaringan pribadi. Tidak ada signing, akun Apple, atau layanan berbayar yang disiapkan oleh fondasi ini.

## CI dan branch

- Pengembangan, commit, dan push menggunakan **`development`**.
- Push `development`/`master` serta pull request menuju keduanya menjalankan CI; workflow juga dapat dipicu manual.
- Linux: format, analisis, tes widget, build APK debug.
- Windows: restore, format check, build WPF Release. Belum ada test project .NET karena belum ada logika produk; build bukan pengganti tes fitur nanti.
- macOS: build iOS Simulator tanpa signing, mencatat versi Xcode yang dipakai runner.
- Job memakai izin `contents: read`, checkout tanpa kredensial tersimpan, timeout, dan pembatalan run lama per ref. Tidak ada deploy, signing, kredensial rilis, atau publikasi paket.
- Runner/kuota GitHub mengikuti visibilitas repository dan paket akun. Push dapat memicu penggunaan runner, termasuk macOS; periksa budget/kuota di pengaturan GitHub. Tidak ada layanan eksternal berbayar yang dibeli oleh proyek.
- Jangan merge ke **`master`** sampai aplikasi selesai dan QA rilis lulus. CI fondasi hijau tidak berarti produk siap rilis.

## Status verifikasi

Lihat [laporan QA fondasi](docs/qa/foundation.md) untuk hasil aktual, kegagalan, dan blocker. Jangan menganggap CI remote, build iOS, atau uji iPhone lulus sebelum ada bukti run terkait.
