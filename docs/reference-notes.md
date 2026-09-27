# Referensi visual dan gerak

Referensi: https://www.stabondar.com/ dan screenshot pengguna.

## Teramati langsung

Pemeriksaan ulang 27 September 2026 berhasil memuat situs aslinya. Body memakai cursor crosshair; link memakai pointer. Ada scramble huruf, outline nama besar, koordinat redup, komposisi asimetris, cahaya merah organik, foto yang terdistorsi, serta tekstur dither pada hover. Scroll juga mengungkap adegan huruf berjatuhan dan komposisi penghargaan; adegan penghargaan tidak relevan dengan data portofolio ini.

## Implementasi portofolio

Struktur galeri, About, Contact, data Nayat, dan foto pengguna dipertahankan. Gerak pointer memakai field GPU bersama dengan decay; vertex shader menarik siluet foto dan outline nama, fragment shader mengolah tekstur foto dan cahaya. Metadata memakai scramble dan pergeseran lokal huruf; navigasi memakai magnetic easing, foto dan caption memakai parallax scroll. Mobile/touch dan reduced motion memiliki fallback DOM.

Pilihan cursor crosshair mengikuti observasi situs asli dan permintaan terakhir untuk mendekati referensi, menggantikan rancangan cursor lingkaran dalam prompt awal. Implementasi shader, durasi, amplitudo, parallax, dan magnetic ditulis sendiri. Tidak menyalin source code, identitas, penghargaan, atau aset foto referensi. Ini bukan klaim kecocokan pixel-per-pixel atau simulasi fisika identik.
