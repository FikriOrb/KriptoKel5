# Penjelasan Materi Kriptografi: GF(2) Inverse

Proyek **GF(2) Inverse Calculator** ini dibuat berdasarkan materi aritmatika *Finite Field* (Lapangan Berhingga), khususnya *Galois Field* GF(2) dan GF(2^8) yang merupakan fondasi matematika utama dari algoritma kriptografi modern seperti **AES (Advanced Encryption Standard)**.

Berikut adalah penjelasan konsep-konsep kunci yang digunakan dalam proyek ini:

---

## 1. Apa itu Galois Field GF(2)?
*Galois Field* (GF) adalah sistem matematika di mana jumlah elemennya terbatas, namun kita tetap bisa melakukan operasi dasar seperti penjumlahan, pengurangan, perkalian, dan pembagian secara konsisten (selalu menghasilkan elemen yang berada di dalam field tersebut).

Dalam GF(2), hanya terdapat dua elemen: **0 dan 1**. 
Karena itu, operasi penjumlahannya setara dengan operasi **XOR (Exclusive-OR)**:
- 0 + 0 = 0
- 1 + 1 = 0 (Karena 1+1 = 2, dan 2 mod 2 = 0)
- 1 + 0 = 1
- 0 + 1 = 1

*(Catatan: Dalam GF(2), pengurangan bernilai sama persis dengan penjumlahan, karena a - b = a + b).*

## 2. Representasi Polinomial
Di dalam GF(2^8), angka biasanya tidak dipandang sebagai bilangan bulat biasa (integer), melainkan sebagai **Polinomial** di mana koefisiennya hanya boleh angka 0 atau 1.

Sebagai contoh, bit `1010011`:
Bisa direpresentasikan menjadi:
$$1 \cdot x^6 + 0 \cdot x^5 + 1 \cdot x^4 + 0 \cdot x^3 + 0 \cdot x^2 + 1 \cdot x^1 + 1 \cdot x^0$$
Atau ditulis:
$$x^6 + x^4 + x + 1$$

Setiap operasi aritmatika (seperti pada AES) sejatinya adalah perkalian atau penjumlahan polinomial.

## 3. Modulus AES (Irreducible Polynomial)
Ketika dua buah polinomial GF(2^8) dikalikan, hasilnya bisa melampaui 8 bit (misalnya derajat $x^8$ atau lebih besar). Agar hasilnya tetap konsisten berada di dalam GF(2^8), kita harus membaginya dengan sebuah "Modulus" dan mengambil sisa baginya (modulo).

Modulus yang dipakai harus berupa **Irreducible Polynomial** (polinomial prima yang tidak bisa difaktorkan lagi).
AES menetapkan standar *irreducible polynomial* yaitu:
$$m(x) = x^8 + x^4 + x^3 + x + 1$$
Dalam bentuk biner (biner 9 bit), ini direpresentasikan sebagai:
**`100011011`**

Dalam kalkulator ini, nilai inilah yang dipakai secara default pada kolom *Modulus*.

## 4. Multiplicative Inverse (Invers Perkalian)
Dalam kriptografi (khususnya untuk membuat komponen *S-Box* di AES), kita seringkali perlu mencari invers perkalian dari suatu angka. 
Suatu nilai $B(x)$ adalah invers dari $A(x)$ jika:
$$A(x) \cdot B(x) \equiv 1 \pmod{m(x)}$$

Untuk menemukan $B(x)$, tidak bisa menggunakan pembagian biasa. Di sinilah kita menggunakan algoritma yang disebut **Extended Euclidean Algorithm**.

## 5. Extended Euclidean Algorithm (EEA)
EEA adalah metode berulang (iteratif) untuk menemukan pembagi persekutuan terbesar (Greatest Common Divisor / GCD) sekaligus mencari koefisien invers.

Alurnya (seperti yang terlihat pada tabel audit log kalkulator kita):
1. Kita mulai dengan nilai `r0` (Modulus) dan `r1` (Nilai yang dicari inversnya).
2. Tentukan `t0 = 0` dan `t1 = 1`. (Variabel $t$ ini yang akan melacak nilai invers).
3. Lakukan iterasi selama `r1` bukan 0:
   - Bagi `r0` dengan `r1` untuk mendapatkan hasil bagi (`q`) dan sisa bagi (`r`). *(Pembagian menggunakan XOR dan shift bit).*
   - Hitung nilai $t$ baru: `t = t0 XOR (q * t1)`.
   - Lakukan pergeseran nilai untuk iterasi berikutnya: `r0 = r1`, `r1 = r`, `t0 = t1`, `t1 = t`.
4. Saat iterasi selesai, jika nilai `r0` (yaitu GCD) adalah 1, maka inversnya ditemukan di dalam `t0`.
5. Jika GCD bukan 1, maka angka tersebut tidak memiliki invers terhadap modulus tersebut.

## 6. Bagaimana Kalkulator Ini Bekerja
Saat kamu menekan tombol "Calculate Inverse":
1. Kalkulator membaca input biner dan mengonversinya ke representasi polinomial internal.
2. Proses pembagian panjang (Long Division) dijalankan bit-demi-bit (seperti operasi shift register).
3. Setiap langkah `q` dan `r` didata, lalu di-XOR ke dalam variabel pelacak (auxiliary) `t`.
4. Logika ini dicetak dalam format tabel untuk mempermudah tugas matematika secara manual, memungkinkan pengguna memeriksa setiap siklus pembagian `r0` dan `r1`.
