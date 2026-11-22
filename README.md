# Render Video Gratis di GitHub

Repo ini berisi proyek video Remotion Stevhania. Videonya dirender oleh
**GitHub Actions** — mesin GitHub yang menjalankan perintah render — jadi
tidak perlu kredit Dola AI, Flow, atau Runway, dan tidak perlu komputer
sendiri yang menyala.

## Apakah gratis?

Ya, untuk pemakaian ini:

- **Repositori publik:** GitHub Actions dengan runner standar gratis,
  tanpa batas menit.
- **Repositori privat (paket GitHub Free):** 2.000 menit per bulan gratis.
  Satu render video 15–70 detik 1080p di runner Linux biasanya makan
  beberapa menit sampai belasan menit.
- **Penyimpanan hasil (artifact):** 500 MB di paket gratis. Workflow di
  repo ini menyimpan hasil hanya **7 hari** supaya jatah tidak cepat habis
  — unduh videonya segera setelah render selesai.

## Komposisi yang bisa dirender

| ID | Video |
|----|-------|
| `UndurUndur` | UNDUR-UNDUR — Siklus Hidup, 70 detik, 7 segmen: telur → larva → lubang → memangsa → kepompong → dewasa |
| `TheLastFlight` | THE LAST FLIGHT v1 — narasi Inggris, tanpa judul |
| `TheLastFlightV2` | THE LAST FLIGHT v2 — narasi Indonesia + kartu judul emas |
| `RatuDanRaksasa` | RATU DAN RAKSASA TERBELENGGU v1 — gerakan kamera |
| `RatuDanRaksasaV2` | RATU DAN RAKSASA TERBELENGGU v2 — gerakan berlapis |

## Cara memakai

1. Buat repositori baru di GitHub (publik = gratis tanpa batas menit).
2. Upload / push semua isi folder ini ke repositori itu.
3. Buka tab **Actions** di repositori, pilih workflow **Render video**,
   klik **Run workflow**, pilih komposisi, klik **Run workflow**.
4. Tunggu sampai run selesai (centang hijau), lalu unduh file `.mp4`
   dari bagian **Artifacts** di halaman run tersebut.

Lokal (tanpa GitHub) tetap bisa seperti biasa:

```bash
npm install
npx remotion render TheLastFlightV2
```

## Yang perlu diketahui jujur

- Yang dirender di GitHub **sama persis** dengan yang dirender di komputer:
  gerakan kamera dan gerakan berlapis di atas gambar diam. Ini **bukan**
  animasi tokoh seperti Dola AI image-to-video.
- Runner GitHub tidak punya GPU, jadi render CPU biasa — video 60 detik
  1080p butuh beberapa menit.
- File video hasil render tidak tersimpan di repo (folder `out/` diabaikan
  Git), hanya sebagai artifact yang kedaluwarsa 7 hari.
