document.addEventListener('DOMContentLoaded', function() {
    const timerElement = document.getElementById('countdown-timer');
    const oneHourInSeconds = 3600; // 1 jam = 3600 detik
    let timeLeft = oneHourInSeconds;

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }

    function updateTimer() {
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerElement.innerHTML = "Waktu Habis!";
            return;
        }
        timerElement.innerHTML = formatTime(timeLeft);
        timeLeft--;
    }

    // Inisialisasi timer pertama kali
    updateTimer();

    // Set interval untuk mengupdate timer setiap detik
    const timerInterval = setInterval(updateTimer, 1000);
});