# Browser Bridge — prototipe baca-saja

Belum dipasang di Chrome/registry/profil mana pun. Source ini bukan rilis produk dan tidak memiliki kontrol playback, HP, LAN, capture, atau service.

## Wire v1

Semua objek hanya menerima field yang tercantum, tanpa property duplikat. Prefix uint32 little-endian + JSON UTF-8 strict, 1–65.536 byte; depth JSON ≤8. ID/requestId ASCII `[A-Za-z0-9_-]`, 1–64 karakter. Maksimum 50 target. Satu koneksi maksimum 4.096 request; setelah batas koneksi ditutup, harus handshake/daftar ulang. Tidak ada replay requestId dalam koneksi. Label harus cocok `YouTube — Tab N` dengan N positif sampai 6 digit, service `youtube`, status `registered`. Generasi/enrollment baru tidak boleh memakai ulang ID yang sudah dipensiunkan pada koneksi itu.

| type | Field selain version/type/requestId |
|---|---|
| hello | browser=`chrome` |
| helloAck | connectionId, epoch, mode=`read-only` |
| targetUpsert | epoch, enrollmentId, generation, service, label, status |
| targetRemove | epoch, enrollmentId, generation, reason=`navigation`/`closed`/`revoked`/`disconnected`/`released` |
| snapshotRequest | epoch |
| snapshot (host response) | connectionId, epoch, revision, targets=[{enrollmentId,generation,service,label,status,targetHandle}] |
| error | code enum (requestId null jika tidak valid) |

Host memproses targetUpsert/Remove dan membalas snapshot; snapshotRequest mengambil snapshot host. Host tidak mengirim perintah aktif ke adapter. `helloAck` menciptakan epoch dan connectionId baru; handle target acak milik host. ID browser/origin bukan batas autentikasi akun lokal. Tidak ada shared IPC atau hak elevated.

Unknown operation, termasuk play/pause/stop/queue/volume/navigation, ditolak `unsupported_operation`; format/skema salah `invalid_message`; epoch salah `stale_connection`; replay `replayed_request`; target stale `stale_target`; target ke-51 `target_limit`. Frame rusak/oversize/UTF-8 salah/JSON malformed menghentikan proses dengan `invalid_frame` pada stderr. Tidak ada raw payload di log.

## Build dan tes tanpa instalasi

Node **22.20.0**, .NET SDK **10.0.404** (`global.json`). Tidak ada dependency npm/NuGet tambahan. Dari root repository:

```powershell
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
# Bila SDK dipasang lokal pada mesin ini:
$env:PATH = "$env:USERPROFILE\.dotnet\no-mouse-10.0.404;$env:PATH"
dotnet build prototypes/browser-bridge/host -c Release
dotnet format prototypes/browser-bridge/host/NoMouse.BrowserBridge.Host.csproj --verify-no-changes --no-restore
node --test prototypes/browser-bridge/test/host.test.mjs
node --test prototypes/browser-bridge/extension/test/*.test.mjs
```

Checks host menjalankan proses DLL sebenarnya melalui stdio dengan argumen khusus `--stdio-check`; tidak mendaftarkan/meluncurkan Chrome. Boundary jaringan/playback/privileged tidak ada, termasuk dalam mode check. Tes fixture Chrome menguji coordinator tetapi bukan bukti browser permission/port nyata.

```powershell
dotnet publish prototypes/browser-bridge/host -c Release -r win-x64 --self-contained false
```

Apphost hasil publish ada di `prototypes/browser-bridge/host/bin/Release/net10.0/win-x64/publish/NoMouse.BrowserBridge.Host.exe`. Native host browser harus menunjuk executable itu secara absolut, **bukan** `dotnet.exe`/script shell. Perlu runtime .NET 10 x64 terpasang atau `DOTNET_ROOT_X64` yang benar pada proses browser; instalasi SDK lokal tidak otomatis membuat browser menemukan runtime. Jangan mengubah PATH/registry mesin secara otomatis.

## Batas prototipe

- Aktif hanya ketika pengguna menghubungkan host melalui popup; perlu handshake baru dan enrollment ulang setelah reconnect.
- Izin origin hanya `https://www.youtube.com/*`; pengguna secara eksplisit mendaftarkan setiap tab melalui popup. Izin origin bukan enrollment seluruh situs.
- Adapter hanya main frame; dokumen mempunyai nonce tersendiri. Reload/navigation, `pagehide`, tab tutup/discard, permission revoke, port hilang dan reconnect membatalkan enrollment.
- SPA: adapter membandingkan lokasi secara lokal setiap **250 ms** tanpa mengirim URL ke host/log. Ada jendela waktu observasi; ini **bukan** jaminan invalidasi sinkron nol milidetik dan tidak layak untuk playback command tanpa desain lanjutan.
- Target/list hanya dalam memori; host/worker crash menghapus semuanya. Popup menampilkan label sintetis, bukan judul video.
- `allowed-origins.json` diperlukan untuk startup browser: array berisi **origin extension tepat** seperti `chrome-extension://<ID_PROFIL_UJI>/`; ID belum diketahui dan tidak boleh ditebak. `--stdio-check` hanya local harness, tidak memberi capability privileged, bukan autentikasi anti-malware pengguna yang sama.
- Tidak ada lock-state integration produk atau metadata dikirim ke HP. Prototipe tidak boleh dianggap memenuhi pembatasan Windows locked pada PRD hanya karena tidak punya jaringan.

## Pemasangan profil uji — belum dijalankan, perlu izin spesifik

Jangan menjalankan langkah pemasangan berikut hanya karena source sudah dibuild. Sebelum memasang, tunjukkan dan minta persetujuan untuk **profil Chrome uji terpisah tanpa sign-in/sync**, direktori extension/source, path binary/manifest/allowlist, extension ID nyata dan entri registry tepat.

Setelah izin tersebut diberikan, alur manual yang direncanakan:

1. Pengguna menyiapkan profil uji tanpa data pribadi dan melakukan Load unpacked direktori `prototypes/browser-bridge/extension` secara manual. Baca ID yang diberikan Chrome; tidak pakai wildcard.
2. Buat manifest host nyata di luar source ber-placeholder. Bentuk contoh berikut **bukan file siap instalasi**:

```json
{
  "name": "dev.nomouse.browser_bridge_probe",
  "description": "No Mouse read-only browser bridge prototype",
  "path": "<ABSOLUTE_PATH_TO_PUBLISHED_APPHOST_EXE>",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://<EXACT_TEST_EXTENSION_ID>/"]
}
```

3. Di samping apphost, buat `allowed-origins.json` hanya dengan origin yang sama persis; jangan commit config dengan data/path mesin pribadi. Host menolak ketika allowlist tidak ada/tidak cocok. Host permission ini tidak mengautentikasi HP atau proses OS.
4. Periksa nilai yang sudah ada pada `HKCU\Software\Google\Chrome\NativeMessagingHosts\dev.nomouse.browser_bridge_probe` dan backup jika ada. **Stop bila konflik**; jangan overwrite. Setelah izin, nilai default diarahkan ke manifest absolut. Profil uji tidak mengisolasi registry HKCU.
5. Klik Hubungkan host uji, lalu daftarkan tab uji pertama dan kedua. Tampilan harus dua label/handle berbeda; tukar fokus dan uji lifecycle sesuai checklist desain. Jangan mencoba playback.

### Rollback bersyarat

Hanya setelah pemasangan nyata tercatat: tutup port/profil uji, verifikasi host yang diluncurkan berhenti, hapus hanya key/value host yang dibuat (atau pulihkan backup yang telah diperiksa), lepas extension uji dan config hasil langkah di atas. Jangan menghapus profil harian, entri native host lain, atau data browser generik. Tidak ada skrip auto-registration/cleanup pada prototipe ini.

## Bukti QA

Lihat [laporan QA](../../docs/qa/browser-bridge.md). Uji browser nyata/pemasangan adalah gate berikutnya, bukan hasil dari unit/fixture/stdio checks.
