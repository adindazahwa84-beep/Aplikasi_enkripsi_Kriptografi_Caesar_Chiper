# 🔐 Caesar Cipher Security Lab

Aplikasi web untuk mempelajari dan menerapkan algoritma **Caesar Cipher** — dibuat sebagai tugas mata kuliah **Keamanan Siber**.

Dibangun dengan **Python (Flask)**, **HTML**, **CSS**, dan **JavaScript**.

---

## ✨ Fitur

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Encryption** | Enkripsi plaintext → ciphertext dengan input teks dan nilai shift. Menampilkan proses perubahan huruf satu per satu. |
| 2 | **Decryption** | Dekripsi ciphertext → plaintext kembali dengan nilai shift yang sama. |
| 3 | **Brute Force Attack** | Mencoba seluruh 25 kemungkinan shift (1–25) dan menampilkan semua hasil dekripsi dalam tabel, beserta penjelasan kelemahan Caesar Cipher. |
| 4 | **Learn** | Penjelasan lengkap tentang kriptografi, Caesar Cipher, cara kerja, rumus, contoh, kelebihan, kekurangan, dan hubungannya dengan Keamanan Siber. |

---

## 📁 Struktur Folder

```
tugas1_siber/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── README.md
```

---

## 🚀 Cara Menjalankan

1. **Buka folder project**
   ```bash
   cd tugas1_siber
   ```

2. *(Opsional)* Buat virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate        # Windows
   # source venv/bin/activate   # Linux/macOS
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Jalankan aplikasi**
   ```bash
   python app.py
   ```

5. **Buka di browser**
   ```
   http://127.0.0.1:5000
   ```

---

## 🔣 Algoritma Caesar Cipher

### Rumus

| Operasi | Rumus |
|---------|-------|
| Enkripsi | **C = (P + K) mod 26** |
| Dekripsi | **P = (C − K) mod 26** |

Keterangan:
- **C** = Ciphertext
- **P** = Plaintext (A=0, B=1, ..., Z=25)
- **K** = Key / nilai shift
- **mod 26** = modulo panjang alfabet

### Contoh
Enkripsi `HELLO` dengan shift `K = 3`:
```
H (7)  + 3 = 10 → K
E (4)  + 3 =  7 → H
L (11) + 3 = 14 → O
L (11) + 3 = 14 → O
O (14) + 3 = 17 → R
```
Hasil: **HELLO → KHOOR**

---

## 🛡️ Aturan Implementasi

- ✅ Fungsi `encrypt_caesar(text, shift)`, `decrypt_caesar(text, shift)`, `brute_force(text)` diimplementasikan sendiri di `app.py`.
- ✅ Huruf besar/kecil **dipertahankan**.
- ✅ Spasi, angka, dan tanda baca **tidak berubah**.
- ✅ Shift > 26 tetap valid (gunakan `mod 26`).
- ✅ Input kosong divalidasi.
- ✅ Shift divalidasi sebagai angka.

---

## 🎨 Desain

- Tema **dark blue / dark purple**
- Font **Poppins** (Google Fonts)
- Layout **card** modern dan responsif
- Navigasi antar section: Encryption, Decryption, Brute Force, Learn
- Cocok untuk presentasi tugas mahasiswa Informatika

---

## 📚 Materi Pembelajaran (Learn)

Aplikasi ini mengajarkan prinsip penting Keamanan Siber:
> *Keamanan algoritma tidak boleh bergantung pada kerahasiaan algoritmanya, melainkan pada kerahasiaan kunci* — **Kerckhoffs's Principle**.

Caesar Cipher menjadi contoh algoritma yang **tidak aman** karena:
- Ruang kunci sangat kecil (hanya 25 kemungkinan).
- Mudah diretas dengan brute force dalam hitungan detik.
- Rentan terhadap analisis frekuensi huruf.

Pemahaman kelemahan ini menjadi dasar mengapa algoritma modern seperti **AES** dan **RSA** menggunakan kunci yang jauh lebih panjang dan kompleks.

---

## 🧪 Contoh Pengujian

| Operasi | Input | Shift | Hasil |
|---------|-------|-------|-------|
| Encrypt | `HELLO` | 3 | `KHOOR` |
| Decrypt | `KHOOR` | 3 | `HELLO` |
| Brute Force | `KHOOR` | — | Shift 22 → `HELLO` |

---

## 👨‍💻 Teknologi

- **Python 3** + **Flask** (backend & API)
- **HTML5** (struktur)
- **CSS3** (desain, responsif, animasi)
- **JavaScript (Vanilla)** (interaksi & fetch API)

---

> Tugas Keamanan Siber — Caesar Cipher Security Lab
