# Nayat — Photography & Visual Stories

Portofolio fotografi React + Vite dengan galeri asimetris, animasi GSAP, Lenis, cursor crosshair, shader foto Three.js, menu fullscreen, dan photo viewer. Foto pengguna dan font disajikan secara lokal.

## Menjalankan

Gunakan Node.js **22.12+** atau **24+**. Proyek diperiksa menggunakan Node 24.20.0.

Buka terminal di folder ini:

```powershell
cd "C:\Users\Asus\Downloads\Portofolio Photography"
npm install
npm run dev
```

Buka alamat localhost yang ditampilkan terminal. Untuk instalasi persis sesuai lockfile, gunakan `npm ci`.

Build produksi:

```sh
npm run check
npm run build
npm run preview
```

Hasil build berada di `dist/`. Jalankan melalui HTTP server, bukan membuka `dist/index.html` langsung dengan `file://`. Konfigurasi `base: './'` mendukung penyajian dari subfolder.

## Mengganti identitas

Edit **`src/data/site.js`**:

```js
name: 'Nama Kamu',
wordmark: 'namakamu',
role: 'Photographer',
secondaryRole: 'Visual storyteller',
location: 'Kota, Indonesia',
email: 'halo@domainkamu.com',
socials: [
  { label: 'Instagram', url: 'https://www.instagram.com/username/' },
  { label: 'WhatsApp', url: 'https://wa.me/6281234567890' },
  { label: 'LinkedIn', url: '' },
],
```

Link sosial kosong tidak ditampilkan. Isi URL lengkap dengan `https://`. `wordmark` adalah tulisan outline dekoratif; gunakan nama pendek untuk komposisi yang nyaman. `name` tetap boleh berupa nama lengkap. Edit juga `seoDescription`, deskripsi About, fokus, tahun, dan teks di file yang sama.

`profilePhotoId` memilih ID foto untuk bagian About. Kosongkan menjadi `''` jika belum ingin menampilkan foto profil. Konfigurasi saat ini memakai foto profil dan foto fotografi yang sudah dimasukkan pengguna.

## Memasukkan foto

1. Simpan foto ke **`public/images/selected/`**, **`public/images/archive/`**, atau **`public/images/profile/`**.
2. Edit array **`src/data/photos.js`**.
3. Contoh satu foto:

```js
{
  id: 'cerita-pasar-01',
  title: 'Pagi di pasar',
  category: 'Street',
  year: '2026',
  src: '/images/selected/cerita-pasar.webp',
  alt: 'Pedagang menata sayuran di bawah cahaya pagi',
  width: 1600,
  height: 2000,
  focalPoint: '50% 40%',
  layout: 'portrait-left',
  featured: true,
}
```

Tidak perlu mengubah JSX untuk menambah foto. `id` harus unik dan tetap. Urutan array menentukan urutan viewer. `featured: true` memasukkan foto ke Selected Work; `false` memasukkannya ke Archive. Kategori/index dihitung otomatis dari data.

Untuk menghapus foto, hapus objeknya dari array. Jika foto itu dipakai sebagai `profilePhotoId`, pilih ID pengganti atau kosongkan nilainya.

Isi `width` dan `height` sesuai dimensi/aspect ratio gambar baru. Ukuran ini menyediakan ruang sebelum gambar dimuat, sehingga layout tidak meloncat. Untuk perubahan rasio dari portrait ke landscape, ubah keduanya dan pilih preset layout yang sesuai. `focalPoint` mengatur area penting ketika gambar perlu dicrop; viewer selalu memperlihatkan gambar utuh dengan `object-fit: contain`.

Foto yang gagal dimuat memakai `public/images/fallback.svg`. Foto utama tidak memerlukan API eksternal. Disarankan WebP/AVIF/JPG dengan sisi panjang sekitar 1600–2400px dan kompresi sesuai kebutuhan. Hindari memasukkan file RAW langsung.

Sesudah seluruh foto diganti dengan karya sendiri, ubah **`demoPhotos: false`** untuk menghilangkan catatan kecil foto demo di footer. Lihat `docs/asset-credits.md` untuk sumber foto contoh.

## Mengatur komposisi dan warna

- `src/data/layouts.js`: preset lebar/posisi galeri desktop, seperti `portrait-left`, `landscape-right`, `small-left`, `portrait-center`, `wide-left`, dan `portrait-right`.
- `src/styles/tokens.css`: warna, font, gutter, dan easing.
- `src/styles/layout.css`: komposisi section dan breakpoint.
- `src/styles/motion.css`: cursor dan respons interaktif.

Galeri mobile menggunakan alur vertikal yang dikurasi. Layout desktop tidak hanya diperkecil. Clipping dibatasi pada elemen dekoratif dan reveal foto; body tidak memakai `overflow-x: hidden` untuk menutupi masalah layout.

## Mengatur animasi

Di `src/data/site.js`:

```js
motion: {
  enabled: true,       // false: mode tenang, tanpa efek berat
  intensity: 0.85,     // gunakan kisaran 0–1 untuk distorsi foto
  smoothScroll: true, // false: gunakan scroll native
},
```

Crosshair, WebGL, dan smooth scroll hanya aktif dengan pointer presisi pada viewport setidaknya 768px. Touch tidak memakai smooth touch atau efek hover. `prefers-reduced-motion: reduce` menonaktifkan animasi utama dan loop. Mode ini tetap menampilkan semua foto dan kontrol.

Satu renderer Three.js melacak frame DOM. `PointerFlow.js` menyimpan jejak gerak pointer dalam dua render target bergantian, sehingga tarikan foto, outline nama, dan cahaya meluruh secara konsisten. Foto berubah menjadi tekstur cetak halus saat hover dan kembali berwarna saat pointer keluar. Salinan texture GPU dibatasi 2048px; file foto asli tidak diubah. Parallax foto dan caption mengikuti scroll pada desktop; magnetic link kembali dengan easing elastis dan scramble huruf tidak mengubah layout. Vertex shader membengkokkan tepi foto, fragment shader menyesuaikan tekstur, dan shader cahaya menghasilkan bentuk exposure merah. DOM image tetap menjadi fallback apabila WebGL tidak tersedia. Canvas dimuat terpisah ketika diperlukan; chunk Three.js lebih besar daripada komponen UI.

## Struktur

```text
src/components/   Navigasi, cursor, viewer, frame foto, garis interaktif
src/sections/     Hero, Work/Archive, About, Contact
src/effects/      Renderer bersama dan shader GLSL
src/hooks/        Preferensi gerak, scroll, fokus/scroll-lock overlay
src/data/         Identitas, fotografi, preset layout
src/styles/       Token, layout, responsive, motion
public/images/   Foto dan fallback lokal
public/fonts/    Lisensi font; file font dibundel dari dependency Fontsource
docs/            Referensi, kredit aset, hasil QA, screenshot
qa/              Fixture uji terpisah; tidak masuk build produksi
```

`scripts/fetch-demo-assets.mjs` hanya untuk mengunduh ulang foto demo saat pengembangan. Script ini tidak dipanggil ketika situs dijalankan. `npm run check` memeriksa metadata wajib, ID unik, path gambar lokal, serta fallback.

Fixture `http://127.0.0.1:5173/qa/fixture.html` menguji judul/nama panjang, gambar hilang, rasio square, dan mode gerak nonaktif tanpa mengubah konfigurasi halaman utama. Fixture ini hanya tersedia pada dev server.

## Interaksi

- MENU membuka navigasi fullscreen. Esc menutup; fokus keyboard tetap berada di overlay.
- Klik foto untuk melihat gambar utuh. Tombol Previous/Next dan ArrowLeft/ArrowRight mengganti foto. Esc menutup dan mengembalikan fokus serta posisi scroll.
- Tombol COPY menyalin email hanya setelah izin browser mengizinkan. Jika gagal, email tetap bisa diseleksi atau dibuka lewat mailto.
- Efek pointer bersifat tambahan; semua fungsi utama tetap tersedia tanpa hover.

Tidak ada backend, form pengiriman pesan, analytics, atau informasi prestasi rekaan. Sebelum menerbitkan, ganti email contoh, identitas, metadata dengan data sendiri; foto pengguna yang sudah terpasang tetap dipertahankan.
