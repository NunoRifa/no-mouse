# Browser Bridge Baca-saja — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans untuk eksekusi Native yang telah dipilih pengguna. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat dan menguji prototipe Chrome yang membedakan dua tab terdaftar melalui native messaging, tanpa kontrol playback atau pemasangan otomatis.

**Architecture:** Extension MV3 memakai popup, service worker, dan adapter isolated-world terpaket. Worker mengelola enrollment hanya dalam memori dan berkomunikasi dengan host C# console user-mode melalui stdio native messaging. Belum terhubung WPF, HP, GSMTC, LAN, atau service privileged.

**Tech Stack:** JavaScript ES modules tanpa bundler/dependency tambahan, `node:test`/`node:assert` pada Node 22.20.0 yang tersedia, C#/.NET SDK 10.0.404 dan stdlib System.Text.Json. CI mengunci Node 22.20.0 untuk tes extension; konfigurasi .NET mengikuti `global.json`.

**Spec:** `docs/superpowers/specs/2026-11-25-browser-bridge-design.md`, disetujui pengguna. Persetujuan desain tidak mencakup registrasi HKCU, profil browser, atau instalasi extension.

## Global Constraints

- Kerja, commit, dan push pada `development`; jangan merge `master` sebelum aplikasi selesai dan QA rilis lulus.
- Prototipe hanya Chrome baca-saja pada profil uji; tidak ada play/pause/stop/queue/volume/navigation, HP/LAN, cloud, analytics, atau service.
- Host proses user-mode, tanpa admin/SYSTEM, tanpa shell/eval/debugger atau port HTTP.
- Maksimum payload UTF-8 64 KiB (65.536 bytes), maksimum 50 target per snapshot, protocol version 1.
- Hanya optional host origin `https://www.youtube.com/*`; izin situs dan pendaftaran tab adalah dua tindakan berbeda.
- Jangan membaca/menyimpan judul, URL lengkap/query/fragment, cookie, history, password atau isi media. Pemeriksaan URL lokal hanya untuk origin/routing/invalidation; tidak masuk pesan/log/storage.
- Enrollment dan target hilang ketika worker/port/host restart, navigasi, permission revoked, adapter putus atau tab ditutup; tidak restore/fallback berdasarkan judul/URL/tabId lama.
- Tidak membuat installer, mengubah registry, memasang extension, atau membuat/menghapus profil browser tanpa persetujuan spesifik berikutnya.

## Review Focus

1. Dua tab berlabel sama harus punya handle berbeda; tabId yang dipakai ulang tidak menerima generasi/epoch lama — tes Task 1/2.
2. Navigasi terjadi ketika permission request/injeksi masih menunggu; hasil async lama tidak boleh mendaftarkan dokumen baru secara tidak sengaja — tes Task 1/2.
3. Native prefix oversize, frame terpotong, JSON/UTF-8 invalid, unknown fields/op tidak mengalokasi tak terbatas atau menulis teks ke stdout — tes Task 1.
4. Cabut permission/worker restart/native disconnect harus mengosongkan target walau content port tidak memberi notifikasi tepat waktu — tes Task 2.
5. Profil uji bukan isolasi registry; artefak host/manifest tidak boleh otomatis overwrite HKCU atau profil harian — dokumentasi/tes smoke Task 3 dan review diff.

## File structure

- `prototypes/browser-bridge/extension/{manifest.json,popup.html,popup.js,worker.js,content.js,state.mjs}` — MV3 dan state enrollment murni, UI standar aksesibel tanpa styling/desain produk baru.
- `prototypes/browser-bridge/extension/test/state.test.mjs` — tes Node state/race/lifecycle dengan fixture API kecil.
- `prototypes/browser-bridge/host/{NoMouse.BrowserBridge.Host.csproj,Program.cs,Protocol.cs}` — stdio framing, validasi dan state protokol; tanpa dependency NuGet tambahan.
- `prototypes/browser-bridge/host-check/{NoMouse.BrowserBridge.Check.csproj,Program.cs}` — pemeriksaan assert console ber-exit nonzero, memakai codec host dan child-process host asli, bukan test framework baru.
- `prototypes/browser-bridge/README.md` — build/test, paket uji, batas bukti dan prosedur pemasangan/rollback yang belum dieksekusi.
- `.github/workflows/ci.yml`, `TODO.md`, `docs/qa/browser-bridge.md` — job verifikasi dan bukti aktual. Jangan mengubah aplikasi mobile/WPF hanya untuk prototipe ini.

---

### Task 1: Kontrak pesan dan native host baca-saja

**Interfaces:** `Protocol.ReadFrameAsync(Stream, CancellationToken)` mengembalikan JSON frame atau EOF bersih; `Protocol.WriteFrameAsync(Stream, object, CancellationToken)` menulis framing biner. Entry `Program` memproses frame stdin dan merespons stdout; error diagnostik hanya enum tersanitasi pada stderr. Operasi host: hello, upsert, remove, snapshot; tak ada execute.

- [ ] Tulis checks sebelum implementasi: roundtrip Unicode, dua frame berurutan, partial reads, EOF bersih, prefix terpotong, payload terpotong, UTF-8/JSON invalid, 65.537-byte length, versi salah, field tak dikenal, command `play`, epoch salah, 51 target, remove generasi lama. Jalankan dengan `dotnet run --project prototypes/browser-bridge/host-check`; buktikan RED assertion/build karena implementasi belum ada, lalu cocokkan kegagalan fitur yang dimaksud.
- [ ] Tetapkan skema persis dalam README sebelum codec dibuat: semua pesan `{version,type,requestId,...}`; `requestId` max 64 ASCII chars; ID opaque max 64; label sintetis max 64; service hanya `youtube`, status hanya `registered`; dokumen generasi string opaque; hanya satu main frame. Upsert/remove membawa epoch, enrollmentId, generation. Unknown fields ditolak di semua level; 50 batas berlaku state dan snapshot. `snapshotRequest` juga dipakai harness untuk mengambil snapshot host, host membalas `snapshot`; extension menerima permintaan snapshot dari host bila dibutuhkan.
- [ ] Implementasikan helloAck dengan `connectionId` dan `epoch` acak baru per proses. Proses belum handshake menolak pesan selain hello. TargetHandle diciptakan host, tidak sama dengan tabId dan tidak dipilih klien. Upsert mengganti hanya enrollment+generation sah, stale generation tidak menimpa target baru; perubahan generasi didahului remove/enrollment baru.
- [ ] Framing Windows little-endian 4 byte panjang payload: ukur byte UTF-8, cek batas sebelum alokasi, baca tepat jumlah byte, gunakan decoder UTF-8 strict dan batas kedalaman JSON. EOF tengah frame/length invalid menghentikan proses dengan kode nonzero; frame valid dengan operasi tak diizinkan membalas error enum tanpa raw payload. Flush output; tidak menulis BOM/prosa ke stdout.
- [ ] Jangan menganggap argumen origin sebagai autentikasi Windows. Tolak origin tak sesuai bila berasal dari launcher browser; host unit/child checks menjalankan stdin terkontrol tanpa mengklaim browser sudah terdaftar. Belum ada IPC/privileged capability yang dapat diberikan oleh hello.
- [ ] Jalankan seluruh checks GREEN, build Release, format check; child-process checks mengirim frame ke executable/DLL host sebenarnya dan memastikan command invalid tidak memberi efek selain error. Simpan hasil ke laporan QA, commit Task 1 pada development.

### Task 2: Extension enrollment tab dan lifecycle

**Interfaces:** `state.mjs` mengekspor `createState()`, `enroll(state, descriptor)`, `invalidate(state, enrollmentId, reason)`, `resetConnection(state, connectionId, epoch)`, `snapshot(state)`. Descriptor lokal berisi tabId, document nonce/generation, service enum dan label sintetis; ekspor wire tidak berisi URL/judul. Keputusan tab/enrollment dibuat worker, content script tidak boleh mengklaim tabId.

- [ ] Tulis `node --test prototypes/browser-bridge/extension/test/*.test.mjs` terlebih dahulu. Tes dua tab berbeda menghasilkan enrollment berbeda; UI data hanya label sintetis; origin tak diizinkan/incognito/frame bukan main ditolak; epoch lama/nonce lama ditolak; permission deny/revoke menghapus target; native disconnect/worker fresh kosong; URL query tidak pernah diekspor/logged; race response setelah navigasi tidak membentuk target. Saksikan RED lalu implementasi minimum.
- [ ] Manifest MV3: permissions `nativeMessaging`, `storage`, `scripting`; optional_host_permissions hanya `https://www.youtube.com/*`. Tanpa `tabs`, activeTab, webNavigation, externally_connectable, web-accessible bridge, content_scripts all-sites, permissions cookies/history/debugger atau incognito enabled. Popup skrip ES module lokal tanpa inline JS/eval/remote assets; worker module.
- [ ] Popup menampilkan status bridge dan daftar label terdaftar serta tombol daftar/lepas/cabut izin. Request optional permission pada klik pengguna, lalu query tab aktif yang match permission; jangan meminta isi tab sebelum grant. Jika tab berubah selama grant, batalkan enrollment dan minta klik ulang. Simpan hanya preferensi/label koneksi yang diperlukan; target tidak dipersist.
- [ ] Adapter `content.js` terpaket di main frame isolated world hanya membuka runtime port dengan nonce per instans dokumen. Worker memeriksa sender.tab.id, sender.frameId=0, browser-provided documentId bila ada, origin aktual, dan pending invocation sebelum menerima port. Jangan menerima window.postMessage atau payload page sebagai bukti identitas. Port bukan jalur kontrol playback.
- [ ] Invalidation konservatif melalui `tabs.onUpdated` loading/url/discard, `tabs.onRemoved`, content-port disconnect, native-port disconnect dan `permissions.onRemoved`. SPA navigation: adapter membandingkan location lokal dalam memori untuk invalidasi tanpa mengirim URL ke worker/host; tidak patch MAIN world. Interval terbatas dan dibersihkan saat port berhenti; pemilihan interval diserahkan implementer, dicatat bukan klaim latency navigasi nol. Endpoint action belum ada sehingga tak ada command race tersembunyi.
- [ ] Worker/native connect baru mengosongkan target, handshake ulang, lalu daftar ulang manual. Jangan auto-replay upsert/restore snapshot lama. Perintah host selain snapshot/read-only ditolak. Render popup dengan textContent, bukan innerHTML dari pesan. Host disconnected membuat UI unambiguous `terputus` dan tidak menampilkan target sebagai aktif.
- [ ] Untuk ujian wire, gunakan host handshake dan upsert Task 1; validasi snapshot yang diterima sebelum ditampilkan. Test fixture adapter browser cukup kecil dan hanya meniru events; tes state/protokol bukan bukti izin native browser benar-benar diberikan.
- [ ] Jalankan suite Node, checks host dan syntax parse; dokumentasikan batas browser nyata yang belum diuji. Commit Task 2 pada development.

### Task 3: CI, paket uji dan QA tanpa pemasangan

**Interfaces:** Mengonsumsi source dan command Task 1/2. Menghasilkan paket build lokal/reproducible instructions, bukan rilis store atau instalasi sistem.

- [ ] Tambahkan job tes extension dengan Node 22.20.0 dan `node --test ...`; pin action setup-node ke SHA release yang diverifikasi saat implementasi. Job Windows menjalankan format/build host serta console checks, menggunakan SDK dari global.json. Jalankan tes manifest privacy (JSON parse dan cek permission terlarang sebagai kontrak keamanan, bukan snapshot teks arbitrer).
- [ ] README mencantumkan nama host uji `dev.nomouse.browser_bridge_probe`, format manifest native messaging, path artefak publish yang nyata, dan placeholder **extension ID yang harus diperoleh user pada profil uji**, bukan allowlist wildcard atau ID karangan. Tidak membuat script auto-registration. Berkas deployment dapat berupa template `.example.json` yang tidak dapat dianggap siap dipasang dengan placeholder belum diganti.
- [ ] Dokumentasikan `dotnet publish ... -c Release -r win-x64 --self-contained false` untuk apphost host; pastikan runtime .NET 10 yang sesuai tersedia sebelum registrasi. Jangan mendaftarkan dotnet.exe sebagai native host tanpa adapter argumen yang ditinjau. Host manifest menunjuk apphost executable absolut, bukan code string/batch shell.
- [ ] Tulis instruksi pemasangan dan rollback sebagai **belum dijalankan/perlu izin**: profil Chrome uji terpisah tanpa sign-in/sync, load unpacked manual oleh pengguna, allowlist ID tepat, registrasi HKCU Google Chrome host uji dengan nilai/backup yang diperiksa lebih dahulu. Jangan overwrite nilai yang sudah ada. Profil uji tidak mengisolasi HKCU; stop bila konflik.
- [ ] Laporan QA memisahkan tes otomatis/frame/child process yang lulus dari uji browser manual yang belum: dua tab, fokus berubah, reload/navigasi/SPA, revoke, restart worker/browser, dan cleanup. Jangan centang runtime browser dari stub API atau tes Node.
- [ ] Jalankan seluruh suite Node/host, format/build Windows, validasi YAML serta tautan docs; review satu kali seluruh diff melalui reviewer independen. Perbaiki cacat penting dengan tes regresi RED/GREEN. Tidak memperlebar scope ke command media atau service.
- [ ] Commit dan push development sesuai CLAUDE.md. Catat commit serta CI yang benar-benar diverifikasi; jangan menyatakan run remote hijau sebelum API/log memberikan bukti. Tidak merge master.

## Batas penerimaan tahap implementasi

Source Chrome/host, tes dan paket instruksi dapat selesai tanpa perubahan registry/profile. Uji browser nyata tetap **terblokir izin pemasangan** sampai user menyetujui profil uji, extension ID, executable/manifest path, dan entri HKCU yang tepat. Jika ada bagian spec yang tak dapat dibuktikan tanpa instalasi, tandai belum diverifikasi, bukan dihapus atau diasumsikan lulus.

**Self-review rencana:** Task 1 menangani framing/schema/epoch/limit, Task 2 permission/enrollment/race/lifecycle/UI, Task 3 CI dan batas instalasi/QA. Fitur produksi (playback/site adapter, coordinator IPC, HP, GSMTC WPF, lock screen, Edge/Firefox) sengaja tidak masuk prototipe read-only ini.

**Handoff:** metode Native dipertahankan. Tunggu review/persetujuan rencana pengguna sebelum membuat source. Setelah source/tests selesai, mintakan izin instalasi konkret; jangan menganggap persetujuan rencana sebagai izin pemasangan.
