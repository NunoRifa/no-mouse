# Desain Jembatan Browser Hybrid

Tanggal: 25 November 2026. Status: **pendekatan hybrid dan desain teknis disetujui pengguna dalam percakapan; rencana implementasi berikutnya masih perlu direview**. Tidak ada kode, ekstensi, native host, registrasi browser, atau listener yang dibuat/dipasang oleh dokumen ini.

Acuan: [PRD](../../../PRD.md), [riset dan probe media](../../feasibility/media-browser.md), [aturan repository](../../../CLAUDE.md).

## 1. Tujuan dan batas pekerjaan

Membuat pemilihan target media **per tab yang benar-benar dapat dibedakan**, tanpa mengikuti current session secara otomatis. Chrome, Edge, dan Firefox tetap sasaran produk; implementasi pertama yang diusulkan hanya **prototipe Chrome baca-saja pada profil uji**, tanpa kontrol playback atau koneksi HP.

Bukti saat ini: dua tab YouTube dengan status playing/paused yang ditukar tetap menghasilkan satu sesi GSMTC sumber `Chrome`; tidak ada bukti dua target terpisah melalui GSMTC saja. Ini tidak membuktikan bahwa semua versi/browser selalu berperilaku sama.

### Pendekatan yang dipertimbangkan

| Pendekatan | Trade-off | Keputusan |
|---|---|---|
| GSMTC saja | Komponen sedikit; dapat mengendalikan sesi aplikasi yang diekspos Windows, bukan jaminan tab browser/queue | Tetap digunakan untuk sumber yang tidak ambigu seperti kandidat sesi aplikasi desktop; tidak cukup sebagai satu-satunya pembeda browser |
| **Hybrid extension + native messaging + GSMTC** | Identitas tab melalui browser, kontrol native melalui Windows; menambah pemasangan/izin/pengujian tiga browser | **Pendekatan dan desain dipilih/disetujui pengguna**. Eksekusi rencana dan pemasangan tetap mengikuti gate persetujuan terpisah |
| Shortcut/klik global untuk meniru semua layanan | Bergantung fokus, layout, dan timing; berisiko mengontrol target salah | Bukan dasar integrasi produk |

### Non-goal prototipe pertama

Tidak ada playback command, queue adapter, screen capture, LAN/HP, service berprivilege, auto-install, cloud, analytics, browser history/cookies/password, akses profil pribadi, Edge/Firefox packaging, atau perubahan lock screen. Queue tetap kebutuhan produk sesuai capability dan matriks, bukan hasil yang dijanjikan oleh ekstensi dasar.

## 2. Komponen dan batas privilege

| Komponen | Tanggung jawab | Hak/batas |
|---|---|---|
| Extension coordinator | Izin per situs, daftar target terdaftar, lifecycle tab/dokumen, native messaging | User-mode browser, permission minimum; bukan pembaca seluruh aktivitas browser |
| Content adapter terpaket | Observasi terbatas dalam dokumen yang dipilih; kelak operasi enum yang ditinjau per layanan | Default isolated world; tidak menerima JavaScript/CSS/selector arbitrer dari HP/host/halaman |
| Native messaging host | Framing/validasi pesan, identitas koneksi extension, proyeksi target ke Windows | Proses pengguna biasa; tidak administrator/SYSTEM, tanpa shell atau socket HTTP tambahan |
| Windows media coordinator | Otoritas state lock, akun/sesi, daftar koneksi extension, pemilihan target; kelak penghubung sesi HP terautentikasi | User-mode; tidak menggunakan komponen lock-screen privileged untuk fitur browser |
| GSMTC adapter | Enumerasi/capability aplikasi native yang bisa dibedakan, misalnya kandidat Spotify desktop | Tidak memetakan browser session ke tab berdasarkan tebakan judul/source ID |

Browser memulai native host melalui native messaging. Untuk integrasi produk, host berkomunikasi dengan coordinator melalui IPC lokal ber-ACL akun/sesi; HP tidak memanggil host browser langsung. Prototipe belum membutuhkan daemon coordinator atau IPC lintas proses tambahan: cukup host memvalidasi/menampilkan ringkasan daftar anonim secara lokal tanpa jalur perintah.

Native host bukan security boundary terhadap malware yang sudah berjalan sebagai akun Windows yang sama. Argumen origin/ID extension saja juga bukan autentikasi proses lokal karena program lain dapat memalsukan argumen. Jika kelak ada IPC produk, wajib verifikasi akun/session peer, registrasi koneksi melalui UI Windows, dan nonce koneksi baru; jangan memberi hak privileged dari pengakuan origin atau profile label.

## 3. Permission dan consent

### Baseline Chrome yang diusulkan

- `nativeMessaging`: menghubungkan extension yang diizinkan dengan host lokal terdaftar.
- `storage`: menyimpan preferensi/label koneksi lokal dan situs yang dipilih, bukan riwayat tab, judul, URL lengkap atau rahasia pairing HP.
- `scripting`: hanya jika injeksi adapter terpaket digunakan. Tidak menambahkan API/dependency lain sebelum dibutuhkan.
- `optional_host_permissions`: daftar origin layanan yang didukung, diberikan **satu situs setelah tindakan pengguna di UI extension**. Prototipe hanya origin YouTube yang tepat; tidak `<all_urls>`, wildcard seluruh internet, atau akses otomatis seluruh subdomain.
- Tidak meminta `tabs` luas untuk sekadar memperoleh daftar ID tab. Metadata sensitif dari tab hanya digunakan ketika matching host permission sudah diberikan dan target didaftarkan pengguna. Tidak meminta `cookies`, `history`, `debugger`, `webRequest`, `management`, clipboard browser atau incognito access.

`activeTab` saja tidak mencukupi target yang tetap bisa dipilih dari HP ketika tidak aktif: grant berasal dari invocation pengguna pada tab aktif, bukan native message dari HP. Karena itu gunakan permission situs opsional yang jelas, lalu **enrollment tab terpisah**; izin situs tidak otomatis membuat semua tab pada situs itu menjadi target No Mouse.

### Alur daftar target di browser

1. Pengguna membuka tab layanan uji, klik action extension, lalu memilih **Izinkan situs dan daftarkan tab ini**.
2. Browser meminta permission origin bila belum diberikan. Pembatalan menghasilkan tidak ada target dan tidak ada pembacaan isi halaman.
3. Coordinator mengecek tab aktif dan origin aktual melalui API browser; pesan/URL yang dikirim halaman tidak dipercaya.
4. Target diberi label lokal seperti `YouTube — Tab 1`; judul video bukan kebutuhan prototipe. Pengguna mengulang pada tab kedua. Dua tab tetap dua target walau label/judul sama.
5. Native host menerima descriptor minimum. Host tidak menyimpan daftar tersebut sebagai history. Kelak HP hanya melihat target milik koneksi extension yang disetujui dan sesi remote yang sah.
6. **Lepas tab** mencabut enrollment; **cabut izin situs** menghapus semua enrollment origin tersebut dan menghentikan adapter. Pencabutan ditangani dari permission browser maupun UI extension.

Sketsa teks, bukan desain visual final:

```text
No Mouse Browser Bridge — profil uji
Situs: YouTube [diizinkan]
[Daftarkan tab aktif]
Target terdaftar:
  YouTube — Tab 1 [Lepas]
  YouTube — Tab 2 [Lepas]
Jembatan: terhubung / terputus
Mode: baca-saja — kontrol playback belum tersedia
```

## 4. Identitas target dan lifecycle

Identitas logis extension mencakup `(browserConnectionId, connectionEpoch, tabId, documentGeneration, frameScope)`. Identitas ini dipetakan ke `targetHandle` opaque yang diterbitkan host/coordinator; kelak HP hanya mengirim handle itu beserta sesi remote dan revision capability, bukan tab ID/path/URL bebas.

- **Browser/profile:** tidak membaca path profil atau identitas akun browser. Setiap koneksi native yang hidup mendapat ID berbeda; label profil berupa label buatan pengguna, bukan identitas keamanan. Storage extension yang disalin/di-clone tidak dapat menggabungkan dua koneksi hidup.
- **Epoch:** native port atau background coordinator restart membuat epoch baru. Semua target lama invalid; tidak menyambung handle lama berdasarkan judul/URL.
- **Tab:** tabId hanya bermakna pada instance browser tersebut, dapat digunakan ulang setelah restart. Tidak valid lintas koneksi/epoch.
- **Dokumen:** navigasi top-level/reload mengganti documentGeneration dan membatalkan handle lama. Origin baru tidak otomatis diberi enrollment, sekalipun izin situs sudah ada. Untuk prototipe, setiap pergantian dokumen perlu daftar ulang manual.
- **Single-page navigation:** adapter memonitor sinyal navigasi/perubahan konteks yang tersedia tanpa menyimpan URL. Pilihan desain konservatif: jika konteks media/route berubah sehingga target tak bisa dibuktikan sama, invalidasi target dan daftar ulang. Lagu berikut pada player yang sama tidak otomatis dianggap dokumen baru; aturan layanan dibuktikan saat adapter media dibuat.
- **Frame:** fase pertama main-frame saja; embedded player/cross-origin iframe tidak didukung dan tidak memperluas permission otomatis. Chrome documentId dapat menjadi sinyal tambahan jika tersedia; bukan diasumsikan API identik pada Firefox.
- **Basi:** tab tutup, permission revoked, content adapter hilang, port terputus, browser crash, atau akun Windows berubah menonaktifkan target. Tidak fallback ke current tab atau GSMTC current session.

Pada mode native Spotify desktop, coordinator menggunakan jenis target `native-session` terpisah. Satu sumber browser GSMTC tidak digabung dengan `browser-tab` berdasarkan nama media. Target media yang dipilih HP tetap satu jenis/provider selama sesi sampai pengguna memilih ulang.

## 5. Kontrak pesan dan validasi

Prototipe menggunakan protocol `version = 1`. JSON UTF-8 dengan prefix panjang 32-bit native messaging; proses tidak menulis log/prosa ke stdout yang dipakai protokol. Batas aplikasi yang diusulkan **64 KiB per pesan**, maksimal **50 target per snapshot** dan paginasi eksplisit jika dibutuhkan kemudian; tolak batas berlebih sebelum alokasi/parsing tak terbatas. Ini batas prototipe/desain, bukan klaim kapasitas produk final.

| Pesan | Arah | Isi minimum |
|---|---|---|
| `hello` / `helloAck` | Coordinator extension ↔ host | Versi protokol, jenis browser build, epoch/ID koneksi yang diberikan host, mode read-only |
| `targetUpsert` | Extension → host | ID enrollment scoped connection, generasi dokumen, enum origin layanan, label sintetis, status observasi |
| `targetRemove` | Extension → host | ID enrollment/generasi, enum alasan invalidasi |
| `snapshotRequest` | Host → extension | Request ID; hanya meminta enrollment yang sudah sah |
| `snapshot` | Extension → host | Daftar target terdaftar dalam batas, revision, tanpa URL/judul/konten halaman |
| `error` | Dua arah | Request ID bila ada, enum kode aman, tanpa raw payload |

Semua skema menolak tipe/field tak dikenal, versi incompatible, ID yang salah epoch, dan string terlalu panjang; tidak memulihkan lewat eval, shell, debug port, atau eksekusi code string. Isi dari halaman adalah data tak dipercaya. Coordinator memeriksa sender extension/content-script berdasarkan informasi browser (`tab`, frame dan identitas dokumen), bukan field `tabId/origin` yang diklaim payload.

**Tidak ada pesan transport/execute di v1 prototipe.** Jika menerima `play`, `pause`, `stop`, `queue`, browser navigation, volume atau perintah lain, tolak `unsupported_operation`; jangan hanya menyembunyikan tombol UI. Perintah produksi memerlukan versi/skema dan desain terpisah yang disetujui, dengan targetHandle, epoch, generasi, lock state serta post-condition. Replay/retry pending tidak dijalankan sesudah reconnect atau unlock.

## 6. Native host dan distribusi tiga browser

- Chrome dan Edge: manifest host berisi allowlist origin extension ID tepat; tidak wildcard. Registrasi browser masing-masing eksplisit, tidak bergantung fallback registry ke browser lain.
- Firefox: host memakai `allowed_extensions` dan extension ID Gecko eksplisit; manifest bukan salinan Chrome mentah. Background lifecycle, MV3/permission/scripting compatibility harus diuji, bukan asumsi satu paket cocok semua browser.
- Native host dibundel/dipasang bersama pendamping Windows hanya setelah izin instalasi terkait. Untuk prototipe usulan registrasi **per-user (HKCU)** yang reversible pada nama host uji khusus; tidak admin, tidak service, tidak mengubah firewall/hosts/DNS. Profil uji tidak mengisolasi registry Windows, jadi backup nilai yang sudah ada dan jangan overwrite host produksi atau milik aplikasi lain.
- Binary, manifest dan config disimpan di lokasi aplikasi yang sesuai, tidak executable path dari pesan. Development extension ID dan ID store dapat berbeda; installer perlu allowlist yang diverifikasi, bukan mengizinkan ID tak dikenal.
- Extension package untuk Chrome/Edge/Firefox kelak perlu kanal store/signing masing-masing. Ini menambah kanal distribusi di luar keputusan mobile store/GitHub Releases Windows dan belum merupakan izin publikasi baru.
- Uninstall prototipe menutup port/host, menghapus enrollment, melepas extension/profil uji bila disetujui, dan menghapus hanya registrasi/berkas milik prototipe. Jangan membersihkan profil harian atau entri registry generik.

## 7. Lock state, privasi, dan kepercayaan

Prototipe tidak memiliki HP, jaringan, atau daftar judul, sehingga tidak memenuhi fitur remote produk. Desain produksi harus menerapkan:

- State Windows dari coordinator native yang sah menjadi otoritas; flag `locked:false` dari extension/HP tidak dipercaya. State tidak diketahui: tolak metadata/kontrol remote.
- Saat terkunci, coordinator tidak mengirim daftar, label/judul tab, atau metadata media ke HP; operasi Browser/Media ditolak dan pending dibatalkan. Extension berhenti melaporkan/menjajak metadata yang tidak dibutuhkan ketika mendapat state lock/disconnect. Informasi yang sudah diterima tidak dapat ditarik kembali.
- Saat unlock, snapshot disegarkan; jangan replay command, pindahkan target, atau aktifkan capture layar. Target yang masih dapat dibuktikan identitasnya boleh tetap dipilih; identitas berubah meminta pilihan baru.
- Native messaging browser origin/extension allowlist bukan pengganti autentikasi HP. Coordinator kelak memvalidasi trusted device, akun pengguna Windows, sesi aktif tunggal dan kemampuan yang diminta.
- Content adapter hanya menerima enum operasi terpaket yang dirilis; semua hasil halaman dianggap untrusted. MAIN-world bridge, jika kelak benar-benar dibutuhkan situs, memerlukan review tambahan karena halaman dapat memalsukan pesan; tidak menjadi jalur default.
- Jangan baca cookie, password, history, screenshot, page text menyeluruh, atau full URL query/fragment. Daftar target hanya di memori sesi; user preference/izin origin disimpan lokal, bukan cloud. Log hanya enum error/counter anonim; tidak raw frame native messaging.
- Ekstensi sendiri tidak memerlukan cloud atau fetch telemetry. Situs media tetap memakai koneksi normalnya sendiri; tidak mengklaim semua jaringan browser offline.

## 8. Capability media dan queue — tahap produksi mendatang

| Kemampuan | Provider kandidat | Gate |
|---|---|---|
| Daftar per tab | Browser APIs dan enrollment | Dua tab, dua browser/profile, reload, navigation, discard, permission revoke dan worker restart tidak tertukar |
| Play/pause | Adapter player terpaket pada tab terdaftar; native session untuk Spotify desktop | Aksi pada target benar, tidak ganggu media lain, state hasil diverifikasi |
| Stop/next/previous | Capability yang dibuktikan per layanan/provider | Tidak menyamakan stop dengan pause/tutup; false/unknown/timeout berbeda |
| Queue | Adapter spesifik layanan atau integrasi resmi yang sah/stabil | Tidak ada standar GSMTC/Media Session show-queue. Harus membuktikan queue target tampil di PC; tidak ada klik koordinat global atau ganti fungsi diam-diam |
| Volume | Windows system volume | Tetap terpisah dari browser provider; ditolak saat Windows terkunci |

Jangan menjanjikan extension dapat memanggil handler `navigator.mediaSession` milik halaman secara universal. Isolated world dan state player situs memiliki batas; mekanisme situs, iframe, subscription/account state, serta syarat layanan harus diverifikasi sebelum dukungan publik. Tidak mengambil token/cookie akun untuk mengganti kontrol player dengan API cloud tanpa keputusan terpisah.

## 9. Penerimaan prototipe Chrome baca-saja

1. Semua source ditinjau dan hasil build/test tersedia sebelum user memasang extension/host. Profil uji terpisah dengan tab nonpribadi; jalur registrasi, entri yang akan disentuh, dan rollback ditampilkan sebelum eksekusi.
2. Dua tab YouTube yang pengguna daftarkan muncul sebagai dua target sintetis berbeda. Mengubah fokus/playing/paused tidak mengalihkan identitas.
3. Reload, top-level navigation, tab tutup, origin berubah, worker/native host restart dan permission revoke menginvalidasi target lama. Pesan lama atau tab ID bekas ditolak.
4. Permission ditolak: tidak ada target/isi halaman dipindai. Tab lain, incognito, halaman internal browser, dan origin yang tidak diizinkan tidak diinventaris sebagai target.
5. Probe hanya membaca enrollment/status; payload tidak berisi judul, URL lengkap, history, cookies/password atau konten halaman. Tidak ada `Try*` media atau event input dikirim.
6. Pesan invalid/oversize/versi salah terdeteksi, stdout tetap native framing, host crash tidak memunculkan target palsu, dan host tidak mengakses socket/privilege service.
7. Lepas koneksi/profil uji: tidak ada target bertahan pada sesi lain. Bersihkan hanya entri host uji dan file yang dibuat, tanpa mengganggu registry/profile lain.
8. Catat browser/Windows build, extension build, fixture, jumlah target, dan hasil anonim. Kelulusan prototipe bukan dukungan playback/queue, Edge/Firefox, HP, atau lock screen.

## 10. Tahapan dan gate persetujuan

- **Sekarang:** desain teknis disetujui; [rencana implementasi](../plans/2026-11-25-browser-bridge.md) disusun untuk review sebelum eksekusi Native.
- **Setelah desain disetujui:** rencana implementasi kecil untuk extension Chrome read-only dan native host uji, tanpa listener HP atau service. Tes parsing/lifecycle wajib, bukan membuat seluruh arsitektur produksi sekaligus.
- **Sebelum pemasangan/eksekusi host registration:** minta izin spesifik untuk profil uji, path binary/manifest, extension ID dan entri HKCU yang nyata. Tidak menganggap persetujuan desain sebagai izin mengubah profil browser harian.
- **Setelah prototipe berhasil:** review hasil, baru desain command playback/site adapter. Edge/Firefox, transport LAN produk, serta integrasi GSMTC WPF mendapatkan tahap uji masing-masing.
- **Jika gagal:** jangan fallback ke current session atau membuka semua izin. Catat blocker dan ajukan revisi desain/scope secara eksplisit.

## Sumber dokumentasi

Dibaca 25 November 2026; belum bukti runtime prototipe:

- [Riset dan probe GSMTC sebelumnya](../../feasibility/media-browser.md)
- [Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)
- [Chrome scripting/document targeting](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Chrome native messaging](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
- [Edge native messaging](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/native-messaging)
- [Firefox native messaging](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging)
