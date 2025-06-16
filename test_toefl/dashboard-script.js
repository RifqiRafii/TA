$(function() {
    const history = JSON.parse(localStorage.getItem('toeflHistory')) || [];
    const $historyContainer = $('#history-container');
    const $deleteBtn = $('#delete-history-btn');
    
    // Ambil nama pengguna dari halaman dashboard
    const userName = $('#name').text(); 

    if (history.length === 0) {
        $historyContainer.html('<p class="text-center p-3">Belum ada riwayat tes.</p>');
        $deleteBtn.hide();
    } else {
        $deleteBtn.show();
        $historyContainer.empty();

        $.each(history, function(i, result) {
            // Membuat URL untuk sertifikat dengan parameter
            const certificateURL = `sertifikat.html?name=${encodeURIComponent(userName)}&date=${encodeURIComponent(result.date)}&listening=${result.listeningScore}&structure=${result.structureScore}&reading=${result.readingScore}&total=${result.totalScore}`;

            // Tambahkan kolom baru untuk tombol cetak
            const historyRow = `
                <div class="row m-0 p-2 bg-light border-bottom align-items-center">
                    <div class="col-md-2"><strong>Tanggal:</strong><br>${result.date}</div>
                    <div class="col">Reading: <strong>${result.readingScore}</strong></div>
                    <div class="col">Listening: <strong>${result.listeningScore}</strong></div>
                    <div class="col">Structure: <strong>${result.structureScore}</strong></div>
                    <div class="col">Total Skor: <span class="fw-bold text-primary">${result.totalScore}</span></div>
                    <div class="col-md-2 text-end">
                        <a href="${certificateURL}" target="_blank" class="btn btn-info btn-sm">Cetak</a>
                    </div>
                </div>
            `;
            $historyContainer.append(historyRow);
        });
    }

    $deleteBtn.on('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat tes? Aksi ini tidak dapat dibatalkan.')) {
            localStorage.removeItem('toeflHistory');
            location.reload();
        }
    });
});