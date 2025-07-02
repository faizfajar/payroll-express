## Overview

Proyek ini adalah simulasi sistem penggajian (payslip) yang melibatkan komponen attendance, lembur, dan reimbursement untuk para karyawan. Sistem ini dapat digunakan untuk:

* Menentukan periode payroll untuk penggajian bulanan/tahunan.
* Mencatat kehadiran dan lembur karyawan.
* Mengajukan klaim reimbursement.
* Menghasilkan payslip dan laporan rekap admin.

---

## Tech Stack

* **Backend**: Node.js
* **Database**: PostgreSQL
* **Testing**: Jest, Postman
* **Data Format**: JSON over HTTP API

---

## Features Checklist

| Feature               | Deskripsi                                                  | Status |
| --------------------- | ---------------------------------------------------------- | ------ |
| Seed 101 fake users   | Data awal untuk testing, 100 karyawan + 1 admin.           | ✅      |
| Seed 100 karyawan     | Data karyawan untuk pengujian.                             | ✅      |
| Payroll Period        | Input periode payroll oleh admin/karyawan.                 | ✅      |
| Attendance submission | Submit kehadiran (hanya di hari kerja).                    | ✅      |
| Reimbursement         | Karyawan ajukan klaim reimbursement.                       | ✅      |
| Lembur                | Karyawan ajukan permintaan lembur.                         | ✅      |
| Process Payroll       | Admin memproses payroll berdasarkan periode tertentu.      | ✅      |
| Karyawan Payslip      | Breakdown penghasilan berdasarkan attendance, lembur, dll. | ✅      |
| Admin Summary         | Ringkasan total take-home pay semua karyawan.              | ✅      |
| Audit Log             | Mencatat semua aksi perubahan (create/update/delete)       | ✅      |

---

## Authentication

Menggunakan login sederhana berbasis JWT token.

**Roles:**

* `admin`
* `employee`

---

## Setup & Instalasi

```bash
git clone https://github.com/faizfajar/payroll-express.git
cd payroll-express
npm install

# Konfigurasi .env (lihat env.example)
cp env.example .env
# Sesuaikan nama database (contoh: salary-system)

# Migrasi dan seed data
db:migrate: npm run db:migrate
db:seed   : npm run db:seed

# Jalankan server
development: npm run dev
```

---

## Testing

### Via Jest

```bash
# Siapkan DB test sesuai .env (DB_NAME_TEST)
npx sequelize-cli db:migrate --env test
npx sequelize-cli db:seed:all --env test

# Jalankan semua test:
npm run test

# Jalankan test spesifik:
npm run test {filename}
# Contoh: npm run test overtime
```

### Via Postman

1. Import file koleksi Postman: `Payroll System Docs.postman_collection` (v2.1)
2. Login menggunakan akun berikut:

   * admin / admin
   * employee1 s.d. employee100 / password
3. Setelah login, copy token dari response dan masukkan ke Environment Variable Postman dengan key: `TOKEN`

---

## Alur Pengujian (Postman)

### 1. Payroll Period

* Buat data periode payroll (1 seeder sudah disiapkan).
* Data ini akan digunakan sebagai master payroll period.

### 2. Payroll-Period-Karyawan

* Buat mapping antara karyawan dan payroll period.
* Default-nya kosong, penguji bisa memilih karyawan mana yang ingin digaji.

### 3. Schedule (Optional)

* Digunakan untuk mendefinisikan shift karyawan.
* Default: semua karyawan masuk 09:00 - 17:00.
* Bisa ditambah lalu update `schedule_id` karyawan.
* Berguna untuk validasi lembur (tidak boleh lebih awal dari jam kerja).

### 4. Lembur

* Ajukan lembur dengan tanggal, waktu mulai dan selesai.
* Durasi lembur otomatis dihitung jika waktu valid.

### 5. Reimbursement

* Ajukan reimbursement dengan tanggal, nominal, dan deskripsi.

### 6. Absensi

* Submit absensi (tidak bisa di hari weekend).
* Double submit tetap dihitung 1x saat proses payroll.

### 7. Proses Payroll

* Jalankan proses payroll berdasarkan payroll-period tertentu.
* Akan menghitung: attendance, overtime, reimbursement, base\_salary, prorated\_salary.

### 8. Payslip Karyawan

* Generate slip gaji berdasarkan periode payroll.
* Hanya untuk karyawan yang sedang login.

### 9. Rekap Admin

* Admin bisa melihat ringkasan semua slip gaji dari seluruh karyawan.
* Hanya bisa diakses oleh role `admin`.

---

## Audit Log

Sistem mencatat seluruh perubahan penting (create, update, delete) ke dalam tabel audit untuk memudahkan:

* Pelacakan histori data
* Debugging dan audit keamanan
* Integrasi dengan monitoring/logging tools

Setiap log mencatat:

* `table`: Nama tabel yang dimodifikasi
* `record_id`: Primary key dari data
* `action`: Jenis aksi (create/update/delete)
* `user_id`: Siapa yang melakukan aksi
* `ip_address`: Alamat IP pengakses
* `request_id`: UUID untuk tracing per-request
