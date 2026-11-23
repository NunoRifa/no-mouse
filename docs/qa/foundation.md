# QA Fondasi No Mouse

Tanggal: 23 November 2026. Branch: `development`.

## Kesimpulan

**Belum lulus QA fondasi menyeluruh dan belum memenuhi QA rilis produk. Jangan merge ke `master`.** Kode dasar mobile/Windows dan workflow tersedia, tetapi Android, Windows, iOS, dan CI remote masih memiliki pemeriksaan yang terblokir/belum berjalan.

## Bukti aktual

| Pemeriksaan | Hasil | Bukti / batas |
|---|---|---|
| Flutter widget RED | Teramati | Dua tes gagal pada demo bawaan karena halaman kosong produk belum tersedia |
| Flutter widget GREEN | Lulus 2/2 | `flutter test --no-pub`: empty state jujur; viewport 320×640 dengan teks 2x tanpa exception |
| Format Dart | Lulus | `dart format --output=none --set-exit-if-changed lib test`: 2 files, 0 changed |
| Analisis Flutter | Lulus | `flutter analyze --no-pub`: No issues found |
| Build Android debug | Gagal, blocker lingkungan | Unduh `kotlin-compiler-embeddable-2.2.21.jar` gagal: `No such host is known (repo.maven.apache.org)` |
| Percobaan Android paralel | Gagal, konflik build | Timeout `buildLogic.lock` karena build pertama masih aktif; tidak menghapus lock atau menghentikan proses sembarang |
| Lisensi Android | Perlu keputusan pengguna | `flutter doctor -v` menyatakan beberapa lisensi belum diterima; tidak menerima ketentuan legal atas nama pengguna |
| .NET 10.0.404 | Instalasi terblokir | Unduhan resmi terputus `WinError 10054`; resume timeout. Arsip parsial belum diekstrak/dijalankan; checksum wajib diverifikasi sebelum dipakai |
| WPF XML / csproj / global.json | Lulus pemeriksaan sintaks | XML dan JSON dapat diparse; bukan bukti kompilasi WPF |
| Build/format/runtime WPF | Belum dijalankan | SDK terpasang hanya 9.0.313, proyek sengaja tetap menargetkan .NET 10 |
| YAML workflow dan pubspec | Lulus parse | Parser YAML bawaan dependensi `flutter_tools` dipakai tanpa menambah dependency aplikasi |
| Validasi actionlint | Tidak dijalankan | Instalasi validator eksternal tidak diizinkan; tidak mengakali pembatasan. Parse YAML bukan validasi penuh Actions |
| Review independen | Satu temuan penting diperbaiki | Checkout Flutter SHA dangkal tidak memiliki tag versi; tambahkan fetch tag 3.47.5 dan verifikasi SHA |
| Regresi tag Flutter | RED lalu GREEN | Repository sementara tanpa tag membuktikan masalah; fetch tag tepat memulihkan `3.47.5` pada SHA terkunci |
| Commit/push development | Eksekusi diizinkan pengguna | Penolakan awal terkait sumber Flutter sudah dijawab dengan izin eksplisit pengguna untuk revision terkunci `6a19cca56475dbfba1478ee68d7bd0c2ef891da1`. Commit/push dilanjutkan pada `development`; hasil Git dan CI harus diverifikasi terpisah |
| CI GitHub | Belum diverifikasi | Workflow baru belum dipush/dijalankan; jangan mengklaim hijau |
| Build iOS Simulator | Belum dijalankan | Tidak ada Mac lokal; job macOS CI belum terbukti |
| Runtime Android/iPhone dan LAN | Belum dijalankan | Hanya iPhone tersedia; belum ada signing/pemasangan iOS atau fitur remote |

## Tindak lanjut

1. Pulihkan akses DNS/jaringan Maven, periksa dan putuskan lisensi Android melalui `flutter doctor --android-licenses`, lalu jalankan ulang build Android tanpa build paralel.
2. Lengkapi unduhan SDK .NET 10.0.404 dari sumber resmi, verifikasi SHA-512 terhadap metadata, lalu jalankan restore, format, build Release, dan startup Windows.
3. Setelah push `development`, periksa ketiga job CI. Jangan menganggap pengiriman commit sama dengan workflow berhasil.
4. Siapkan akses Mac sementara atau signing/TestFlight dengan persetujuan terpisah sebelum QA iPhone nyata.
5. Setelah fitur produk selesai, jalankan seluruh gate rilis dalam PRD. Keberhasilan fondasi bukan izin merge rilis.

## Keputusan dan batas verifikasi

- Workspace tetap checkout utama pada branch `development` sesuai instruksi pengguna. Sesi paralel harus berkoordinasi; tidak bekerja pada `master`.
- Instruksi terbaru mengizinkan commit/push `development`, menggantikan larangan awal rencana. `master` tidak di-merge.
- Default remote diverifikasi sebagai `master`; CI dipicu push/pull request pada `development` dan `master`.
- Index/arsip Flutter resmi yang dicoba mengembalikan HTTP 404, sedangkan tag Git 3.47.5 cocok dengan SDK lokal. CI menggunakan source SHA terkunci dan fetch tag tepat, dengan verifikasi identitas. Unduhan engine/kompatibilitas runner tetap harus dibuktikan lewat CI.
- WPF minimal ditulis langsung memakai format SDK standar karena unduhan .NET belum selesai. Tidak ada abstraksi/logika tambahan untuk sekadar memenuhi tes; kompilasi masih harus dibuktikan.

## Temuan minor

Reviewer menunjukkan tautan laporan QA belum tersedia saat review; dokumen ini merupakan hasil QA yang memang diminta rencana dan melengkapi tautan tersebut. Tidak ada minor lain yang dilaporkan.
