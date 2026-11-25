# Studi Kompatibilitas Media dan Browser

Tanggal: 25 November 2026. Status: **riset dokumentasi dan probe API lokal baca-saja selesai; kompatibilitas No Mouse per layanan/browser belum diuji**.

Acuan: [PRD.md](../../PRD.md), FR-07, SEC-06/09. Tidak membuat ekstensi, meminta host permission, memasang software, menjalankan browser automation, atau mengirim identitas proyek ke riset eksternal.

## 1. Ringkasan temuan

Windows menyediakan sesi media sistem melalui Global System Media Transport Controls (GSMTC). API dapat mendaftar sesi, memberi `SourceAppUserModelId`, metadata media dan playback info, serta mengirim perintah transport seperti play/pause/stop/next/previous. Capability controls menunjukkan perintah yang dilaporkan tersedia.

**Batas penting:** API ini tidak membuktikan bahwa satu sesi selalu sama dengan satu tab browser, bahwa queue situs tersedia, atau bahwa layanan tertentu merespons perintah. `TryStopAsync` hanya mengirim permintaan pada media session; itu bukan aksi *tutup aplikasi*, *tutup tab*, atau jaminan musik berhenti. Menerima `true`/request diterima pun tidak membuktikan hasil playback sudah berubah.

Media Session API web memungkinkan **situs** mendaftarkan handler sendiri untuk play/pause/stop/previous/next. Tidak ada aksi standar “show queue/open queue”; situs harus mengimplementasikan UI/aksi queue sendiri. API tersebut bukan antarmuka desktop arbitrer untuk memilih dan mengendalikan semua tab browser.

Karena target HP memilih media secara eksplisit dan mempertahankan target selama sesi, API “current session” Windows saja tidak cukup sebagai identitas pilihan: current session berarti sesi yang dianggap paling mungkin ingin dikontrol pengguna, dan dapat berubah. Implementasi perlu memetakan pilihan yang terlihat ke identitas sesi/sumber stabil, memverifikasi sebelum setiap aksi, dan tidak mengalihkan otomatis.

## 2. Bukti penggunaan yang dilaporkan pengguna

Ini riwayat penggunaan aplikasi referensi, bukan pengujian No Mouse:

| Aplikasi/layanan | Queue pada aplikasi referensi | Stop pada aplikasi referensi | No Mouse teruji? |
|---|---|---|---|
| YouTube via Chrome | Berhasil; queue muncul di aplikasi pemutar pada PC | Belum dikonfirmasi | Tidak |
| YouTube Music via Chrome | Berhasil; queue muncul di aplikasi pemutar pada PC | Belum dikonfirmasi | Tidak |
| Spotify via Chrome | Berhasil; queue muncul di aplikasi pemutar pada PC | Belum dikonfirmasi | Tidak |
| Spotify desktop | Berhasil; queue muncul di aplikasi pemutar pada PC | Belum dikonfirmasi | Tidak |
| Netflix via browser (Chrome/Edge/Firefox) | Belum dikonfirmasi | Belum dikonfirmasi | Tidak |

Target browser rilis: Chrome, Edge, Firefox. Layanan yang disebut untuk validasi: Netflix, YouTube, YouTube Music, Spotify web serta Spotify desktop. Jangan mengubah laporan aplikasi referensi menjadi klaim bahwa sistem Windows/No Mouse memberi capability yang sama.

## 3. Kemampuan dan batas resmi

### Windows GSMTC

`GlobalSystemMediaTransportControlsSessionManager` dapat mengembalikan seluruh sesi yang terekspos sistem (`GetSessions`) dan current session. Current session didefinisikan sebagai sesi yang menurut sistem kemungkinan besar ingin dikontrol pengguna; event `CurrentSessionChanged` dan `SessionsChanged` tersedia.

Sesi media memuat `SourceAppUserModelId`, playback info, timeline, metadata, event perubahan, dan perintah `TryPlayAsync`, `TryPauseAsync`, `TryTogglePlayPauseAsync`, `TryStopAsync`, `TrySkipNextAsync`, serta `TrySkipPreviousAsync`. Capability flags seperti `IsStopEnabled`, `IsNextEnabled` dan `IsPreviousEnabled` menunjukkan apakah sesi *melaporkan* capability. API dirilis sejak Windows 10 version 19 dan meminta app capability `globalMediaControl` menurut dokumentasi API yang dirujuk. Persyaratan paket/manifest dan availability pada WPF Win32 perlu dibuktikan untuk baseline Windows 11 proyek.

Kegagalan/ketidakmampuan harus tetap dihadapi: sesi bisa hilang, ID/sumber dapat ambigu, capability berubah, request ditolak/tidak tercapai, dan API tidak menyediakan dukungan eksplisit untuk membuka queue milik aplikasi.

### Media Session API pada web

Situs bisa memasang handler untuk `play`, `pause`, `stop`, `previoustrack`, `nexttrack`, serta aksi lain yang didukung browser. Dukungan web bersifat bervariasi. Tidak ada aksi standar `showqueue`/`openqueue`. Browser akan mengirim aksi ke handler situs jika situs memasangnya; ini tidak menjanjikan semua situs memetakan aksi, atau bahwa ekstensi umum dapat memaksa situs menampilkan queue.

### Ekstensi browser / native messaging

Dokumentasi Chrome menerangkan native messaging antara extension dan aplikasi desktop host. Extension mengidentifikasi host, host mengizinkan ID ekstensi tertentu (`allowed_origins`), extension meminta permission `nativeMessaging`, dan installer mendaftarkan manifest host.

Itu memungkinkan jembatan extension–desktop, **bukan izin luas untuk membaca semua tab**. Konten tab bergantung permission seperti `activeTab`, `tabs`, atau host permission; `activeTab` bersifat sementara setelah tindakan pengguna. `tabs`/host permissions dapat membuka judul/URL sensitif. Edge dan Firefox memiliki deployment/API/distribusi masing-masing; kompatibilitas tidak otomatis mengikuti Chrome.

## 4. Kesimpulan desain sementara

1. **Utamakan sesi media sistem yang dipilih eksplisit.** Panel HP harus menampilkan sumber/nama media yang dapat dibedakan dan pilihan target; jangan mengandalkan current session diam-diam.
2. **Batas kontrak fitur harus mengikuti bukti yang tersedia.** GSMTC menyediakan source aplikasi, playback state dan flags `IsPlayEnabled`/`IsPauseEnabled`/`IsStopEnabled`/`IsNextEnabled`/`IsPreviousEnabled`; flags ini sinyal capability yang dilaporkan sesi, bukan jaminan operasi berhasil. `Try*Async` mengirim request; amati playback state sesudahnya dan jangan menampilkan sukses hanya karena request dikirim.
3. **Aksi queue bukan bagian dari API transport umum.** Windows GSMTC dan web Media Session tidak menyediakan aksi standar untuk membuka queue. Queue yang terlihat melalui pemutar di PC adalah observasi pengguna pada aplikasi referensi, bukan jaminan tombol universal untuk setiap layanan/browser. Jangan menggantinya diam-diam dengan stop, tutup tab, atau navigation.
4. **Target tab tetap harus nyata dan stabil.** `SourceAppUserModelId` dapat mengidentifikasi browser saja, bukan tab. Jika dua tab menghasilkan sesi tanpa identitas pembeda stabil, jangan mengaku target per tab: tampilkan pilihan yang dapat dibuktikan atau tandai target ambigu dan nonaktifkan aksi.
5. **Capability mengikuti target terpilih.** Tombol unsupported dinonaktifkan dengan alasan; unknown tetap berlabel belum diverifikasi; timeout/penolakan pada target yang sebelumnya didukung ditangani sebagai error sementara. Jangan pernah fallback ke current session otomatis.
6. **Ekstensi bukan shortcut gratis.** Native messaging mengikat host ke ekstensi yang di-allowlist; akses tab ditentukan permission. Ekstensi membutuhkan paket, update, deklarasi izin dan uji terpisah untuk Chrome, Edge, Firefox. Jangan meminta izin semua situs kecuali ada kebutuhan yang terverifikasi.
7. **Volume mengikuti keputusan PRD.** Volume HP mengubah volume Windows keseluruhan; jangan menurunkan/menaikkan volume site atau tab media terpilih.

### Inventaris sinyal yang boleh ditampilkan

| Data/hasil | Makna yang aman ditampilkan | Jangan disimpulkan |
|---|---|---|
| `SourceAppUserModelId` | Nama app/sumber Windows yang teridentifikasi | Identitas tab atau layanan web spesifik bila tak didukung bukti |
| Metadata sesi | Informasi yang diekspos session API, setelah privacy filtering | Konten queue atau daftar browsing lengkap |
| Capability flag true | Sesi melaporkan command enabled saat diperiksa | Perintah pasti berhasil/hasil sudah berubah |
| `Try*Async` accepted | Request dikirim/diterima oleh lapisan API | Playback pasti berubah atau queue terbuka |
| Tidak ada sesi/capability false | Target tersedia tanpa aksi itu, sesuai status terbaru | Error jaringan atau unsupported permanen tanpa klasifikasi yang benar |
| Request timeout/disconnect | Hasil belum diketahui | Boleh retry otomatis atau alihkan target |

### Desain pembeda status target

- **Didukung saat ini:** target terverifikasi dan melaporkan capability; tombol aktif, hasil tetap diverifikasi setelah aksi.
- **Tidak didukung:** capability diketahui tidak tersedia pada target; tombol nonaktif dengan keterangan jelas.
- **Belum diverifikasi / ambigu:** identitas target atau capability tidak memadai; jangan tawarkan tombol aktif.
- **Sementara gagal:** target pernah dikenali tetapi saat ini terputus/timeout; tampilkan error dan pemulihan eksplisit.

Jangan mencatat URL lengkap, judul sensitif, cookie, atau history dalam log; nama layanan/metadata minimum yang terlihat kepada pengguna juga harus dihentikan saat Windows terkunci sesuai PRD.
## 5. Matriks kelayakan (belum diuji pada No Mouse)

| Skenario | Hipotesis API/behavior | Bukti yang harus dicari | Status |
|---|---|---|---|
| Enumerasi dua tab Chrome yang masing-masing memutar media | GSMTC dapat memperlihatkan sesi yang diterbitkan; `SourceAppUserModelId` mungkin sama karena satu browser | Dua tab aktif, metadata berbeda, pilihan tetap stabil saat tab lain mulai/berhenti, tidak tertukar sesudah reconnect | Belum diketahui |
| Pilih Spotify desktop dibanding Spotify web | App ID dapat membedakan app native dan browser dalam sebagian kasus | Enumerasi aktual dan pemetaan stabil; akun/sesi yang sama tidak disamakan | Belum diuji |
| Play/pause/previous/next | Capability flag dan Try* request bisa menjadi sinyal awal | Uji status sebelum/sesudah, target tidak berubah, hasil kegagalan/timeout, tiap browser+service | Belum diuji |
| Stop | API punya TryStop dan IsStopEnabled pada session | Apakah setiap service melaporkan serta menjalankan stop dengan semantik yang dimaksud | Belum diketahui per layanan |
| Queue di YouTube/YT Music/Spotify web dan Spotify desktop | Pengalaman referensi menunjukkan queue dibuka oleh pemutar; GSMTC tidak menyediakan showqueue | Identifikasi jalur OS/browser yang terpasang tanpa akses tidak didukung; jangan kirim input ke tab salah | Belum dibuktikan di No Mouse |
| Queue pada Netflix | Pengguna belum mengonfirmasi referensi | Uji manual dengan aplikasi referensi atau dokumentasikan tidak mendukung | Belum diketahui |
| Netflix via Chrome/Edge/Firefox | DRM/privacy mungkin membatasi metadata/frame, tapi dukungan transport tidak boleh ditebak | Setiap browser, login normal, full-screen, tab tidak fokus; tanpa mencoba bypass DRM | Belum diuji |
| Edge dan Firefox | Pemisahan multi-tab serta dukungan media berbeda antar browser | Capability/target dan versi stabil aktual masing-masing | Belum diuji |
| Browser restart/crash/target tab tutup | ID sesi/tab dapat berubah/hilang | Target lama ditandai unavailable; tidak fallback ke sesi lain | Belum diuji |
| Windows lock/unlock | Panel media dinonaktifkan saat locked; sesi trusted login tetap aktif | Tidak ada enumerasi metadata atau kontrol saat locked; unlock tidak memilih target/menyambung layar diam-diam | Belum diuji |
| Volume | FR-07 menetapkan volume Windows keseluruhan | Pastikan perintah volume tidak bergantung target browser dan tetap nonaktif saat locked | Belum diuji |

## 6. Kandidat pendekatan

| Kandidat | Trade-off | Rekomendasi |
|---|---|---|
| **A — Windows GSMTC saja sebagai dasar**, tanpa extension | Paling sedikit privilege dan permukaan browser. Bisa memilih sesi sistem dan mencoba transport; tak menjamin per-tab ketika source app sama, queue atau semua service | **Mulai dari sini untuk feasibility spike.** API resmi punya metadata, perintah serta capability flags. Hentikan klaim per-target bila identitas tab tak cukup |
| B — Per-browser extension + native messaging ke Windows | Potensi pemilihan tab aktif/metadata situs lebih presisi; tiga browser harus dipelihara/dipaketkan, permission sensitif dan store review bertambah; queue tetap perlu API situs atau UI aksi yang legal/stabil | Pertimbangkan hanya jika A gagal memenuhi target dan hasil akses minimal layak. Tidak disetujui untuk dibuat sekarang |
| C — Simulasi shortcut/klik global atau koordinat untuk semua layanan | Tampak cepat, tetapi fokus tab mudah berubah, target salah, koordinat/DPI salah, hasil tak dapat diverifikasi, berisiko membuka tindakan salah dan bergantung layout/DRM | Tolak sebagai dasar generik produk; jangan gunakan untuk menutupi ketiadaan capability |

**Rekomendasi kerja:** spike lokal baca-saja GSMTC, inventaris sesi/capability dan metadata terlebih dahulu; setelah itu uji satu perintah transport pada target terpilih di mesin uji dan verifikasi state. Queue diteliti terpisah karena bukan perintah standar GSMTC/Media Session. Tidak ada kode/ekstensi terpasang pada tahap dokumentasi ini.

## 7. Keamanan, privasi, dan UX konsekuensi

- Nama media, judul tab, URL, dan metadata dapat mengungkap aktivitas pribadi. Jangan log/telemetry; hanya kirim informasi minimum yang diperlukan untuk pemilih target, selama Windows unlocked dan target diizinkan.
- `SourceAppUserModelId` mengidentifikasi aplikasi, belum tentu tab. Jangan tampilkan dua tab seolah dapat dibedakan jika API tidak memberi identitas cukup.
- Semua kontrol dicek di Windows pula. UI HP bukan batas keamanan; saat locked, tolak media/browser volume actions sesuai keputusan PRD.
- Target yang dihapus, capability berubah atau sumber ambigu: disable aksi dan jelaskan. Jangan fallback ke current session.
- Membuka queue di komputer dapat mengubah fokus/menampilkan konten, bukan mengirim queue sebagai daftar HP. Preview layar tetap opt-in; aksi queue tak boleh otomatis mengaktifkan screen capture.
- Perintah stop menghentikan playback jika didukung; tidak menutup app/tab, menghapus antrean, atau menghentikan layanan OS tanpa persetujuan/keputusan produk.
- Browser extension, jika dipilih kelak, mendapat permission minimum dan tidak membawa cookie/password atau membaca situs yang tidak dipilih pengguna.

## 8. Rencana uji yang perlu disetujui sebelum spike

### Tahap 0 — observasi aplikasi referensi (tanpa mengubah konfigurasi)

- Catat browser dan versi, nama aplikasi pemutar, target yang sedang bermain, serta hasil queue/stop/prev/next/play/pause.
- Target dari laporan pengguna: YouTube, YouTube Music, Spotify Chrome, Spotify desktop. Tambah Netflix sebagai belum dikonfirmasi.
- Tidak merekam/mengirim password, cookie, daftar situs, atau data akun. Catat hanya perilaku tombol dan state yang perlu.

### Tahap 1 — enumerasi GSMTC read-only

- Windows 11 x64 test environment, akun non-admin standar untuk bagian user-mode; tidak minta permission browser atau memasang extension.
- Inventaris source ID, metadata minimal yang aman, playback state/capability flags; redact URL/judul dalam log.
- Uji dua tab Chrome/Edge/Firefox dan Spotify desktop bersamaan; cermati `CurrentSessionChanged` tanpa menjadikan current session sebagai target implisit.
- Hentikan bila API membutuhkan manifest/package/permission yang belum dipahami. Dokumentasikan hasil, bukan menambah privilege spontan.

### Tahap 2 — transport terkendali

- Hanya setelah pemilik menyetujui fixture uji; satu sesi media yang datanya tidak sensitif. Kirim satu aksi pada target eksplisit dan cocokkan playback info sesudahnya.
- Uji target hilang/ditutup, capability false, request rejected/timeout, sesi media ganti, Windows locked. Tidak mengirim ke jaringan/HP; tidak mengubah preference browser atau memasang extension.
- Queue harus punya test case terpisah. Jangan klaim berhasil hanya karena jendela/queue terlihat: catat aksi yang terjadi dan target asal.

### Gate

- Hasil mendokumentasikan setiap kombinasi browser × layanan × aksi yang dites dan versi build.
- Target pilihan tidak berubah saat media lain aktif/berhenti; target ambigu ditolak, tak fallback.
- Tidak ada raw URL, credential/cookie, isi tab atau metadata personal di log/telemetry.
- Sebelum extension dipasang, buat desain permission dan distribusi per browser serta minta persetujuan terpisah.

## 9. Hasil probe lokal baca-saja

Probe dijalankan 25 November 2026 melalui Windows PowerShell dan proyeksi WinRT bawaan, **bukan melalui aplikasi WPF No Mouse**. Tidak membuat source probe permanen, memasang package/manifest, membuka port, membaca source app ID/judul/URL, atau mengirim perintah transport. Tidak ada perubahan kode produk.

| Item | Hasil aktual |
|---|---|
| OS | Windows 11 Home, version 10.0.26200, build 26200, 64-bit |
| Privilege | Proses probe tidak elevated |
| Resolusi type | `GlobalSystemMediaTransportControlsSessionManager` berhasil |
| `RequestAsync` dan `GetSessions()` | Berhasil; 1 sesi tersedia |
| Identitas sesi | Hanya ordinal sementara `Session-1`; tidak memetakan browser/layanan |
| Playback status | `Playing` |
| Capability yang dilaporkan | Play false; Pause true; Stop true; Next false; Previous false |
| Input/playback | Tidak ada command yang dikirim; pemutaran tidak diubah oleh probe |
| Data sensitif | Tidak memanggil `TryGetMediaPropertiesAsync` atau membaca source identifier/judul/URL/cookie |

**Yang terbukti:** API dapat diakses oleh host PowerShell non-admin pada mesin ini dan satu sesi melaporkan flag dinamis. `Stop=true` bukan bukti bahwa perintah stop berhasil, bukan dukungan queue, dan tidak dapat diatribusikan ke layanan tertentu karena sumber sengaja tidak dibaca.

**Yang belum terbukti:** proyeksi WinRT/manifest/TFM pada WPF .NET 10, identitas per-tab, beberapa sesi, ketahanan ID, perilaku setiap layanan/browser, queue, hasil command, serta lock-state filtering produk. Keberhasilan host PowerShell tidak menjamin bentuk deployment WPF bekerja sama; jangan menghapus gate packaging berdasarkan probe ini.

Langkah berikut membutuhkan fixture media nonpribadi yang jelas: pengguna menyiapkan media uji pada dua tab browser yang disebutkan dan, jika tersedia, Spotify desktop. Enumerasi anonim dapat diulang saat pengguna mengubah target secara manual untuk mengamati jumlah/capability tanpa membaca judul/URL. Sebelum mengirim pause/stop/next, minta izin tahap transport dan pilih target yang tidak ambigu; jangan mengontrol sesi personal yang kebetulan sedang aktif.

**Status kini: akses API lokal baca-saja terbukti; kompatibilitas per-target dan integrasi produk belum terbukti. Queue/cross-browser tetap terbuka.**

## Sumber resmi

1. [Microsoft — GSMTC session](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssession)
2. [Microsoft — GSMTC session manager](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionmanager)
3. [Microsoft — playback controls](https://learn.microsoft.com/en-us/uwp/api/windows.media.control.globalsystemmediatransportcontrolssessionplaybackcontrols)
4. [MDN — MediaSession.setActionHandler](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler)
5. [Chrome — native messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
6. [Chrome — tabs API and permissions](https://developer.chrome.com/docs/extensions/reference/api/tabs)

Sumber dibaca 25 November 2026. Query generik; tidak mengirim file PRD atau identitas proyek ke layanan luar.
