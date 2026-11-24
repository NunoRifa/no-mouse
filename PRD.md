# PRD — No Mouse

| Atribut | Nilai |
|---|---|
| Versi | 0.1 |
| Tanggal | 23 November 2026 |
| Status | Draf untuk review produk; bukan persetujuan implementasi |
| Sasaran rilis | Android dan iOS sebagai pengontrol komputer Windows |
| Model awal | Gratis sepenuhnya, tanpa iklan atau fitur berbayar |
| Pengembangan | Solo; anggaran dan target rilis fleksibel |

## 1. Ringkasan produk

No Mouse memungkinkan pengguna mengontrol komputer Windows melalui HP Android atau iOS dalam jaringan lokal. Pengguna dapat mengoperasikan mouse, mengetik, melihat layar komputer, mengatur media, berpindah aplikasi, mengoperasikan browser, memindahkan teks clipboard, serta mengakhiri sesi komputer tanpa kembali ke meja.

Kasus utama: pengguna sedang menonton Netflix sambil rebahan; mouse dan keyboard berada di meja. HP berfungsi sebagai pengontrol, sedangkan tampilan layar komputer membantu melihat kursor dan hasil ketikan. No Mouse bukan layanan streaming video, alat administrasi jarak jauh melalui internet, atau pengganti seluruh kemampuan AnyDesk/RustDesk.

### 1.1 Status keputusan dalam dokumen

- **Ditetapkan:** keputusan yang disampaikan pengguna dalam discovery.
- **Usulan:** rekomendasi produk, batas perilaku, atau target yang ditambahkan untuk menutup risiko; belum disetujui pengguna.
- **TBD:** belum memiliki bukti atau keputusan memadai; metode validasi dicantumkan.
- Kata **harus** pada usulan menjelaskan syarat rancangan yang direkomendasikan, bukan klaim bahwa pengguna telah menyetujuinya atau fitur sudah dibuat.

Dokumen ini menggabungkan discovery, dua profil pengguna, delapan user story, prioritas fitur, alur pengguna, daftar halaman, serta hasil review kritis. Tidak menentukan framework, protokol, pustaka, atau arsitektur implementasi.

## 2. Masalah dan bukti

### 2.1 Masalah

Pengguna yang berada jauh dari meja harus bangun untuk tindakan kecil di komputer: menggerakkan kursor, mengganti tontonan, mengatur volume, mengetik pencarian, atau mematikan komputer. Pengontrol tanpa tampilan layar juga menyulitkan penentuan posisi kursor dan pemeriksaan hasil ketikan.

### 2.2 Bukti yang tersedia

- Pengguna menyampaikan pengalaman pribadi mengontrol tontonan dari kasur ketika mouse berada di meja.
- Pengguna memakai aplikasi referensi dan menyediakan delapan screenshot panel yang fungsinya dinyatakan wajib.
- Pengguna secara eksplisit menginginkan tampilan layar komputer di HP, dua mode kontrol, pairing QR, serta kepercayaan perangkat yang dapat dicabut.
- Belum ada wawancara calon pengguna lain, pengukuran masalah, data retensi, atau hasil uji prototipe. Kebutuhan pasar di luar pengalaman pribadi masih **asumsi — validasi melalui wawancara dan uji penggunaan**.
- Kekurangan aplikasi yang sudah ada, alasan berpindah, dan alasan memilih waktu peluncuran sekarang masih **TBD — validasi melalui wawancara pengguna aplikasi sejenis**. Jangan mengklaim produk lebih cepat, aman, atau mudah sebelum diuji.

### 2.3 Hipotesis

Pengontrol lokal dengan pairing sederhana, mouse/keyboard responsif, dan tampilan layar terbaca akan membantu pengguna Windows menyelesaikan aktivitas hiburan serta aktivitas ringan dari HP tanpa kembali ke meja setelah pemasangan awal.

Bukti keberhasilan awal: peserta uji dapat memasangkan perangkat, mencari dan memutar tontonan, mengetik, memindahkan teks, serta mengakhiri sesi tanpa bantuan. Target pengukuran di bagian 13 merupakan usulan, bukan hasil pengujian.

## 3. Pengguna sasaran

### Profil 1 — Penonton hiburan dari kasur atau sofa

- **Konteks:** menonton Netflix atau media lain pada komputer Windows; mouse/keyboard tidak terjangkau.
- **Pemicu:** ingin pause, mengatur volume, mencari judul, berpindah situs, atau mengakhiri penggunaan.
- **Tujuan:** tetap nyaman tanpa berulang kali kembali ke meja.
- **Kebutuhan:** koneksi praktis, kontrol mouse, keyboard pencarian, kontrol media, dan kontrol daya.
- **Hambatan:** tampilan komputer jauh, salah klik, koneksi putus, atau shortcut media tidak bekerja pada aplikasi aktif.

### Profil 2 — Pengguna aktivitas komputer ringan dari jarak dekat

- **Konteks:** memakai aplikasi Windows melalui HP di jaringan lokal yang sama.
- **Pemicu:** perlu mengetik, berpindah aplikasi, membaca hasil input, atau memindahkan teks.
- **Tujuan:** menyelesaikan tindakan ringan tanpa keyboard/mouse fisik.
- **Kebutuhan:** layar terbaca, touchpad dan sentuh langsung, tombol tambahan, serta clipboard dua arah.
- **Hambatan:** teks terlalu kecil, kolom yang salah mendapat fokus, modifier tertahan, dan clipboard sensitif terkirim tanpa sengaja.

Kedua profil merupakan **hipotesis persona**, bukan hasil segmentasi pasar tervalidasi. Produk ditujukan untuk publik sejak awal, bukan hanya pemakaian pribadi.

### Bukan sasaran MVP

- Pengguna yang membutuhkan kendali komputer dari luar jaringan lokal.
- Administrasi enterprise, bantuan teknis ke komputer pihak lain, atau login pertama setelah boot sebelum sesi pengguna terbentuk. Membuka kunci sesi pengguna yang sudah aktif termasuk MVP sesuai keputusan 25 November 2026.
- Gaming kompetitif, produksi kreatif presisi tinggi, serta streaming audio/video komputer berkualitas tinggi.

## 4. Keputusan, batas, dan prioritas

### 4.1 Keputusan yang ditetapkan

| Area | Keputusan |
|---|---|
| Platform | Android dan iOS mengontrol Windows terlebih dahulu |
| Jaringan | Lokal saja; tidak memerlukan akses kontrol melalui internet |
| Beda SSID | Harus dapat digunakan jika jaringan saling mengizinkan komunikasi; nama SSID bukan identitas atau bukti kepercayaan |
| Pairing | QR ditampilkan komputer, dipindai HP |
| Kepercayaan | Disimpan sampai dicabut dari aplikasi Windows |
| Kontrol | Touchpad dan sentuh langsung |
| Layar | Untuk melihat kursor dan membaca hasil ketikan; bukan mengejar streaming video/audio |
| Fungsi | Seluruh kelompok fungsi pada delapan screenshot referensi wajib tersedia |
| Monetisasi | Rilis awal gratis sepenuhnya; iklan/freemium dievaluasi saat mencapai sekitar 1.000–10.000 pengguna |
| Sumber daya | Dikerjakan sendiri; anggaran dan jadwal fleksibel |
| Layak rilis | Pairing mudah, kontrol responsif, semua fungsi wajib stabil |

### 4.2 Prioritas MVP

#### Wajib

| Fitur | Alasan |
|---|---|
| Aplikasi Android, iOS, dan pendamping Windows | Menyediakan kedua ujung pengalaman kontrol |
| Koneksi lokal, pairing QR, perangkat tepercaya | Memenuhi kebutuhan koneksi mudah tanpa akses sembarang perangkat |
| Autentikasi, enkripsi, pencabutan, dan penghentian sesi dari Windows | Baseline keamanan; LAN bukan jaringan yang otomatis tepercaya |
| Mouse lengkap dan dua mode kontrol | Menggantikan tindakan mouse fisik |
| Tampilan layar dengan kursor | Memastikan sasaran klik dan hasil ketikan |
| Keyboard, navigasi, F1–F12, numpad, dan kombinasi tombol | Memenuhi referensi dan aktivitas mengetik |
| Kontrol media/volume | Mendukung kasus hiburan utama |
| Akses/pindah aplikasi dan tindakan jendela referensi | Memungkinkan navigasi tanpa kembali ke meja |
| Kontrol browser dan shortcut situs bawaan | Mempercepat akses serta navigasi tontonan |
| Clipboard teks dua arah atas tindakan pengguna | Menghindari pengetikan ulang tanpa sinkronisasi diam-diam |
| Shutdown, sleep, restart, dan logout dengan konfirmasi | Memenuhi referensi sambil mengurangi salah tindakan |
| Status koneksi, pemulihan, dan pelepasan input tertahan | Mencegah input salah atau tersangkut saat gangguan |
| Kendali privasi layar dan penanda sesi aktif | Pengguna komputer harus mengetahui dan menghentikan akses |
| Kontrol lock screen dan input password manual pada sesi Windows yang sudah aktif | Wajib sejak MVP, ditetapkan pengguna 25 November 2026 meskipun memerlukan komponen tambahan dan izin instalasi administrator; autentikasi Windows tidak dilewati |

#### Bagus kalau ada

| Fitur | Alasan / batas |
|---|---|
| Zoom dan pan layar | Membantu teks kecil; menjadi wajib jika target keterbacaan tidak tercapai tanpa fitur ini |
| Sensitivitas kursor dan scroll | Menyesuaikan kebiasaan serta ukuran layar |
| Landscape | Memberi ruang tambahan; koordinat input tetap harus benar saat ukuran tampilan berubah |
| Getaran dan penanda klik | Memperjelas umpan balik; tidak menjadi satu-satunya penanda |
| Kustomisasi shortcut situs | Shortcut bawaan tetap tersedia tanpa editor |
| Diagnosis jaringan mendalam | Panduan dasar wajib; diagnosis otomatis boleh menyusul |
| Windows berjalan otomatis setelah login | Menambah kenyamanan; perlu pilihan pengguna, bukan aktivasi diam-diam |

#### Nanti dulu

| Fitur | Alasan |
|---|---|
| Kontrol melalui internet, relay cloud, akun dan sinkronisasi cloud | Di luar batas lokal; menambah infrastruktur dan paparan data |
| macOS/Linux sebagai komputer target | Membatasi pengembangan dan matriks uji solo |
| Audio komputer dan streaming video berkualitas tinggi | Bukan kebutuhan tampilan awal; ada batas DRM |
| Iklan, pembayaran, langganan | Rilis pertama gratis sepenuhnya |
| Transfer file, gambar clipboard, clipboard otomatis | Kebutuhan tervalidasi baru transfer teks eksplisit |
| Beberapa HP mengontrol komputer bersamaan | Menghindari input bertabrakan; usulan satu pengontrol aktif per komputer |
| Kendali beberapa komputer sekaligus | Satu komputer aktif per HP; daftar komputer tersimpan tetap dapat tersedia |
| Wake-on-LAN, login pertama setelah boot, dan kontrol UAC | Di luar MVP. Berbeda dari membuka kunci sesi Windows yang sudah aktif, yang wajib sejak MVP |

Semua kategori fungsi referensi tetap masuk MVP. Tahapan pengerjaan tidak boleh dipakai untuk menyatakan rilis publik lengkap ketika panel wajib masih berupa placeholder.

## 5. Delapan user story

1. **Pairing:** Sebagai pengguna baru, saya ingin memasangkan HP dengan komputer Windows melalui scan QR dan menyimpan kepercayaan perangkat sampai akses dicabut dari Windows, supaya koneksi pertama aman dan koneksi berikutnya praktis.
2. **Mouse:** Sebagai pengguna yang jauh dari meja, saya ingin menggerakkan kursor, melakukan klik, drag, dan scroll melalui mode touchpad atau sentuh langsung, supaya saya bisa mengoperasikan komputer tanpa mouse fisik.
3. **Keyboard:** Sebagai pengguna aktivitas ringan, saya ingin mengetik teks serta memakai tombol navigasi, F1–F12, numpad, dan kombinasi tombol dari HP, supaya saya bisa mengisi kolom dan menjalankan shortcut tanpa keyboard fisik.
4. **Layar:** Sebagai pengguna yang mengontrol komputer dari HP, saya ingin melihat layar komputer dengan kursor dan teks yang terbaca, supaya saya bisa memastikan sasaran klik dan hasil ketikan.
5. **Media:** Sebagai penonton hiburan, saya ingin mengatur pemutaran media dan volume lewat HP, supaya saya bisa mengendalikan tontonan tanpa bangun.
6. **Aplikasi/browser:** Sebagai pengguna remote, saya ingin membuka atau berpindah aplikasi serta mengakses navigasi browser dan shortcut situs dari HP, supaya saya bisa menjangkau aplikasi dan halaman yang dibutuhkan tanpa mendekati komputer.
7. **Clipboard:** Sebagai pengguna aktivitas ringan, saya ingin menyalin teks dari HP ke komputer dan sebaliknya, supaya saya tidak perlu mengetik ulang teks pada perangkat lain.
8. **Daya:** Sebagai pengguna yang selesai memakai komputer, saya ingin menjalankan shutdown, sleep, restart, atau logout dari HP, supaya saya bisa mengakhiri penggunaan tanpa kembali ke meja.

Pencabutan akses dan kendali privasi Windows dijabarkan sebagai persyaratan keamanan, bukan dihilangkan karena jumlah story dibatasi delapan.

## 6. Hasil review kritis dan perbaikannya

| Temuan | Risiko / ambiguitas sebelumnya | Perbaikan yang direkomendasikan |
|---|---|---|
| Satu router dianggap cukup | Guest network, VLAN, isolasi klien, VPN, atau firewall dapat memblokir akses | Definisikan dukungan berdasarkan keterjangkauan lokal; panduan tidak menyuruh mematikan firewall |
| QR dianggap otomatis aman | QR difoto, dipakai ulang, atau mengarahkan ke komputer palsu | QR sementara sekali pakai, identitas komputer terverifikasi, konfirmasi pasangan baru di Windows |
| Kepercayaan dianggap izin tanpa batas | HP hilang atau perangkat tepercaya mengambil layar secara tersembunyi | Daftar perangkat, cabut akses segera, indikator sesi, tombol blokir sesi dari Windows |
| Reconnect hanya soal kenyamanan | Input lama terulang atau modifier tertahan | Lepas input; jangan replay ketikan, paste, atau tindakan daya setelah reconnect |
| Layar desktop dianggap sama dengan streaming Netflix | Video DRM dapat hitam; seluruh layar memuat data pribadi | Jelaskan batas DRM; tampilkan indikator berbagi dan pilihan hentikan tampilan |
| Sentuh langsung belum mendefinisikan koordinat | Salah klik pada letterbox, DPI berbeda, monitor berganti, atau gambar basi | Input harus mengikuti area gambar dan kondisi terbaru; blokir saat pemetaan tidak valid |
| Copy-paste belum jelas | Teks sensitif tertimpa atau perintah tertempel ke terminal | Transfer teks saja, eksplisit, tidak sekaligus paste/Enter, tampilkan arah dan status |
| Semua ikon referensi dianggap jelas | Beberapa ikon media/jendela tidak memiliki label yang memastikan makna | Kelompok fungsi wajib; rincian ikon yang meragukan harus dikonfirmasi, bukan ditebak sebagai fakta |
| Kontrol media dianggap universal | Shortcut dapat masuk ke aplikasi yang salah | Target tindakan ditampilkan; dukungan dinyatakan dalam matriks aplikasi yang diuji |
| Tindakan daya dianggap selalu sukses | Shutdown memutus koneksi sebelum hasil teramati; dokumen belum tersimpan | Konfirmasi risiko, tidak memaksa tutup aplikasi; bedakan terkirim, diterima, dan hasil terkonfirmasi |
| Windows tidak dibatasi | Janji tidak sengaja mencakup UAC, lock screen, login, ARM, dan banyak sesi | Tetapkan batas sesi desktop biasa; versi/arsitektur final wajib divalidasi sebelum rilis |
| Gratis dianggap tanpa biaya | Distribusi, signing, perangkat uji, dan akun store tetap membutuhkan biaya | Gratis untuk pengguna; biaya operasional serta kelayakan distribusi tetap perlu dihitung |
| Syarat stabil belum terukur | Tidak ada tolok ukur lulus/gagal | Tambahkan usulan ambang performa, usability, dan matriks penerimaan |

## 7. Persyaratan fungsional dan kriteria penerimaan

Seluruh detail baru pada bagian ini merupakan **usulan perbaikan** kecuali yang sudah ditetapkan pada bagian 4.1.

### FR-01 — Koneksi lokal dan identitas komputer

- HP dan Windows harus saling terjangkau melalui jaringan lokal. Mendukung PC melalui Ethernet dan HP melalui Wi-Fi, serta beda SSID ketika routing/aturan jaringan mengizinkan.
- Tidak mengharuskan nama SSID sama, tidak menjadikan alamat IP/nama komputer sebagai bukti identitas, dan tidak membuka akses internet/port router otomatis.
- Komputer yang sama tetap dapat dikenali setelah IP berubah; perubahan identitas keamanan memerlukan pairing ulang.
- Jika alamat berubah dan aplikasi tidak dapat menemukan koneksi lokal baru secara aman, tawarkan pencarian ulang atau scan QR; jangan menghapus kepercayaan secara diam-diam.
- Status: belum terhubung, menghubungkan, terhubung, mencoba ulang, tidak terjangkau, dan akses dicabut.
- **Penerimaan:** skenario Wi-Fi sama, beda SSID yang saling terjangkau, serta Ethernet–Wi-Fi bekerja. Jaringan terisolasi gagal dengan pesan yang membantu, bukan klaim perangkat pasti offline.

### FR-02 — Pairing dan perangkat tepercaya

- Pairing baru hanya dimulai melalui tindakan pengguna di Windows, ketika sesi Windows tidak terkunci.
- Usulan QR berlaku maksimum 120 detik, sekali pakai, dan dibatalkan ketika halaman pairing ditutup. QR tidak boleh membawa kredensial kepercayaan permanen.
- Setelah scan, HP menampilkan nama komputer; Windows menampilkan permintaan pasangan baru beserta identitas yang dapat dicocokkan pada kedua perangkat. Nama HP bukan bukti keamanan.
- Keputusan pengguna 25 November 2026: Windows meminta persetujuan hanya saat pairing pertama HP yang belum dipercaya. Kepercayaan baru tersimpan setelah konfirmasi di HP dan persetujuan di Windows. Koneksi berikutnya tidak meminta persetujuan ulang selama kepercayaan sah; setelah akses dicabut atau kredensial hilang, perangkat harus pairing dan mendapat persetujuan baru. Pembatalan, batas waktu, atau QR tidak valid tidak boleh menyisakan pasangan aktif.
- Koneksi berikutnya memerlukan bukti kepercayaan perangkat, tidak perlu persetujuan ulang setiap sesi selama akses masih berlaku.
- Windows menyediakan cabut per perangkat dan cabut semua; pencabutan membatalkan sesi aktif, termasuk aliran layar dan akses clipboard.
- **Penerimaan:** QR yang dipakai ulang/kedaluwarsa, penggantian identitas komputer, dan HP yang dicabut ditolak. Reinstall/hilangnya kredensial memerlukan pairing ulang, bukan pemulihan dari nama/IP saja.

### FR-03 — Siklus sesi dan konflik pengontrol

- Keputusan pengguna 25 November 2026: hanya satu HP boleh mengontrol komputer pada satu waktu; beberapa HP tetap boleh tersimpan sebagai perangkat tepercaya. Batas satu komputer aktif per HP masih merupakan usulan.
- Koneksi kontrol HP kedua ditolak dengan status **Komputer sedang digunakan** sampai sesi pertama berakhir, meskipun HP kedua tepercaya. Tidak ada takeover atau pemutusan sesi pertama oleh HP kedua. Pengguna di Windows tetap dapat mengakhiri sesi aktif melalui **Putuskan Sesi**; setelah sesi berakhir, HP lain dapat mencoba menghubungkan kembali.
- Windows menampilkan perangkat terhubung dan menyediakan **Putuskan Sesi** serta **Cabut Akses**. Putus sesi tidak sama dengan cabut kepercayaan.
- Mouse/keyboard fisik tetap bekerja. Jika pengguna lokal mengambil alih, tindakan lokal harus dapat menghentikan remote; aplikasi tidak menjanjikan koordinasi sempurna penggunaan simultan.
- Keputusan pengguna 25 November 2026: saat HP dikunci atau aplikasi No Mouse masuk background, sesi diakhiri tetapi kepercayaan perangkat tetap tersimpan. Hentikan input dan tampilan, lepaskan tombol/modifier tertahan, lalu bebaskan slot pengontrol setelah Windows memastikan sesi berakhir. Jika pemberitahuan putus tidak terkirim karena OS menangguhkan aplikasi/jaringan terputus, Windows harus mendeteksi hilangnya sesi melalui timeout liveness yang dibatasi; durasi final perlu divalidasi. Kembali ke foreground menawarkan sambung ulang tanpa QR jika kepercayaan masih sah, dan tetap menolak jika HP lain sudah memakai komputer.
- Keputusan pengguna 25 November 2026: penguncian Windows tidak mengakhiri sesi yang sudah aktif selama No Mouse masih berjalan di tray pada sesi pengguna Windows tersebut. HP tetap dapat mengoperasikan lock screen dan memasukkan password secara manual melalui antarmuka autentikasi Windows. Pergantian pengguna mengakhiri sesi; jangan memindahkan koneksi atau hak akses ke desktop pengguna lain. Aturan HP background/terkunci tetap mengakhiri sesi.
- Keputusan pengguna 25 November 2026: **kontrol lock screen dan input password manual wajib sejak MVP**, meskipun memerlukan komponen Windows tambahan dan instalasi dengan izin administrator. Persetujuan ini mencakup kebutuhan produk, bukan persetujuan atas desain privilege tertentu atau bukti implementasi berhasil. WPF tray biasa tidak otomatis mempunyai akses ke desktop Winlogon; studi kelayakan integrasi dengan hak minimum dan persetujuan instalasi jelas menjadi blocker sebelum desain keamanan dikunci. Menjalankan tray atau Run as administrator saja tidak dijanjikan mencukupi. Login pertama setelah boot dan kontrol UAC tetap di luar MVP; pergantian pengguna mengakhiri sesi.
- Keputusan pengguna 25 November 2026: saat Windows terkunci, HP boleh menyambung kembali hanya jika kepercayaan perangkat masih sah dan tidak ada pengontrol aktif lain. Verifikasi kepercayaan pada setiap koneksi; perangkat dicabut ditolak, perangkat baru tidak dapat pairing saat terkunci. Koneksi tetap terikat pengguna Windows yang memasangkan perangkat; tidak dialihkan ke akun lain. Aturan ini tidak memperluas scope ke login pertama setelah boot.
- Batas keamanan kebutuhan lock screen: autentikasi Windows tetap wajib, tidak ada bypass password, penyimpanan/replay password, auto-login, atau log kredensial. Password dimasukkan langsung oleh pengguna; input sensitif tidak diantrikan untuk replay setelah reconnect. Pairing perangkat baru tetap hanya dilakukan saat Windows terbuka. Detail capture lock screen dan kemampuan remote saat terkunci harus diuji pada baseline Windows sebelum klaim dukungan publik.
- Referensi kelayakan: [Microsoft — Desktops](https://learn.microsoft.com/en-us/windows/win32/winstation/desktops) menjelaskan isolasi desktop serta pembatasan akses Winlogon. Jalur integrasi masih terbuka; kewajiban fitur sejak MVP sudah ditetapkan. Jangan mencentang dukungan berdasarkan UI tray saja; rilis MVP harus membuktikan alur lock screen yang disetujui atau meminta perubahan scope secara eksplisit.
- **Penerimaan:** tidak ada sesi tersembunyi, takeover diam-diam, atau input yang terus berjalan setelah sesi dihentikan.

### FR-04 — Mouse dan dua mode kontrol

- Touchpad: gerak relatif, klik kiri/kanan/tengah, klik ganda, drag-and-drop, dan scroll vertikal/horizontal.
- Sentuh langsung: ketuk pada posisi objek yang ditampilkan; sediakan affordance klik kanan, drag, dan scroll yang tidak mengandalkan tebakan gesture.
- Pergantian mode harus jelas dan melepaskan input tertahan. Area di luar gambar tidak boleh menghasilkan klik desktop.
- DPI Windows, resolusi, posisi monitor, dan perubahan ukuran viewport tidak boleh menyebabkan salah pemetaan.
- Jika gambar terlambat, koneksi hilang, atau pemetaan layar berubah, hentikan sentuh langsung sampai tampilan valid. Usulan batas gambar basi: lebih dari 1 detik; validasi lewat uji.
- Keputusan pengguna 25 November 2026: MVP menyediakan pemilihan satu monitor atau **Semua monitor** untuk ditampilkan/dikontrol. Ini menggantikan usulan pembatasan satu monitor per waktu. Cara menyajikan semua monitor dan cakupan gerak kursor dalam mode satu monitor masih perlu dikonfirmasi. Perubahan pilihan, susunan, jumlah, resolusi, atau DPI monitor harus menyegarkan tampilan serta pemetaan sebelum sentuh langsung diterima. Tidak menganggap semua monitor memiliki ukuran/DPI sama; kapasitas maksimum dan performa perlu divalidasi.
- **Penerimaan:** koordinat benar pada skala Windows 100%, 125%, 150%, dan 200%, termasuk monitor dengan DPI berbeda. Kontrol tidak mengklik gambar lama setelah reconnect.

### FR-05 — Keyboard dan tombol tambahan

- Mengetik teks melalui keyboard sistem HP, termasuk huruf besar/kecil, angka, tanda baca, baris baru, dan teks Unicode yang didukung aplikasi sasaran.
- Tombol tambahan mencakup Esc, Tab, Insert, Delete, Home, End, Page Up/Down, panah, F1–F12, numpad, Enter, serta modifier Shift/Ctrl/Alt/Windows.
- Modifier yang aktif terlihat; semua modifier dilepas saat putus, ganti mode, keluar panel, atau sesi berhenti. Kombinasi umum seperti Ctrl+C, Ctrl+V, Alt+Tab, dan Ctrl+L wajib diuji.
- Teks tetap masuk ke aplikasi/kolom yang mendapat fokus di Windows; jangan mengklaim aplikasi dapat mengetahui semua kolom sensitif atau memindahkan fokus otomatis dengan aman.
- Komposisi keyboard/IME dan backspace tidak boleh menggandakan atau memotong karakter. Dukungan bahasa tambahan perlu matriks tersendiri; jangan mengklaim semua IME.
- Tidak menyediakan jalur melewati secure desktop, Ctrl+Alt+Delete, atau prompt elevasi Windows.
- **Penerimaan:** ketikan Indonesia/Inggris, karakter beraksen, emoji, komposisi IME yang dipilih, tombol navigasi, dan shortcut tidak terduplikasi. Informasi teks tidak dicatat dalam log.

### FR-06 — Tampilan layar komputer

- Menampilkan monitor pilihan beserta kursor aktual, bukan kursor lokal palsu yang tidak sesuai posisi Windows.
- Tampilan membantu membaca teks dan memilih objek; audio, kualitas film, dan frame rate tinggi bukan sasaran.
- Usulan tampilan aktif saat pengguna memilih melihat layar, bukan otomatis ditransmisikan segera setelah pairing. Windows selalu menampilkan indikator ketika sesi/tampilan aktif.
- Tersedia tindakan hentikan tampilan tanpa mencabut perangkat, serta tindakan hentikan seluruh sesi dari Windows.
- Bila tampilan gagal tetapi input masih aktif, tampilkan dua status terpisah. Sentuh langsung dinonaktifkan; touchpad boleh dilanjutkan setelah pengguna memahami bahwa layar tidak tersedia.
- Konten DRM, secure desktop, dan permukaan yang dikecualikan OS mungkin tidak dapat ditampilkan; jangan mencoba melewati perlindungan.
- Tidak merekam, menyimpan screenshot, atau menyimpan riwayat layar sebagai perilaku bawaan.
- **Penerimaan:** gambar basi tidak ditampilkan seolah live. Teks/kursor tetap terbaca pada kondisi uji bagian 13. Perubahan monitor, lock screen, dan penolakan capture ditangani jelas.

### FR-07 — Media, aplikasi, jendela, dan browser

- Media: play/pause, sebelumnya/berikutnya, volume naik/turun, dan fungsi kontrol media referensi yang telah dipastikan maknanya.
- Konteks penggunaan yang dikonfirmasi pengguna 25 November 2026: Netflix, YouTube, YouTube Music, dan Spotify melalui Chrome, serta Spotify desktop. Kelimanya menjadi sasaran validasi kompatibilitas; dukungan setiap perintah tidak diasumsikan sama.
- Bukti perilaku aplikasi referensi menurut pengguna 25 November 2026: tombol queue berhasil pada YouTube, YouTube Music, dan Spotify melalui Chrome, serta Spotify desktop; queue tampil di komputer. Queue pada Netflix belum dikonfirmasi. Ini laporan penggunaan aplikasi referensi, bukan hasil pengujian No Mouse. Stop dan perintah lainnya tetap perlu validasi per layanan.
- Aplikasi: tampilkan aplikasi berjalan yang dapat diaktifkan dan daftar peluncur yang didukung; jangan menjanjikan semua aplikasi/semua format instalasi dapat diluncurkan.
- Jendela: tindakan sesuai referensi, termasuk aktivasi dan kontrol jendela yang dikonfirmasi dalam inventaris. Tindakan tutup mengikuti dialog simpan Windows, tidak memaksa kehilangan data.
- Browser: kembali/maju, refresh, home, zoom, tab/jendela baru atau tutup sesuai pemetaan referensi, serta shortcut situs bawaan. Netflix dan YouTube merupakan kebutuhan utama; daftar shortcut final TBD.
- Keputusan pengguna 25 November 2026: target media dipilih secara eksplisit di HP dan dipertahankan selama sesi sampai pengguna menggantinya. Pergantian fokus aplikasi atau media lain yang mulai aktif tidak boleh mengalihkan target secara otomatis.
- Keputusan pengguna 25 November 2026: volume +/− mengubah volume Windows keseluruhan, bukan volume pemutar terpilih. Label harus menyebut volume Windows; pilihan target media tidak mengubah cakupan volume sistem.
- Tampilkan target terpilih serta cakupan setiap kontrol. Jika target hilang atau tidak dapat dibedakan secara aman, nonaktifkan perintah terkait dan minta pengguna memilih lagi; jangan fallback ke media lain. Kemampuan membedakan beberapa tab Chrome perlu dibuktikan sebelum dijanjikan. Jangan diam-diam mengganti fokus untuk mengeksekusi perintah pada target berbeda.
- Bila perintah tidak tersedia/ditolak, tampilkan keterbatasannya. Jangan melaporkan sukses hanya karena tombol diketuk atau shortcut terkirim.
- Shortcut situs hanya membuka tujuan web yang valid. Nama aplikasi, alamat situs, atau data dari HP tidak boleh diartikan sebagai perintah terminal/shell bebas.
- **Penerimaan:** dukungan diuji pada matriks aplikasi/browser final. Play/pause pada kasus tontonan, pindah aplikasi, pencarian browser, dan shortcut situs berfungsi tanpa mengirim ketikan ke target yang salah.

### FR-08 — Clipboard teks dua arah

- Transfer hanya setelah pengguna memilih **Kirim Teks ke Komputer** atau **Ambil Teks dari Komputer**. Izin clipboard mengikuti aturan Android/iOS yang berlaku.
- Pengguna diberi tahu bahwa clipboard tujuan akan diganti. Jangan tampilkan seluruh teks sensitif sebagai preview otomatis.
- Mengirim ke komputer mengganti clipboard saja, tidak otomatis paste atau menekan Enter. Mengambil dari komputer mengganti clipboard HP sesuai izin OS.
- Usulan batas 100 KB teks UTF-8 per transfer. Teks kosong, format nonteks, dan ukuran berlebih menghasilkan pesan jelas tanpa menimpa clipboard tujuan.
- Timeout harus membedakan gagal terkonfirmasi dan hasil belum diketahui. Retry dilakukan atas tindakan pengguna; transfer lama tidak dijalankan otomatis setelah reconnect.
- Tidak menjanjikan clipboard bebas dari riwayat/sinkronisasi OS atau aplikasi pihak lain. Peringatkan bahwa teks dapat masuk riwayat clipboard perangkat tujuan.
- **Penerimaan:** teks multibaris dan Unicode sama pada kedua sisi; operasi gagal tidak merusak clipboard lama; tidak ada pembacaan otomatis/background atau penyimpanan isi transfer oleh No Mouse.

### FR-09 — Daya dan sesi Windows

- Mendukung shutdown, sleep, restart, dan logout pada kondisi OS/perangkat yang mendukung.
- Konfirmasi menyebut nama komputer dan tindakan: misalnya **Restart komputer ini? Pekerjaan yang belum disimpan dapat terganggu.** Batal menjadi pilihan aman.
- Tidak memaksa aplikasi menutup atau mengabaikan dialog simpan. Jika Windows memblokir operasi, tampilkan status yang dapat diketahui tanpa menyatakan hasil pasti.
- Perintah tidak diantrikan untuk dieksekusi setelah reconnect, tidak diulang otomatis, dan ketukan ganda tidak menghasilkan tindakan berulang.
- Setelah sleep/shutdown, jangan menjanjikan sambung ulang sebelum komputer aktif kembali. Menyalakan dari HP di luar MVP.
- **Penerimaan:** pembatalan tidak menjalankan aksi; respons hilang tidak ditampilkan sebagai sukses terkonfirmasi; aksi lama tidak muncul saat komputer kembali online.

### FR-10 — Pemulihan dan pesan kesalahan

- Putus jaringan, Wi-Fi berpindah, Windows sleep, aplikasi berhenti, dan HP background harus menghentikan input lama serta aliran layar.
- Reconnect memverifikasi ulang kepercayaan dan kondisi sesi; tidak perlu pairing ulang bila identitas dan kepercayaan tetap sah.
- Jangan memutar ulang gerak, klik, ketikan, clipboard, atau perintah daya yang belum pasti hasilnya.
- Setiap error menyebut kondisi yang diketahui dan tindakan berikutnya. Hindari diagnosis pasti ketika aplikasi tidak dapat membedakan firewall, isolasi, VPN, dan komputer mati.
- Kamera atau izin jaringan lokal yang ditolak tidak menyebabkan loop dialog; sediakan petunjuk pengaturan dan pilihan kembali.
- **Penerimaan:** setelah gangguan, pengguna dapat kembali terhubung atau mendapat alasan yang dapat ditindaklanjuti tanpa input tertahan dan tanpa kehilangan clipboard/teks akibat retry diam-diam.

## 8. Keamanan dan privasi

### 8.1 Model ancaman

**Dilindungi:** kendali mouse/keyboard, tampilan desktop, teks clipboard, identitas pasangan, dan hak menjalankan tindakan daya.

**Ancaman utama:** perangkat LAN yang tidak dipercaya, penyadapan/manipulasi jaringan, pemalsuan komputer/HP, QR bocor atau dipakai ulang, HP hilang, serta aplikasi lain yang memanfaatkan layanan lokal.

**Batas jaminan:** perangkat/OS yang sudah dikompromikan, HP tepercaya yang dipegang orang lain dalam keadaan terbuka, dan perekaman layar oleh pihak lain tidak bisa diselesaikan oleh pairing saja. Jelaskan risiko kepercayaan persisten dan pentingnya kunci perangkat.

### 8.2 Persyaratan baseline — usulan, wajib sebelum rilis

| ID | Persyaratan | Bukti penerimaan |
|---|---|---|
| SEC-01 | Setiap sesi serta operasi layar/input/clipboard/daya memerlukan autentikasi perangkat; tidak ada akses anonim | Uji klien tanpa pasangan dan pasangan dicabut gagal pada seluruh kemampuan |
| SEC-02 | Pairing dan sesi melindungi kerahasiaan, integritas, dan identitas kedua pihak; tidak ada fallback plaintext atau terima identitas palsu | Review desain dan uji penyadapan/manipulasi lokal yang terotorisasi |
| SEC-03 | Kredensial pasangan terlindungi oleh penyimpanan aman platform; tidak muncul pada QR permanen, log, ekspor, atau backup umum | Audit penyimpanan, backup, reinstall, dan log |
| SEC-04 | Pairing hanya terbuka sementara, sekali pakai, disetujui di Windows; percobaan gagal dibatasi | Uji replay, kedaluwarsa, pembatalan, dan beberapa pemindai |
| SEC-05 | Cabut akses memutus seluruh kemampuan sesi dan menolak reconnect dengan identitas lama | Uji aktif saat tampilan/clipboard/input digunakan |
| SEC-06 | Data masuk dibatasi ukuran dan bentuknya; perintah hanya kemampuan produk yang diizinkan | Uji pesan tidak valid, clipboard berlebih, dan target/URL tidak sah |
| SEC-07 | Aplikasi tidak menyediakan eksekusi shell bebas, membuka firewall global, mematikan proteksi OS, atau elevasi untuk melewati UAC | Review perilaku instalasi dan sesi |
| SEC-08 | Pengguna Windows dapat melihat dan menghentikan akses; tidak ada mode akses tersembunyi | Uji indikator sesi, stop, lock, dan pergantian pengguna |
| SEC-09 | Tidak ada pengiriman isi layar, ketikan, clipboard, kredensial, atau inventaris aplikasi ke layanan eksternal | Pemeriksaan aliran data dan perilaku jaringan |
| SEC-10 | Paket rilis berasal dari kanal resmi dan keasliannya dapat diverifikasi; rilis tidak mendistribusikan rahasia bersama | Review distribusi/signing sesuai platform; rincian biaya/kanal TBD |

### 8.3 Data dan retensi — usulan

| Data | Penggunaan dan penyimpanan |
|---|---|
| Kredensial/identitas pasangan | Hanya pada perangkat terkait; bertahan sampai dicabut/dihapus atau penyimpanan aman hilang |
| Nama komputer/HP dan metadata koneksi | Lokal, minimum untuk memilih dan mencabut pasangan; bukan identitas keamanan |
| Alamat lokal saat sesi | Dipakai untuk koneksi; bukan kredensial dan tidak diekspor sebagai telemetry |
| Frame layar dan input keyboard/mouse | Hanya pemrosesan sesi; tidak disimpan sebagai riwayat atau log |
| Teks clipboard | Hanya transfer yang diminta; salinan OS dapat bertahan menurut kebijakan OS, bukan janji penghapusan oleh No Mouse |
| Log diagnosis | Tidak memuat payload sensitif, QR, token, judul jendela, atau URL pribadi; usulan rotasi maksimal 7 hari dengan batas ukuran lokal |
| Analytics/crash report | Tidak ada pengiriman otomatis pada MVP; ekspor diagnosis harus eksplisit dan disanitasi |

- Izin diminta saat diperlukan: kamera saat scan, akses jaringan lokal bila diwajibkan OS, clipboard saat transfer. Tidak meminta mikrofon, lokasi, kontak, atau akses penyimpanan luas tanpa kebutuhan terbukti.
- Penghapusan pasangan dari HP hanya menghapus akses lokal HP tersebut; bukan bukti perangkat lain sudah dicabut. Aplikasi Windows menjadi sumber pencabutan akses yang sah.
- Ubah ke iklan/freemium merupakan keputusan produk dan privasi baru. Tidak boleh mengaktifkan SDK iklan, pengumpulan data, atau pembatasan fitur diam-diam.

## 9. Alur pengguna

### 9.1 Pemasangan pertama

1. Pengguna membuka HP dan melihat **Komputer Saya** dalam kondisi kosong.
2. Memilih **Hubungkan Komputer**; panduan menjelaskan instalasi pendamping Windows dan syarat jaringan lokal.
3. Di Windows, pengguna membuka No Mouse lalu **Pasangkan HP**.
4. Windows menampilkan QR sementara dan masa berlakunya.
5. Di HP, pengguna memilih **Scan QR** dan memberi izin kamera saat diminta.
6. HP memverifikasi QR dan menampilkan identitas komputer. Pengguna mengonfirmasi.
7. Windows menampilkan permintaan pasangan baru; pengguna mencocokkan identitas dan menyetujui.
8. Keberhasilan ditampilkan pada kedua perangkat; kepercayaan tersimpan.
9. HP membuka **Kontrol Komputer**. Pengguna dapat mengaktifkan tampilan layar dan memilih mode input.

**Selesai jika:** pengguna menggerakkan kursor dan mengetik pada kolom uji tanpa bantuan. QR dibatalkan/kedaluwarsa tidak menghasilkan pasangan.

### 9.2 Mengontrol tontonan dari kasur

1. Buka HP, pilih komputer tersimpan, lalu **Hubungkan**.
2. Autentikasi perangkat tepercaya berlangsung tanpa scan ulang; tidak ada koneksi otomatis ke komputer berbeda.
3. Buka tampilan layar bila diperlukan, pilih touchpad atau sentuh langsung.
4. Buka/aktifkan browser dan situs tontonan dari panel yang sesuai.
5. Pilih kolom pencarian, buka keyboard, ketik judul, dan periksa hasil pada layar.
6. Pilih tontonan; gunakan kontrol media dan volume dengan target yang jelas.
7. Selesai: putus sesi atau jalankan sleep/shutdown melalui konfirmasi.

**Selesai jika:** pengguna mengatur tontonan tanpa kembali ke meja. Tampilan video DRM di HP bukan syarat keberhasilan.

### 9.3 Aktivitas ringan dan clipboard

1. Hubungkan ke komputer, pilih aplikasi berjalan atau peluncur yang didukung.
2. Tempatkan fokus pada kolom tujuan, lalu ketik atau gunakan tombol tambahan.
3. Untuk clipboard, pilih arah transfer dan konfirmasi penggantian clipboard tujuan.
4. Setelah transfer berhasil, lakukan paste secara terpisah bila diperlukan; tidak ada Enter otomatis.
5. Periksa hasil pada tampilan layar dan akhiri sesi.

### 9.4 Gangguan koneksi

1. Aplikasi menandai sesi tidak terhubung dan menghentikan input/tampilan lama.
2. Input tertahan dilepas; klik sentuh langsung dinonaktifkan.
3. Pengguna melihat status percobaan ulang atau memilih **Coba Lagi**.
4. Setelah autentikasi dan tampilan/pemetaan siap, kontrol dilanjutkan tanpa replay aksi lama.
5. Bila gagal, bantuan mengarahkan pemeriksaan jaringan, Windows, VPN, dan firewall tanpa menyuruh menonaktifkan proteksi.

### 9.5 Mencabut HP

1. Di Windows, buka **Perangkat Tepercaya** dan pilih HP.
2. Pilih **Cabut Akses**; dialog menjelaskan sesi akan diputus dan pairing ulang diperlukan.
3. Setelah konfirmasi, akses input, layar, clipboard, dan daya berhenti.
4. HP menampilkan **Akses dicabut — pasangkan ulang** dan tidak mencoba melewati pencabutan.

## 10. Halaman, panel, dan isi

### 10.1 Android dan iOS

| Halaman | Isi | State penting |
|---|---|---|
| Komputer Saya | Komputer tersimpan, nama/status, Hubungkan, Hubungkan Komputer, hapus pasangan lokal, bantuan | Kosong, menghubungkan, tidak terjangkau, sedang digunakan, akses dicabut |
| Hubungkan Komputer | Panduan Windows/jaringan, scan QR, izin kamera, konfirmasi identitas | Izin ditolak, QR salah/kedaluwarsa, menunggu persetujuan Windows, berhasil |
| Kontrol Komputer | Identitas komputer, status input/layar, monitor pilihan bila perlu, tampilan desktop, dua mode, pemilih panel, Putuskan Koneksi | Live, layar basi, layar tidak tersedia, reconnect, sesi dihentikan |
| Bantuan Koneksi | Pemeriksaan pendamping Windows, izin jaringan, keterjangkauan, VPN/firewall/isolasi, Coba Lagi | Tidak membuat diagnosis pasti tanpa bukti |

**Panel di Kontrol Komputer, bukan halaman penuh terpisah:**

| Panel | Isi |
|---|---|
| Mouse | Touchpad, tombol kiri/tengah/kanan, scroll dan drag; toggle mode sentuh langsung |
| Keyboard | Keyboard sistem; tampilan komputer tetap dapat diperiksa |
| Tombol Tambahan | Navigasi, F1–F12, numpad, modifier dan indikator aktif |
| Media | Kontrol pemutaran dan volume; target/status dukungan |
| Aplikasi | Aplikasi berjalan, peluncur yang didukung, penanda aplikasi aktif dan kontrol jendela terkonfirmasi |
| Browser | Navigasi, tab/jendela, zoom, shortcut situs |
| Clipboard | Dua arah transfer teks, penjelasan clipboard tujuan, status, izin bila perlu |
| Daya & Sesi | Shutdown, sleep, restart, logout; dialog konfirmasi terpisah |

Struktur ringkas halaman kontrol:

```text
Nama komputer | status input / layar | putus sesi
Monitor pilihan | tampilkan / hentikan layar
Tampilan desktop dan kursor
Mode: Touchpad / Sentuh Langsung
Panel: Mouse, Keyboard, Tombol, Media, Aplikasi, Browser, Clipboard, Daya
Isi panel aktif
```

Hierarki ini merupakan usulan UX, bukan desain visual final. Panel tidak boleh menutupi seluruh area penting tanpa cara mudah melihat hasil tindakan.

### 10.2 Windows

| Halaman | Isi | State penting |
|---|---|---|
| Beranda | Identitas komputer, status layanan lokal, HP aktif, status berbagi layar, Pasangkan HP, Putuskan Sesi, Perangkat Tepercaya | Tidak aktif, siap, terhubung, gangguan izin/jaringan |
| Pasangkan HP | QR sementara, waktu berlaku, identitas untuk dicocokkan, permintaan pasangan, Setujui/Tolak, QR Baru, Batal | Menunggu, kedaluwarsa, ditolak, berhasil |
| Perangkat Tepercaya | Daftar pasangan, indikator sesi aktif, Cabut Akses per perangkat, Cabut Semua | Kosong, pencabutan, sesi terputus |

Indikator sesi dan akses penghentian harus tetap dapat ditemukan ketika jendela utama diminimalkan. Bentuk affordance mengikuti standar Windows, tidak ditentukan oleh PRD ini.

## 11. Inventaris referensi dan keterlacakan

Screenshot dipakai sebagai bukti fungsi, bukan izin menyalin merek, ilustrasi, wallpaper, atau aset visual aplikasi lain. No Mouse memerlukan aset sendiri atau berlisensi.

| Referensi lokal | Fungsi yang terlihat | Persyaratan |
|---|---|---|
| `asset/action-panel.jpg` | Daftar ikon aplikasi, penanda aplikasi aktif, akses aplikasi | FR-07 |
| `asset/browser-panel.jpg` | Kembali/maju, zoom, refresh, home, kontrol tab/jendela, shortcut situs | FR-07 |
| `asset/control-panel-1.jpg` | Play/pause, sebelumnya/berikutnya, volume; ikon daftar kanan atas menampilkan queue, kotak di bawahnya menjalankan stop (dikonfirmasi pengguna 24 November 2026); X merah belum diketahui | FR-07; pengguna mengonfirmasi 25 November 2026: queue ditampilkan di layar komputer melalui aplikasi pemutar, bukan daftar native pada HP. pengguna menetapkan 25 November 2026: X merah ditunda dari MVP sampai fungsinya terkonfirmasi; pengecualian eksplisit dari cakupan referensi wajib. Jangan menganggapnya tutup aplikasi tanpa bukti |
| `asset/control-panel-2.jpg` | Matikan, Tidur, Mulai Ulang, Keluar | FR-09 |
| `asset/copy-paste-panel.jpg` | Salin ke komputer, salin dari komputer | FR-08 |
| `asset/keyboard-panel.jpg` | Keyboard sistem HP, area kontrol mouse | FR-04, FR-05 |
| `asset/key-panel-1.jpg` | Esc/Tab, navigasi, tombol panah, numpad/F1–F12 | FR-05 |
| `asset/key-panel-2.jpg` | Shift/Ctrl/Windows/Alt; tombol pertama di kanan Alt membuka Task View melalui Win+Tab; tombol berikutnya menjalankan Win+D untuk menampilkan/menyembunyikan desktop (dikonfirmasi pengguna 25 November 2026) | FR-05, FR-07; pengguna menetapkan 25 November 2026: tombol paling kanan ditunda, tidak masuk MVP. Fungsinya belum diketahui dan tidak boleh ditebak; pengecualian eksplisit dari cakupan referensi wajib |

**Ambiguitas yang tidak boleh disembunyikan:** screenshot tidak menjelaskan perilaku setiap ikon. Sebelum desain dibekukan, pemilik produk perlu memeragakan ikon yang masih masuk MVP tetapi belum jelas atau memberi nama aksinya. Seluruh ikon wajib harus masuk checklist penerimaan dengan makna terkonfirmasi. Pengecualian scope yang disetujui pengguna 25 November 2026: X merah panel media dan tombol paling kanan `key-panel-2.jpg` ditunda dari MVP. Semua pernyataan cakupan referensi lengkap dan gate penerimaan dalam PRD mengikuti dua pengecualian ini; tombol yang ditunda bukan blocker kelengkapan MVP.

## 12. Edge case dan perilaku yang diharapkan

| Kasus | Respons / batas yang direkomendasikan |
|---|---|
| HP di Home, PC di Home_5G | Bekerja jika saling terjangkau; gagal dengan panduan bila isolasi aktif |
| Ethernet, guest Wi-Fi, VPN, atau beberapa adaptor | Pilih jalur lokal yang terjangkau dan aman; QR tidak mengatasi pemblokiran jaringan |
| IP berubah/router restart | Cari ulang komputer terverifikasi; jangan percaya alamat baru tanpa identitas yang sah |
| Dua komputer bernama sama | Bedakan identitas pasangan; jangan pilih berdasarkan nama saja |
| QR difoto/discan dua HP | Hanya pasangan yang disetujui Windows terbentuk; QR sekali pakai dan kedaluwarsa |
| HP hilang atau dipinjam orang lain | Cabut dari Windows; jelaskan bahwa orang yang membuka HP tepercaya dapat memperoleh akses sampai dicabut |
| HP kedua mencoba mengontrol | Tampilkan sibuk; tidak ada takeover diam-diam |
| HP menerima panggilan, terkunci, atau aplikasi ditutup | Hentikan input/layar, lepas modifier, simpan kepercayaan tanpa sesi background tersembunyi |
| Putus saat drag/Ctrl/Alt ditekan | Lepas semua input saat sesi hilang; tidak ada tombol tertahan |
| Windows terkunci | Kebutuhan terkonfirmasi: pertahankan sesi aktif dan izinkan pengguna mengoperasikan lock screen serta memasukkan password Windows sendiri. Wajib sejak MVP; jalur integrasi dan kelayakan belum dibuktikan. Tanpa bypass autentikasi atau penyimpanan kredensial |
| Windows logout/ganti pengguna | Akhiri sesi; tidak mengakses desktop pengguna lain atau memindahkan koneksi otomatis |
| UAC/elevated window | Hormati batas OS; tampilkan tidak dapat dikontrol bila diblokir; tanpa bypass/elevasi otomatis |
| Resolusi/DPI/monitor berubah | Blokir sentuh langsung hingga gambar dan koordinat cocok |
| Layar beku/DRM/izin capture gagal | Label kondisi, jangan tampilkan gambar basi sebagai live; tawarkan touchpad jika input masih sah |
| Ketikan menuju kolom yang salah | Tampilkan konteks layar/target yang tersedia; jangan mengirim ulang otomatis atau menjanjikan deteksi semua fokus |
| Unicode/emoji/IME/backspace | Tidak duplikasi/memotong karakter; bahasa yang belum diuji tidak diklaim didukung |
| Clipboard kosong/nonteks/berlebih/izin ditolak | Pesan spesifik, clipboard tujuan tetap utuh |
| Clipboard berubah selama transfer | Jangan mengirim ulang versi berbeda diam-diam; hasil harus sesuai snapshot yang dipilih pengguna |
| Paste berisi perintah terminal | Transfer tidak otomatis paste atau Enter; pengguna tetap memilih tindakan berikutnya |
| Perintah media tidak didukung | Jelaskan keterbatasan target; jangan mengeksekusi shortcut pada target tak sesuai |
| Tutup aplikasi/restart dengan pekerjaan belum disimpan | Hormati dialog simpan dan jangan memaksa penutupan |
| Koneksi hilang setelah tindakan daya | Tampilkan hasil belum diketahui bila tak bisa dikonfirmasi; tidak retry otomatis |
| Sleep lalu ingin menyalakan dari HP | Jelaskan komputer perlu aktif kembali; Wake-on-LAN di luar MVP |
| Penyimpanan aman/instalasi Windows berubah | Kepercayaan yang tidak bisa dibuktikan tidak dipulihkan dari nama/IP; pairing ulang |
| Versi HP dan Windows berbeda | Periksa kompatibilitas; blokir kemampuan yang tak kompatibel dengan pesan pembaruan, tanpa menurunkan keamanan |

## 13. Kualitas, kompatibilitas, dan ukuran keberhasilan

### 13.1 Kandidat baseline — belum keputusan pengguna

- Usulan komputer minimum: Windows 11 x64 pada versi yang masih menerima dukungan keamanan. Windows 10, Windows ARM, dan versi minimum Android/iOS: **TBD — validasi API, perangkat uji, pasar sasaran, dan kebijakan store**.
- Usulan browser awal: versi stabil Chrome dan Edge pada baseline Windows, diuji dengan situs Netflix dan YouTube yang tersedia saat pengujian.
- Aplikasi media native dan peluncur aplikasi tambahan: **TBD — inventaris aplikasi pengguna lalu uji kompatibilitas**. Batas kompatibilitas harus ditulis, bukan klaim bekerja di semua aplikasi.
- Satu sesi pengguna Windows yang sudah login, termasuk mempertahankan sesi remote dan membuka kembali lock screen dengan kredensial manual sesuai FR-03. Login pertama setelah boot tetap di luar MVP. Tidak menjanjikan dukungan Windows Server/RDP/multi-user.
- Minimum keterbacaan dan input harus lulus pada HP Android dan iPhone fisik, bukan emulator saja.

Baseline final adalah blocker rilis. Dokumen ini tidak mengklaim versi OS/API tersebut sudah diteliti atau dukungan store sudah diverifikasi.

### 13.2 Usulan target penerimaan

Target berikut perlu dikalibrasi lewat prototipe dan disetujui sebelum menjadi komitmen rilis. Tidak ada angka yang merupakan hasil uji saat ini.

| Area | Target usulan | Cara ukur |
|---|---|---|
| Pairing mudah | Minimal 9 dari 10 peserta baru berhasil tanpa bantuan dalam 2 menit | Mulai dari kedua aplikasi terpasang dan siap; waktu instalasi dilaporkan terpisah |
| Koneksi ulang | p95 maksimal 5 detik | Minimal 30 percobaan per platform HP pada LAN acuan, komputer aktif dan aplikasi siap |
| Input responsif | p95 maksimal 100 ms untuk klik/ketikan menjadi terlihat pada monitor PC | Pengukuran end-to-end, minimal 100 peristiwa per platform; pisahkan dari delay layar HP |
| Tampilan membantu kontrol | p95 delay tampilan maksimal 500 ms dan pembaruan sekitar 5 fps saat desktop berubah | Desktop acuan 1920×1080; ukur penangkapan/perubahan sampai terlihat di HP, bukan hanya jaringan |
| Teks terbaca | Minimal 9 dari 10 peserta membaca teks uji dan memastikan hasil ketikan tanpa melihat monitor PC | Teks aplikasi 16 px pada desktop 1080p; zoom/pan wajib jika target gagal tanpa itu |
| Tugas inti | Minimal 9 dari 10 peserta menyelesaikan skenario tontonan dan input ringan tanpa bantuan | Setelah pairing, tidak perlu kembali ke meja kecuali muncul batas OS yang dinyatakan |
| Stabilitas sesi | 60 menit penggunaan campuran per platform tanpa crash, input tertahan, atau reconnect tak disengaja | Jalankan mouse, keyboard, panel, layar, dan clipboard pada LAN sehat |
| Pemulihan | Input tertahan dilepas maksimal 2 detik setelah hilangnya sesi terdeteksi; tidak ada replay | Injeksi gangguan koneksi saat drag, modifier, transfer, dan tindakan daya |
| Pencabutan akses | Semua akses berhenti maksimal 2 detik pada LAN sehat; setelah cabut, tidak ada operasi baru diterima | Uji saat input/layar/clipboard aktif; frame yang sudah diterima tidak dapat ditarik kembali |
| Integritas clipboard | Semua transfer dalam batas ukuran sama persis; semua kegagalan terkonfirmasi menjaga clipboard lama | Multibaris, Unicode, kosong, nonteks, ukuran batas dan melebihi batas |
| Kelengkapan | Seluruh fungsi wajib dan ikon referensi terkonfirmasi lulus pada matriks dukungan | Checklist FR-01–FR-10, kedua platform HP, dan aplikasi yang diklaim didukung |

**LAN acuan usulan:** perangkat fisik pada jaringan lokal yang saling terjangkau, RTT sekitar ≤20 ms, tanpa pembatasan bandwidth atau packet loss buatan. Spesifikasi router, Windows, HP, resolusi, DPI, dan versi aplikasi dicatat agar hasil dapat diulang. Gangguan jaringan diuji terpisah; target LAN sehat tidak dijanjikan untuk semua kondisi Wi-Fi.

### 13.3 Aksesibilitas dan penggunaan dasar

- Tindakan utama memiliki label aksesibel untuk TalkBack/VoiceOver; ikon bukan satu-satunya penjelasan.
- Status tidak bergantung warna/getaran saja; area sentuh mengikuti pedoman platform dan tetap dapat dipakai dengan teks diperbesar.
- Konfirmasi berisiko menyebut tindakan dan komputer tujuan, dengan pilihan batal jelas.
- Mendukung orientasi/ukuran viewport tanpa salah koordinat meskipun landscape belum dipoles sebagai fitur tambahan.
- Antarmuka awal diusulkan Bahasa Indonesia. Bahasa lain **TBD — validasi kebutuhan distribusi**; jangan menyamakan bahasa antarmuka dengan kemampuan teks Unicode.
- Tidak mengklaim seluruh desktop remote dapat diakses penuh pembaca layar HP; cakupan aksesibilitas tampilan remote perlu diuji dan batas diumumkan.

### 13.4 Pengukuran penggunaan dan monetisasi

- 1.000–10.000 pengguna adalah titik evaluasi bisnis, bukan janji pertumbuhan atau otomatisasi penambahan iklan.
- Definisi pengguna aktif vs total instalasi: **TBD — tentukan sebelum mengevaluasi ambang monetisasi**.
- MVP tidak memerlukan telemetry cloud. Ukur usability lewat studi berizin dan feedback sukarela; angka store boleh dipakai dengan batasnya, bukan dianggap pengguna aktif.
- Jika analytics ditambahkan kelak, lakukan review persetujuan, data minimum, retensi, serta kebijakan privasi terlebih dahulu.

## 14. Milestone hasil dan gate rilis

Tidak ada tanggal yang dijanjikan. Milestone menyatakan hasil pengguna, bukan daftar pekerjaan teknis.

| Milestone | Hasil yang harus terbukti | Status |
|---|---|---|
| M1 — Kebutuhan dapat diuji | Arti ikon referensi, baseline dukungan, dan target uji disepakati; hipotesis persona diuji | Belum dimulai |
| M2 — Akses lokal dapat dipercaya | Pairing pertama, koneksi ulang, penolakan perangkat asing, pencabutan, dan penghentian sesi bekerja | Belum dimulai |
| M3 — Kontrol inti dapat dipakai | Dua mode mouse, keyboard, dan tampilan layar memenuhi tugas serta target acuan | Belum dimulai |
| M4 — Cakupan wajib lengkap | Seluruh panel referensi, clipboard, media/browser/aplikasi, dan daya lulus matriks | Belum dimulai |
| M5 — Siap publik | Uji pengguna, keamanan/privasi, kompatibilitas, paket distribusi, dan informasi bantuan lulus | Belum dimulai |

### Gate rilis publik

- [ ] Baseline OS/perangkat/browser/aplikasi didokumentasikan dan diuji.
- [ ] Semua ikon referensi terpetakan; tidak ada placeholder fungsi wajib.
- [ ] Android dan iOS sama-sama lulus tugas inti serta seluruh fitur yang dijanjikan.
- [ ] Pairing mudah, input responsif, dan stabilitas memenuhi target yang sudah disetujui.
- [ ] Tidak ada temuan keamanan kritis/tinggi yang belum ditangani: akses tanpa izin, kebocoran data, replay, atau pencabutan gagal.
- [ ] Putus sesi, lock/background, dan perubahan monitor tidak meninggalkan input tertahan atau klik salah pada gambar basi.
- [ ] Review privasi membuktikan tidak ada pengiriman isi layar/clipboard/ketikan ke pihak luar.
- [ ] Kebijakan privasi, deklarasi data/izin store, kanal distribusi, keaslian paket, dan informasi dukungan tersedia.
- [ ] Batas DRM, UAC, jaringan terisolasi, sesi desktop, dan kompatibilitas media disampaikan sebelum pengguna bergantung padanya.
- [ ] Aset visual memiliki hak penggunaan yang sah.

## 15. Risiko tersisa

Penilaian kemungkinan berikut bersifat kualitatif awal, bukan statistik kejadian.

| Risiko | Kemungkinan | Dampak | Mitigasi / validasi |
|---|---|---|---|
| Scope besar untuk solo developer | Tinggi | Peluncuran tertunda dan kualitas tak merata | Milestone berurutan; fitur tambahan ditahan; fungsi wajib tetap gate publik |
| Android/iOS berbeda dalam izin, keyboard, background, clipboard | Tinggi | Pengalaman tidak konsisten | Uji fisik kedua platform sejak validasi inti; jangan mengandalkan emulator |
| Screen preview membebani baterai/panas | Sedang–tinggi | Sesi tak nyaman atau aplikasi dihentikan OS | Uji 60 menit dan ukur daya/panas; jangan streaming ketika background atau tidak diminta |
| Pairing palsu/replay atau pencabutan tak efektif | Perlu diuji | Kontrol komputer dan kebocoran data | SEC-01–SEC-08 menjadi gate, review keamanan sebelum publik |
| Clipboard/desktop mengandung data sensitif | Tinggi | Paparan informasi pribadi | Pengiriman eksplisit, indikator, stop, log tersanitasi; jelaskan batas clipboard OS |
| DRM/UAC disalahpahami sebagai bug | Tinggi | Ekspektasi keliru | Batas produk jelas, deteksi/komunikasi kegagalan, tanpa bypass |
| Router/VPN/firewall memblokir | Tinggi | Pairing berhasil scan tetapi koneksi gagal | Panduan keterjangkauan; tanpa menjanjikan semua router atau mematikan proteksi |
| Kontrol media/browser bergantung aplikasi | Tinggi | Tombol tidak bekerja/salah target | Matriks dukungan, target terlihat, uji regresi pada aplikasi yang diklaim |
| Sulit menunjukkan keunggulan dari kompetitor | Belum diketahui | Adopsi rendah | Wawancara calon pengguna dan uji tugas dibanding alur mereka saat ini |
| Distribusi/signing dan biaya store | Perlu validasi | Rilis tertahan meski produk gratis | Validasi kebijakan/biaya dan kanal resmi sebelum menjanjikan tanggal |

## 16. Keputusan terbuka dan langkah validasi

Pertanyaan berikut tidak membatalkan keputusan discovery. Tidak ada jawaban yang dibuat-buat sebagai keputusan pengguna.

| ID | Hal yang belum pasti | Usulan / cara validasi | Blocker |
|---|---|---|---|
| OQ-01 | Pembeda dari aplikasi referensi dan kebutuhan pengguna lain | Wawancara pengguna Remote Mouse/sejenis; validasi dua profil serta alasan berpindah | Sebelum klaim positioning publik |
| OQ-02 | Makna seluruh ikon media/jendela | Pemilik produk memeragakan aplikasi referensi dan memberi nama aksi; lengkapi checklist | Sebelum pembekuan scope/desain |
| OQ-03 | Versi minimum Android/iOS/Windows, x64/ARM | Uji kelayakan dan perangkat sasaran; usulan awal Windows 11 x64 | Sebelum komitmen kompatibilitas |
| OQ-04 | Aplikasi media/browser/peluncur yang dijamin | Tetapkan matriks bernama, termasuk Chrome/Edge dan Netflix/YouTube yang diuji | Sebelum rilis publik |
| OQ-05 | Persetujuan pasangan baru di Windows dan QR 120 detik | Uji pairing dengan pengguna baru; nilai manfaat keamanan vs langkah tambahan | Sebelum desain pairing final |
| OQ-06 | Satu sesi aktif, batas lock/background, dan monitor pilihan | Validasi skenario rumah; usulan di FR-03/FR-04 | Sebelum desain sesi final |
| OQ-07 | Target latensi, keterbacaan, stabilitas dan batas teks 100 KB | Uji prototipe pada perangkat fisik, kalibrasi angka bagian 13 | Sebelum gate rilis disahkan |
| OQ-08 | Bahasa UI dan aksesibilitas remote desktop | Uji Bahasa Indonesia, font besar, TalkBack/VoiceOver; dokumentasikan batas | Sebelum rilis publik |
| OQ-09 | Kanal distribusi, signing, kebijakan privasi, biaya | Verifikasi aturan platform terbaru dan biaya nyata; jangan diasumsikan gratis | Sebelum pengumuman rilis |
| OQ-10 | Definisi 1.000–10.000 pengguna dan arah monetisasi | Tetapkan metrik serta metode ukur yang menjaga privasi; keputusan iklan/freemium terpisah | Bukan blocker MVP gratis |

## 17. Definisi selesai dokumen

PRD siap menjadi acuan perencanaan setelah pemilik produk menyetujui usulan batas penting dan menutup blocker scope/kompatibilitas yang relevan. Dokumen ini sudah menyatukan kebutuhan yang diketahui, tetapi belum membuktikan kelayakan teknis, permintaan pasar, performa, keamanan implementasi, atau kelulusan store.

**Status akhir: draf PRD untuk review. Tidak ada kode, arsitektur, jadwal rilis, atau hasil pengujian yang dinyatakan selesai.**
