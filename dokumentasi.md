# GF(2) Inverse Calculator

Kalkulator Inverse GF(2) adalah sebuah aplikasi berbasis web yang digunakan untuk menghitung nilai invers dari suatu polinomial biner dalam *Galois Field* GF(2). Aplikasi ini mengimplementasikan **Extended Euclidean Algorithm** dan sangat berguna untuk pembelajaran kriptografi, khususnya dalam perhitungan matematika yang mendasari algoritma AES (Advanced Encryption Standard).

## 🚀 Live Demo
Aplikasi ini dapat diakses secara langsung melalui:
**[https://kalkulator-inverse-gf2.vercel.app](https://kalkulator-inverse-gf2.vercel.app)**

## ✨ Fitur Utama
1. **Perhitungan Inverse GF(2)**: Menghitung nilai invers dari polinomial biner terhadap modulus yang ditentukan.
2. **Preset AES**: Menyediakan tombol sekali klik untuk memuat contoh modulus standar AES (`100011011`).
3. **Audit Log Iterasi**: Menampilkan jejak langkah-langkah (iterasi) dari *Extended Euclidean Algorithm*, termasuk pembagian bersusun `r0 / r1`, sisa bagi (residue), dan pembaruan koefisien.
4. **Validasi Input**: Mendukung normalisasi *leading zero* dan mencegah input modulus bernilai nol.

## 🛠️ Teknologi yang Digunakan
Proyek ini dibangun menggunakan teknologi dasar web (Vanilla) agar ringan dan mudah dipahami:
- **HTML5**: Struktur utama antarmuka kalkulator.
- **CSS3 (Vanilla)**: Styling antarmuka, responsivitas, dan estetika visual modern.
- **JavaScript (ES6)**: Logika matematika untuk operasi polinomial (XOR, bit-shift) dan algoritma Euclidean.

## 📝 Aturan Operasi GF(2)
Dalam *Galois Field* GF(2), operasi aritmatika memiliki aturan khusus:
- Penjumlahan dan pengurangan polinomial dilakukan menggunakan operasi **XOR**.
- Perkalian dilakukan dengan *bit-shift* sesuai pangkat lalu dijumlahkan dengan **XOR**.
- Suatu nilai `a` memiliki inverse terhadap `modulus` hanya jika nilai **GCD (Greatest Common Divisor)** antara keduanya adalah 1.

## 💻 Cara Menjalankan Secara Lokal
Karena proyek ini hanya menggunakan HTML, CSS, dan JavaScript murni, kamu tidak perlu menginstal server khusus untuk menjalankannya.

1. Buka folder proyek ini di komputermu.
2. Klik dua kali pada file `index.html` untuk membukanya di browser.
3. (Opsional) Jika menggunakan VS Code, kamu bisa menggunakan ekstensi **Live Server** untuk membukanya.

## 🌐 Cara Deployment
Proyek ini di-hosting menggunakan Vercel. Untuk melakukan *update* ke website publik:
1. Pastikan perubahan sudah di-commit ke Git.
2. Lakukan `git push` ke GitHub (jika repository sudah terhubung otomatis ke Vercel).
3. Atau jalankan perintah `npx vercel --prod` di terminal jika ingin melakukan deploy manual via Vercel CLI.

---
*Dibuat untuk Tugas Kriptografi Kelompok 5 (KriptoKel5).*
