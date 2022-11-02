# SIML-K Notification Copy

| No | Notification | Sender | Receiver | Condition | Title | Body |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Create Reservation | Mahasiswa | Konselor | When Mahasiswa Press Create Reservation | "Permintaan Bimbingan Konseling Baru" | "{nim_mahasiswa} membuat permintaan reservasi baru. Mohon untuk segera di proses" |
| 2 | Reservation Process | Konselor | Mahasiswa | When Konselor Update Reservation Status to "Dalam Proses" | "Permintaan Bimbingan Konseling Telah Dijadwalkan" | "Permintaan bimbingan konselingmu sudah dijadwalkan oleh konselor. Cek informasi lebih detail di dalam aplikasi." |
| 3 | Reservation On Going | Konselor | Mahasiswa | When Konselor Update Reservation Status to "Penanganan" | "Permintaan Bimbingan Konseling Kamu Dalam Penanganan" | "Konselor telah selesai memproses permintaan bimbingan konselingmu. Silahkan cek informasi lebih detail." |
| 4 | Reservation Finish | Konselor | Mahasiswa | When Konselor Update Reservation Status to "Selesai" | "Bimbingan Konseling Telah Selesai" | "Bimbingan konseling pada tanggal {tanggal_reservasi} telah selesai. Konselor sedang dalam proses menulis laporan akhir" |
| 5 | Reservation Report | Konselor | Mahasiswa | When Konselor Save Counseling Report | "Laporan Akhir Sesi Bimbingan Konseling Telah Selesai" | "Konselor telah selesai menulis laporan akhir sesi bimbingan konseling pada tanggal {tanggal_reservasi}." |
