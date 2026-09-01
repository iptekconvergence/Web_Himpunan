# Project Organisasi

Aplikasi ini dibangun menggunakan framework [Laravel](https://laravel.com) dan dilengkapi dengan Vite & Tailwind CSS untuk tampilan antarmukanya.

Berikut adalah panduan lengkap cara melakukan *clone* (mengunduh) dan menjalankan *project* ini di komputer lokal Anda.

## Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda telah terinstal:
- [PHP](https://www.php.net/downloads.php) (Sesuai dengan versi yang dibutuhkan Laravel)
- [Composer](https://getcomposer.org/) (Untuk mengelola dependensi PHP)
- [Node.js & npm](https://nodejs.org/) (Untuk mengelola dependensi frontend seperti Vite & Tailwind CSS)
- [Git](https://git-scm.com/) (Untuk melakukan clone repository)

## Panduan Instalasi (Cara Menjalankan Project)

Ikuti langkah-langkah berikut secara berurutan di Terminal / Command Prompt Anda:

### 1. Clone Repository
Pertama, clone *repository* ini ke dalam folder komputer Anda (misalnya di dalam `htdocs` jika Anda menggunakan XAMPP).
```bash
git clone <URL_GITHUB_REPOSITORY_ANDA>
cd organisasi
```
> **Catatan:** Ganti `<URL_GITHUB_REPOSITORY_ANDA>` dengan link repository GitHub yang asli.

### 2. Install Dependensi PHP (Composer)
Install semua package (vendor) Laravel yang dibutuhkan oleh project ini:
```bash
composer install
```

### 3. Install Dependensi Frontend (NPM)
Install package (node_modules) untuk Vite, Tailwind, dll:
```bash
npm install
```

### 4. Konfigurasi Environment (File `.env`)
Salin file `.env.example` menjadi `.env`. File ini menyimpan konfigurasi penting seperti koneksi database.
- Jika menggunakan Windows (Command Prompt):
  ```bash
  copy .env.example .env
  ```
- Jika menggunakan Mac/Linux/Git Bash:
  ```bash
  cp .env.example .env
  ```

### 5. Generate Application Key
Generate `APP_KEY` unik untuk aplikasi Laravel:
```bash
php artisan key:generate
```

### 6. Konfigurasi Database & Migrasi
Secara default, aplikasi ini menggunakan database **SQLite**. 
Jalankan perintah migrasi untuk membuat tabel-tabel di database:
```bash
php artisan migrate
```
> **Catatan:** Jika muncul prompt yang menanyakan *"Would you like to create it?"* (karena file `database/database.sqlite` belum ada), ketik **yes** dan tekan Enter.

### 7. Jalankan Server Development
Anda perlu menjalankan **dua perintah** secara bersamaan (di dua tab terminal yang berbeda) untuk menjalankan backend (Laravel) dan frontend (Vite).

**Terminal 1 (Menjalankan server Laravel):**
```bash
php artisan serve
```
> Server Laravel akan berjalan di: `http://localhost:8000` atau `http://127.0.0.1:8000`

**Terminal 2 (Menjalankan server Vite untuk memproses CSS/JS):**
```bash
npm run dev
```

---

Aplikasi sekarang sudah berhasil dijalankan! Silakan buka `http://localhost:8000` di browser Anda.
