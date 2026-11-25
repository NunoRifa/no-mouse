# QA — Prototipe Browser Bridge

Tanggal: 25 November 2026. Branch: `development`. Scope: source/tests Chrome read-only dan native host user-mode. **Tidak ada extension/profil/registry dipasang atau diubah.**

## Bukti lokal

| Pemeriksaan | Hasil |
|---|---|
| Build native host Release .NET 10.0.404 | Lulus, 0 warning / 0 error |
| Format C# verify-no-changes | Lulus |
| Publish apphost win-x64 framework-dependent | Lulus ke direktori build yang diabaikan Git; bukan instalasi/rilis |
| Host child-process stdio checks | 11/11 lulus setelah RED karena host belum tersedia; frame rusak/oversize menghasilkan error enum, bukan stack trace |
| Extension state dan worker fixtures | 13/13 lulus; tes state awal RED sebelum module tersedia |
| Regresi late native-port message | RED: port lama membuat koneksi baru terputus; GREEN setelah callback port lama diabaikan |
| Regresi injection/document mismatch | RED: dokumen hasil injeksi berbeda masih terdaftar; GREEN setelah enrollment menunggu hasil documentId dan mencocokkannya dengan sender browser |
| Review independen dan regresi tambahan | Dua temuan lifecycle diverifikasi RED/GREEN: navigasi saat permission check tertunda tidak boleh mendaftarkan dokumen pengganti; snapshot host yang masih in-flight setelah target lokal dihapus tidak boleh memutus target lain. Ticket dibuat sebelum await, popup memantau navigasi selama grant, dan respons divalidasi terhadap state saat request dikirim tanpa memulihkan target yang dilepas |
| JS syntax worker/popup/content | Lulus `node --check` |
| CI tambahan | Job checks extension Node 22.20.0 serta host checks pada Windows disusun; hasil run remote baru belum diverifikasi |
| Browser aktual/permission/native messaging | **Belum diuji**; membutuhkan persetujuan profil uji, ID extension, binary/config path dan registrasi HKCU yang nyata |
| Playback/queue, HP/LAN, Edge/Firefox, lock screen | Di luar prototipe ini dan tidak dinyatakan lulus |

Tes host menggunakan Node stdlib dan menjalankan DLL C# asli melalui binary framing independen; bukan console test framework C# terpisah. Semua test process berjalan lokal, tanpa koneksi media atau input OS.

## Batas dan keputusan implementasi

- Prototipe terpisah di `prototypes/browser-bridge`; tidak terhubung ke aplikasi WPF/mobile atau kredensial pairing.
- Source asli tidak terdaftar pada browser. Manifest hanya meminta nativeMessaging/storage/scripting dan optional YouTube origin; tidak all-sites, tabs luas, cookies, history, debugger, atau incognito.
- Max frame 64 KiB, 50 target, depth JSON 8, maksimum 4.096 request per koneksi dan request ID tidak replay. Koneksi extension dibatasi lebih awal sebelum 4.000 request; lalu perlu connect/enrollment ulang. Batas ini deliberate prototype ceiling, bukan kapasitas produk final.
- ID enrollment sudah dipensiunkan tidak dipakai ulang pada epoch yang sama; dokumen diganti harus enrollment baru. Browser documentId digunakan sebagai bukti injeksi yang cocok, nonce adapter sebagai generasi.
- Content adapter mengamati perubahan lokasi lokal setiap 250 ms dan pagehide; URL tidak dikirim/logged. Invalidation SPA tidak diklaim sinkron nol ms; tidak ada transport command yang dapat dieksekusi pada celah tersebut.
- Native host memakai allowlist file tepat yang belum dibuat/diinstal untuk browser; `--stdio-check` hanya harness lokal dan tidak memberikan privilege. Tidak menjamin perlindungan terhadap malware akun Windows yang sama.
- SDK lokal .NET digunakan melalui PATH sesi; runtime pencarian apphost dari browser tetap harus diverifikasi sebelum registrasi. Tidak mengubah PATH mesin.

## Checklist uji manual berikutnya — belum dijalankan

- [ ] Izin pemasangan spesifik dan path/ID nyata disetujui; existing registry entry diperiksa, tidak overwrite.
- [ ] Profil Chrome uji terpisah tanpa sign-in/sync; izin origin diberikan lewat klik, penolakan/revoke bekerja.
- [ ] Dua tab YouTube terdaftar menjadi dua target berbeda; perubahan fokus/playing/paused tidak mengubah identitas.
- [ ] Tab tutup/reload/navigation/SPA/discard menghapus target lama; callback tertunda tak mendaftarkan dokumen baru.
- [ ] Worker/host/browser restart membutuhkan connect dan enrollment ulang; pesan/handle lama tidak dipakai.
- [ ] Revoke permission menghentikan adapter dan mengosongkan daftar.
- [ ] Tidak ada payload judul/URL/cookie/password, socket, command playback atau elevasi.
- [ ] Host terputus tampak jelas; daftar target tidak tampil seolah aktif.
- [ ] Cleanup terverifikasi hanya terhadap key/config/profile uji yang dibuat.

Source/tests dapat lulus sebelum uji manual ini; itu **bukan bukti native messaging Chrome end-to-end atau produk siap rilis**. `master` tidak di-merge.
