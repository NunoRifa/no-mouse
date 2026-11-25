# Studi Kelayakan — Kontrol Lock Screen Windows

Tanggal: 25 November 2026. Status: **riset dokumentasi selesai; kelayakan end-to-end belum terbukti**.

Acuan: [PRD v0.2](../../PRD.md), khususnya FR-02, FR-03, FR-05, FR-06 dan SEC-01–SEC-10. Dokumen ini bukan persetujuan desain produksi atau izin memasang service/komponen berprivilege.

## 1. Kesimpulan

**Aplikasi WPF/tray biasa tidak cukup untuk menjamin kebutuhan lock screen.** Dokumentasi Windows menunjukkan jalur akses secure desktop untuk konteks tertentu, tetapi tidak membuktikan bahwa kombinasi service, input, capture, autentikasi HP, dan transisi akun akan bekerja aman pada baseline proyek.

Rekomendasi: lanjut ke **desain spike lokal terisolasi** untuk menilai pemisahan UI pengguna, broker berprivilege terbatas, dan helper yang terkait sesi/desktop. Jangan langsung mengimplementasikan service produksi atau memberi seluruh aplikasi hak SYSTEM.

| Pertanyaan | Jawaban saat ini |
|---|---|
| Apakah tray yang tetap hidup mempertahankan hak mengontrol lock screen? | Tidak otomatis; lifetime proses berbeda dari hak desktop dan identitas sesi |
| Apakah Run as administrator cukup? | Tidak ada bukti cukup untuk seluruh input/capture lock screen |
| Apakah service SYSTEM langsung dapat menggambar/mengontrol sesi pengguna? | Tidak otomatis; service berjalan di Session 0 dan tidak boleh diperlakukan sebagai interactive service |
| Apakah capture secure desktop mempunyai dasar dokumentasi? | Ya: dokumentasi DXGI menyebut akses LOCAL_SYSTEM untuk secure desktop; konteks session/desktop dan hasil runtime tetap harus dibuktikan |
| Apakah input password pada lock screen sudah terbukti? | Belum; SendInput memiliki pembatasan UIPI/desktop dan bukan bukti end-to-end |
| Apakah fitur boleh dihapus dari MVP karena sulit? | Tidak; wajib dari pengguna. Jika tidak layak, rilis terblokir atau perlu perubahan scope yang disetujui |

**Tidak ada prototipe input/capture lock screen yang dijalankan pada tahap ini.** Tidak ada password dikumpulkan, service dipasang, perubahan registry/UAC, atau kebijakan keamanan diturunkan.

## 2. Kebutuhan yang tidak dibuka ulang

- Windows 11 x64; sesi pengguna sudah terbentuk setelah login. Login pertama setelah boot di luar MVP.
- Lock tidak mengakhiri sesi; HP tepercaya boleh reconnect bila tidak ada pengontrol aktif. Perangkat baru tidak dapat pairing ketika terkunci.
- HP dapat mengoperasikan lock screen dan memasukkan password Windows secara manual. Tidak ada bypass autentikasi, auto-login, penyimpanan password, atau replay input sensitif.
- Saat Windows terkunci: hanya mouse, keyboard login, dan tampilan lock screen yang diaktifkan manual. Browser, Media/volume, Aplikasi, clipboard, serta daya ditolak di Windows, bukan hanya disembunyikan di HP.
- Pergantian pengguna/logout mengakhiri sesi; akses tidak mengikuti akun baru. HP lock/background mengakhiri sesi tanpa mencabut kepercayaan.
- Satu pengontrol aktif. Reconnect memerlukan verifikasi perangkat dan aktivasi tampilan manual kembali.
- Komponen tambahan dan izin instalasi administrator dapat diperlukan. Persetujuan kebutuhan ini tidak berarti setiap desain privilege atau pemasangan pada PC sehari-hari sudah disetujui.

## 3. Fakta dokumentasi dan implikasinya

| Sumber resmi | Fakta | Implikasi / batas kesimpulan |
|---|---|---|
| [Desktops][1] | Window station/desktop merupakan objek dengan pembatasan akses; aplikasi biasa umumnya tidak memiliki SID yang diizinkan mengakses Winlogon | Mempertahankan tray bukan bukti bisa mengakses lock/login desktop |
| [SendInput][2] | Input injection dibatasi UIPI ke integrity level setara/lebih rendah; return/error tidak selalu menjelaskan blokir UIPI | Keberhasilan mengirim input di desktop biasa tidak membuktikan input di lock screen; penghitung event bukan bukti login berhasil |
| [DuplicateOutput][3] | E_ACCESSDENIED bila privilege tidak cukup; contoh dokumen: hanya aplikasi LOCAL_SYSTEM dapat mengakses secure desktop | Ada dasar untuk riset konteks capture berprivilege. Hak ini bukan jaminan session tepat, input login, atau dukungan semua GPU/build |
| [AcquireNextFrame][4] | Desktop/mode switch dapat menghasilkan DXGI_ERROR_ACCESS_LOST; duplication perlu dibuat ulang. Wait tanpa batas tidak dapat dibatalkan | Capture harus pulih saat transisi tanpa mengirim frame lama sebagai live; gunakan strategi wait yang bisa dihentikan |
| [Interactive Services][5] | Service modern tidak dapat berinteraksi langsung dengan pengguna; berjalan di Session 0. UI terpisah dan IPC ber-ACL merupakan pola komunikasi yang dijelaskan | Jangan membuat service interaktif legacy atau menganggap UI WPF di service menyelesaikan lock screen. Helper pengguna biasa juga tidak otomatis mempunyai hak secure desktop |
| [UAC settings][6] | UIAccess memerlukan pemeriksaan tanda tangan; lokasi instalasi aman berlaku secara default. Kebijakan UAC secure desktop terpisah | Manifest uiAccess bukan kunci universal untuk Winlogon/capture. Jangan mematikan secure desktop/UAC atau melonggarkan kebijakan agar tes lulus |

Dokumen Windows membahas kapabilitas API/konteks keamanan, **bukan sertifikasi desain No Mouse**. Contoh capture untuk LOCAL_SYSTEM tidak menghapus peringatan Microsoft terhadap service SYSTEM yang berinteraksi langsung dengan desktop pengguna. Penempatan proses, privilege, dan batas IPC wajib ditinjau sebelum prototipe.

DXGI juga memerlukan capture per output untuk desktop gabungan; timing antar output tidak disinkronkan otomatis [3]. Ini terkait studi multi-monitor terpisah, bukan alasan menyatakan semua monitor sudah didukung pada lock screen.

## 4. Alternatif yang dipertimbangkan

| Alternatif | Keuntungan | Kekurangan / keputusan studi |
|---|---|---|
| WPF/tray user-mode saja | Sedikit komponen; privilege rendah | Tidak memiliki dasar memadai untuk menjamin lock-screen input/capture. Tidak direkomendasikan sebagai solusi lengkap kebutuhan wajib |
| UI biasa + broker dan helper terisolasi dengan privilege minimum yang dibuktikan perlu | UI, konfigurasi, dan komponen umum tidak semuanya berprivilege; dapat memisahkan kemampuan sensitif | Kompleks: sesi/desktop, IPC, identitas akun, signing, instalasi dan lifecycle. **Kandidat utama untuk spike**, bukan arsitektur yang sudah disetujui/terbukti |
| Integrasi engine remote-control matang yang lisensi dan API-nya sesuai | Berpotensi mengurangi pekerjaan native | Belum dievaluasi. Ketergantungan, lisensi redistribusi, privasi, ukuran dan kemampuan menolak panel saat lock harus dibuktikan; jangan menyisipkan produk remote pihak ketiga tanpa izin |

Tidak dipilih: memberi seluruh UI/network parser hak SYSTEM, service interaktif legacy, credential provider kustom, driver input, atau auto-login sebagai jalan pintas. Belum ada kebutuhan teruji untuk kompleksitas tersebut. Credential provider bukan pengganti transport input dan tidak perlu ditambahkan hanya untuk mengambil password.

## 5. Batas desain yang direkomendasikan

Berikut rekomendasi reviewer, belum persetujuan arsitektur:

- **UI/tray:** berjalan dengan hak pengguna biasa; menampilkan sesi dan kendali stop/cabut. WPF tetap dipakai untuk UI, bukan diasumsikan memiliki akses Winlogon.
- **Broker/helper:** tanggung jawab sempit, terkait SID akun dan ID sesi yang diverifikasi. Tentukan melalui spike komponen mana yang benar-benar membutuhkan hak lebih tinggi. Jangan memberi semua proses privilege yang sama secara default.
- **Jaringan:** parsing pesan HP tidak dipercaya; jangan menaruh parser, peluncur aplikasi, clipboard, dan fitur panel lengkap dalam komponen privileged tanpa bukti kebutuhan. Penempatan transport vs broker masih keputusan desain keamanan.
- **IPC lokal:** ACL eksplisit, identitas peer, batas ukuran/jenis operasi, serta pengikatan sesi. Jangan menganggap nama pipe acak atau parameter SID/session dari klien membuktikan identitas. Klien lokal pengguna lain dan klien remote harus ditolak.
- **Otorisasi:** trusted device bukan akun Windows. Semua operasi perlu terikat pasangan, akun Windows, sesi remote aktif, state lock, serta jenis desktop. Data dari UI biasa tidak boleh membuka hak lintas akun.
- **State gagal:** state desktop/akun yang tidak diketahui berarti tidak mengirim frame atau input. Lepaskan input yang dimiliki remote dan hentikan kemampuan sensitif ketika helper hilang atau identitas sesi berubah.
- **Lock vs UAC:** keduanya dapat melibatkan secure desktop. Tidak boleh memberi izin input/capture hanya karena desktop berprivilege sedang aktif. UAC tetap di luar scope; jika klasifikasi tidak pasti, tolak sampai keadaan terverifikasi.
- **Password:** hanya input pengguna langsung, tidak dicatat atau disalin ke clipboard. Tidak meminta pengguna membagikan password lewat chat/log, tidak mengirim ke server luar, dan tidak mengklaim dapat menghapus seluruh salinan sementara yang dipegang Windows/keyboard OS.
- **Lifecycle:** service yang masih berjalan setelah tray ditutup tidak boleh diam-diam mempertahankan kontrol. Arti close, minimize ke tray, stop aplikasi, dan restart helper perlu kontrak tegas; sampai itu ditetapkan, hentikan kontrol bila kehadiran aplikasi/sesi sah tidak bisa dibuktikan.
- **Instalasi:** penjelasan privilege dan kemampuan sebelum persetujuan; binary/konfigurasi IPC tidak dapat diganti pengguna tak berwenang, updater tidak menjalankan file bebas, serta ada uninstall/recovery yang jelas. Tidak mengubah UAC, firewall global, atau kebijakan login.

## 6. Pertanyaan teknis yang wajib dibuktikan

| Gate | Bukti yang dibutuhkan | Status |
|---|---|---|
| F1 — Input | Input mouse/keyboard mencapai lock screen sesi uji yang benar; unlock berhasil lewat autentikasi Windows normal, tanpa melemahkan kebijakan | Belum diuji |
| F2 — Capture | Frame lock screen dapat diperoleh melalui konteks berizin; transisi desktop tidak membocorkan frame pengguna sebelumnya atau merepresentasikan gambar basi sebagai live | Belum diuji |
| F3 — Batas akun | Switch user/logout menghentikan akses dan membatalkan kemampuan lama. Reconnect tetap terikat akun pemasang | Belum diuji |
| F4 — Identitas dan IPC | Klien asing, pengguna lokal lain, pasangan dicabut, pesan replay/invalid dan pengontrol kedua ditolak sebelum input/capture | Belum didesain/diuji |
| F5 — Lock policy | Browser, media/volume, aplikasi, clipboard dan daya ditolak di sisi Windows; tidak ada replay setelah unlock | Belum diimplementasikan |
| F6 — UAC / secure attention | UAC tidak salah dianggap lock screen; kebijakan yang mewajibkan Ctrl+Alt+Delete dikenali dan dinyatakan dukungan/blocker-nya tanpa diubah | Belum diuji |
| F7 — Pemulihan | Crash helper, disconnect, lock/unlock berulang dan perubahan monitor tidak meninggalkan input tertahan atau sesi lintas akun | Belum diuji |
| F8 — Instalasi | Pemasangan berizin, signing/ACL yang sesuai, uninstall dan rollback diuji tanpa merusak login lokal | Belum didesain/diuji |

Keberhasilan F1/F2 saja hanya membuktikan **mekanisme lokal**, bukan keamanan produk LAN atau kelulusan MVP. Spike awal yang belum memiliki transport HP tidak boleh disebut memenuhi pairing/reconnect/perangkat tepercaya.

## 7. Usulan spike bertahap — belum dijalankan

### Tahap A: validasi mekanisme lokal

- Jalankan hanya pada VM Windows 11 x64 atau mesin uji milik pengguna dengan akses konsol pemulihan; jangan PC harian dengan data nyata sebagai default.
- Catat edisi/build Windows, GPU/driver, sesi console, akun uji dan kebijakan login. Jangan gunakan kredensial utama; pengguna memasukkan kredensial akun uji sendiri, bukan menyerahkan ke agen.
- Harness lokal tanpa listener jaringan, tanpa autostart permanen, tanpa driver/credential provider, serta tanpa perubahan UAC/login/firewall. Gunakan hanya operasi sempit yang ditinjau sebelum eksekusi.
- Buktikan F1/F2, state akun/desktop, penolakan UAC, dan pelepasan input. Dokumentasikan privilege yang ternyata dibutuhkan; jangan membuatnya lebih luas agar tes mudah.
- Batasi durasi proses, sediakan stop lokal, dan bersihkan hanya komponen spike yang ditinjau/diidentifikasi. Kehilangan akses lokal menghentikan uji, bukan alasan mencoba bypass login.

### Tahap B: desain dan validasi batas keamanan

Jika Tahap A lulus: susun desain identitas akun/sesi, otorisasi IPC dan transport, perangkat tepercaya/pencabutan, satu pengontrol, serta transisi lock/unlock. Review desain sebelum membuat akses dari HP. Uji F3–F8 dan threat model; jangan mengekspos helper privileged langsung ke LAN sebagai pengganti desain.

### Tahap C: integrasi produk

Hanya setelah desain dan bukti disetujui: integrasikan dengan pairing aman, aktivasi layar manual, batas panel, matriks Windows/perangkat, dan QA yang ditetapkan PRD. Performa lock screen/multi-monitor harus diukur, bukan diasumsikan sama dengan desktop biasa.

## 8. Kriteria keputusan

- **Lanjut desain produksi:** mekanisme dan batas keamanan terbukti pada baseline, privilege dapat dijelaskan serta dibatasi, instalasi/recovery layak, dan pemilik menyetujui desain.
- **Lanjut riset terbatas:** mekanisme mungkin tetapi bukti belum lengkap; jangan klaim fitur siap atau memasang ke pengguna umum.
- **Blokir rilis / ajukan perubahan scope:** hanya bekerja dengan mematikan proteksi OS, salah akun/desktop, akses IPC terlalu luas, UAC tak dapat dibedakan aman, atau lock-screen requirement tidak tercapai.

**Keputusan studi saat ini: lanjut ke desain spike terisolasi, bukan implementasi service produksi.** Pelaksanaan spike serta pemasangan/eksekusi komponen privilege memerlukan persetujuan tersendiri setelah desain, target mesin uji, dan prosedur pemulihan jelas.

## Sumber resmi

Seluruh sumber dibaca pada 25 November 2026. Tidak ada source proyek atau informasi pribadi dikirim sebagai isi query riset.

[1]: https://learn.microsoft.com/en-us/windows/win32/winstation/desktops
[2]: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput
[3]: https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_2/nf-dxgi1_2-idxgioutput1-duplicateoutput
[4]: https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_2/nf-dxgi1_2-idxgioutputduplication-acquirenextframe
[5]: https://learn.microsoft.com/en-us/windows/win32/services/interactive-services
[6]: https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/settings-and-configuration
