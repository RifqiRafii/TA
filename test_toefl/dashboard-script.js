$(function() {
    const history = JSON.parse(localStorage.getItem('toeflHistory')) || [];
    const $historyContainer = $('#history-container');
    const $deleteBtn = $('#delete-history-btn');

    // Cek apakah ada riwayat untuk ditampilkan
    if (history.length === 0) {
        $historyContainer.html('<p class="text-center p-3">Belum ada riwayat tes.</p>');
        $deleteBtn.hide(); // Sembunyikan tombol jika tidak ada riwayat
    } else {
        // Jika ada riwayat, tampilkan tombol hapus dan muat datanya
        $deleteBtn.show();
        $historyContainer.empty();

        $.each(history, function(i, result) {
            const historyRow = `
                <div class="row m-0 p-2 bg-light border-bottom">
                    <div class="col-md-3"><strong>Tanggal:</strong> ${result.date}</div>
                    <div class="col">Reading: <strong>${result.readingScore}</strong></div>
                    <div class="col">Listening: <strong>${result.listeningScore}</strong></div>
                    <div class="col">Structure: <strong>${result.structureScore}</strong></div>
                    <div class="col-md-2">Total Skor: <span class="fw-bold text-primary">${result.totalScore}</span></div>
                </div>
            `;
            $historyContainer.append(historyRow);
        });
    }

    // --- EVENT HANDLER UNTUK TOMBOL HAPUS ---
    $deleteBtn.on('click', function() {
        // Minta konfirmasi dari pengguna sebelum menghapus
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat tes? Aksi ini tidak dapat dibatalkan.')) {
            // Hapus item dari localStorage
            localStorage.removeItem('toeflHistory');
            
            // Muat ulang halaman untuk menampilkan perubahan
            location.reload();
        }
    });
});