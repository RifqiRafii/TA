$(function() {
    // Ambil riwayat dari localStorage
    const history = JSON.parse(localStorage.getItem('toeflHistory')) || [];
    const $historyContainer = $('#history-container'); // Kita perlu menambahkan ID ini ke Dashboard.html

    if (history.length === 0) {
        $historyContainer.html('<p class="text-center p-3">Belum ada riwayat tes.</p>');
        return;
    }

    // Kosongkan kontainer sebelum mengisi
    $historyContainer.empty();

    // Loop melalui setiap item riwayat dan buat elemen HTML-nya
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
});