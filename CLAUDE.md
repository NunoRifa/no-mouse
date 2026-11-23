# No Mouse — aturan proyek

## Workflow Git (instruksi pemilik proyek)

- Baca file ini saat memulai sesi sebelum mengubah proyek.
- Seluruh pengembangan aplikasi dilakukan pada branch `development`, bukan `master`.
- Commit perubahan yang relevan dan sudah diperiksa, lalu push ke `origin development`. Pemilik proyek mengizinkan commit/push rutin ke branch ini selama pengembangan.
- Jangan commit/push rahasia, `.claude/settings.local.json`, signing key, provisioning profile, token, atau hasil build.
- Jangan menimpa perubahan pengguna, force-push, atau menghapus branch tanpa izin.
- `master` adalah branch rilis stabil. Merge `development` ke `master` hanya setelah aplikasi selesai dan QA rilis lulus dengan bukti terdokumentasi.
- Fondasi yang berhasil dibangun bukan aplikasi selesai. CI hijau bukan pengganti QA perangkat nyata, keamanan, atau seluruh gate rilis PRD.
- Jika QA masih terblokir, gagal, atau belum dijalankan, jangan merge ke `master`. Laporkan blocker dan lanjutkan pada `development`.
- Instruksi sesi terbaru dari pemilik proyek dapat memperbarui aturan ini; catat perubahan aturan pada file ini.

## Cakupan dan verifikasi

- Produk: Android/iOS mengontrol Windows melalui LAN. Lihat `PRD.md` untuk kebutuhan dan batas.
- Fondasi disetujui pada `docs/superpowers/specs/2026-11-23-foundation-design.md`; rencana pada `docs/superpowers/plans/2026-11-23-foundation.md`.
- Stack fondasi: Flutter untuk mobile, C#/.NET 10 LTS WPF untuk Windows, GitHub Actions untuk CI tanpa signing/deploy.
- Pengembang hanya memiliki iPhone dan PC Windows. Build iOS simulator di macOS CI tidak membuktikan runtime iPhone atau koneksi LAN fisik.
- Jangan menyatakan build, CI, atau QA lulus jika belum benar-benar dijalankan. Simpan hasil dan batas verifikasi dalam laporan QA.
- Pembelian layanan, signing/store, dan pengiriman data/rahasia baru tetap membutuhkan izin terpisah.
