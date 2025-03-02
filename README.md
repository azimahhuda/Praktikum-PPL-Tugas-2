## Simple Database Node.js

### Deskripsi

Program ini adalah aplikasi berbasis Node.js yang berfungsi sebagai database sederhana untuk menyimpan data penyanyi dan lagu dalam format JSON. Pengguna dapat menambahkan penyanyi, menambahkan lagu, melihat daftar lagu berdasarkan penyanyi, mengedit detail lagu, serta melihat informasi detail dari sebuah lagu.

### Fitur

- Menampilkan daftar penyanyi yang tersedia.
- Menambahkan penyanyi baru ke database.
- Menampilkan daftar lagu berdasarkan penyanyi tertentu.
- Menambahkan lagu baru dengan informasi seperti judul, genre, penulis, dan tahun rilis.
- Melihat detail lengkap dari sebuah lagu berdasarkan ID.
- Mengedit informasi lagu tertentu.
- Menghapus lagu yang dipilih.
- Menyimpan data dalam file songs.json untuk persistensi.

### Instalasi dan Penggunaan

##### 1. Menjalankan Program

Buka terminal atau command prompt di dalam folder proyek, lalu jalankan perintah berikut:

```node index.js```

##### 2. Interaksi dengan Program

Setelah program berjalan, pengguna dapat memilih opsi dari menu utama:

1. Pilih penyanyi - Menampilkan daftar penyanyi dan memungkinkan pengguna memilih salah satu.
2. Tambah penyanyi - Menambahkan penyanyi baru ke dalam database.
3. Keluar - Menghentikan program.

Jika memilih penyanyi yang ada, pengguna dapat:

- Melihat daftar lagu dari penyanyi tersebut.
- Menambahkan lagu baru.
- Melihat detail lagu berdasarkan ID.
- Mengedit informasi lagu tertentu.
- Menghapus lagu yang dipilih.
