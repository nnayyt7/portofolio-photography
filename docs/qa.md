# Pemeriksaan hasil

Tanggal: 27 September 2026. Lingkungan: Windows, Node 24.20.0, npm 11.19.0, browser Chromium dalam Codex. Pengujian dilakukan pada dev server 5173 dan hasil build melalui `npm run preview` di port 4173.

## Build dan data

- `npm install`: berhasil; audit saat instalasi melaporkan 0 vulnerabilities.
- `npm run check`: berhasil untuk 12 foto lokal, metadata wajib, ID unik, data identitas, dan aset fallback.
- `npm run build`: berhasil setelah perbaikan konfigurasi manualChunks untuk Vite 8.
- `npm run preview`: berhasil, HTML/CSS/font/foto/chunk shader disajikan dari build produksi.
- Ada peringatan ukuran chunk WebGL sekitar 524 kB sebelum gzip (sekitar 130 kB gzip). Chunk ini dimuat terpisah hanya pada perangkat/viewport yang mengaktifkan efek. Peringatan ini bukan error build.

## Responsivitas

Ketujuh viewport berikut diperiksa melalui pengukuran DOM. Tidak ada scrollWidth yang melebihi lebar viewport, tanpa menyembunyikan overflow horizontal pada body.

| Viewport | scrollWidth | Overflow horizontal |
| --- | ---: | --- |
| 1920 × 1080 | 1905 | Tidak |
| 1440 × 900 | 1425 | Tidak |
| 1024 × 768 | 1009 | Tidak |
| 768 × 1024 | 753 | Tidak |
| 390 × 844 | 375 | Tidak |
| 360 × 800 | 345 | Tidak |
| 844 × 390 | 829 | Tidak |

Selisih 15px berasal dari scrollbar/gutter browser. Tampilan hero, galeri, menu, viewer, dan Contact diperiksa secara visual pada desktop dan/atau mobile. Pengukuran tujuh viewport tidak berarti pengujian pada tujuh perangkat fisik.

## Interaksi yang diperiksa

- Menu fullscreen terbuka, link dapat dipilih, dan fokus Shift+Tab berputar kembali di dalam dialog.
- Navigasi menu diuji pada desktop dan mobile. Diperbaiki kondisi ketika ukuran dokumen sementara berubah selama scroll lock: Lenis sekarang menghitung ulang ukuran setelah body dibuka.
- Viewer menampilkan foto portrait dan landscape, tombol Next/Previous tersedia, ArrowRight mengganti foto, Esc menutup, fokus kembali ke tombol foto asal, dan posisi scroll dipulihkan.
- Cursor sekarang crosshair pada body dan pointer pada link/button, mengikuti pemeriksaan situs asli. Caption dan corner marker tetap berubah accent.
- Foto terlihat di canvas WebGL, shader compile tidak menghasilkan error pada browser pengujian, dan DOM frame ditandai GPU-ready setelah render. Uniform reveal selesai pada nilai 1.
- Pointer melintasi tepi foto diuji melalui gesture browser; efek shader menggunakan vertex displacement untuk siluet dan UV displacement untuk isi foto. Amplitudo gerakan dinamis belum diukur secara kuantitatif.
- Tombol copy pada Contact menampilkan COPIED setelah clipboard berhasil ditulis.
- Navigasi kembali ke atas dan scroll panjang tetap tersedia.

## Fixture terpisah

`qa/fixture.html` menguji tanpa mengganti data halaman utama:

- Nama, wordmark, judul foto, dan email panjang.
- Path foto yang sengaja salah: fallback SVG muncul pada galeri dan viewer.
- Rasio frame square.
- Mode tanpa animasi (`motion.enabled = false`): tidak ada canvas, semua foto tetap terlihat, menu/viewer/anchor tetap berfungsi.
- Social URL kosong: tidak muncul link kosong atau href="#" palsu.

Pada fixture 360px, tidak ditemukan overflow horizontal. Request 404 untuk gambar yang sengaja hilang adalah bagian dari uji fallback.

## Perbaikan saat pemeriksaan

- Konfigurasi chunk Vite 8.
- Nama aksesibel pada teks scramble.
- Reset cursor ketika overlay berubah dan pemeriksaan null saat cleanup.
- Pengembalian posisi scroll serta navigasi setelah overlay ditutup.
- Pengukuran ulang Lenis sesudah scroll lock.
- Batas efek berat pada viewport mobile.
- Caption panjang dapat membungkus teks.
- Foto yang sempat gagal dapat pulih ketika path diperbaiki.
- Reveal foto tersinkron antara DOM dan shader.
- Label kecil Contact dipindahkan agar tidak tertutup navigasi tetap pada desktop.

## Batas pengujian

- Belum diuji pada perangkat sentuh fisik, Safari/iOS, atau browser selain Chromium.
- Jalur mode reduced motion diuji melalui pengaturan proyek; preferensi aksesibilitas OS pengguna tidak diubah.
- Kegagalan GPU/context loss mempunyai fallback dalam kode, tetapi kehilangan context hardware tidak dipaksakan pada perangkat pengguna.
- Tidak dilakukan benchmark FPS/Lighthouse atau klaim pixel-perfect terhadap situs referensi. Situs referensi berhasil diperiksa ulang setelah sebelumnya mengalami error loader.
- Gesture swipe pada perangkat fisik dan preview kategori yang mengikuti pointer belum diuji menyeluruh.
- Foto pengguna sudah dipakai. Email masih contoh; metadata foto dapat disesuaikan pemilik sebelum publikasi.

Screenshot hasil berada di `docs/screenshots/`. `reference-notes.md` membedakan detail yang benar-benar terlihat dari interpretasi implementasi.

## Revisi interaksi dengan foto pengguna

- Build dan content check kembali berhasil; 12 sumber foto pengguna tetap ada, tidak diganti atau dikompresi di disk.
- Chromium production preview: crosshair terverifikasi melalui computed style. Shader foto/glow/wordmark terkompilasi tanpa error konsol.
- Gesture pointer pada foto memperlihatkan tepi melengkung dan tekstur dither; klik setelah hover tetap membuka viewer.
- Pointer flow memakai ping-pong texture; salinan gambar untuk GPU dibatasi 2048px, file asli tetap dipakai viewer.
- Parallax foto dan caption bergerak bersama; koordinat dan cahaya hero memakai lapisan scroll terpisah.
- Breakpoint 360x800, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080 kembali diperiksa tanpa overflow horizontal. Pada 390px canvas dinonaktifkan.
- Diperbaiki selector span hero yang membuat huruf bertumpuk; konflik opacity koordinat antara intro dan ScrollTrigger; layer outline dekoratif yang menghalangi klik scroll cue.
- Magnetic dan teks/garis reaktif dibatasi pointer presisi dan lebar >=768px. Perangkat sentuh fisik dan Safari belum diuji.
