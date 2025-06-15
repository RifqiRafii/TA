$(function() {
    // --- STATE MANAGEMENT ---
    let allQuestions = { Reading: [], Structure: [], Listening: [] };
    let userAnswers = { Reading: [], Structure: [], Listening: [] };
    const sectionOrder = ['Reading', 'Structure', 'Listening'];
    let currentSectionIndex = 0;
    let currentQuestionInSection = 0;
    let timerInterval;

    // --- TOEFL SCORE CONVERSION TABLES ---
    // Diadaptasi dari tabel standar untuk jumlah soal yang ada di JSON
    // Kunci: jumlah jawaban benar, Nilai: skor konversi
    const conversionTables = {
        Reading: { /* 35 soal */
            35: 67, 34: 66, 33: 65, 32: 63, 31: 61, 30: 60, 29: 59, 28: 58, 27: 57, 26: 56, 25: 55, 24: 54, 23: 54, 22: 53, 21: 52, 20: 51, 19: 50, 18: 49, 17: 48, 16: 47, 15: 46, 14: 45, 13: 43, 12: 42, 11: 41, 10: 40, 9: 38, 8: 36, 7: 34, 6: 32, 5: 30, 4: 28, 3: 26, 2: 24, 1: 22, 0: 20
        },
        Structure: { /* 35 soal */
            35: 68, 34: 67, 33: 65, 32: 63, 31: 61, 30: 60, 29: 58, 28: 57, 27: 56, 26: 55, 25: 53, 24: 52, 23: 51, 22: 50, 21: 49, 20: 48, 19: 47, 18: 46, 17: 45, 16: 44, 15: 43, 14: 42, 13: 41, 12: 40, 11: 40, 10: 39, 9: 37, 8: 35, 7: 33, 6: 31, 5: 29, 4: 27, 3: 25, 2: 23, 1: 21, 0: 20
        },
        Listening: { /* 30 soal */
            30: 68, 29: 67, 28: 66, 27: 65, 26: 63, 25: 61, 24: 60, 23: 59, 22: 58, 21: 57, 20: 57, 19: 56, 18: 55, 17: 54, 16: 53, 15: 52, 14: 51, 13: 50, 12: 49, 11: 48, 10: 47, 9: 46, 8: 45, 7: 43, 6: 42, 5: 41, 4: 38, 3: 35, 2: 32, 1: 30, 0: 28
        }
    };

    // --- UI ELEMENTS ---
    const $mainTitle = $('#main-section-title');
    const $timer = $('#countdown-timer');
    const $passageContainer = $('#passage-container');
    const $audioContainer = $('#audio-container');
    const $questionNumber = $('#question-number');
    const $questionText = $('#question-text');
    const $optionsContainer = $('#options-container');
    const $questionNavContainer = $('#question-nav-container');
    const $prevBtn = $('#prev-btn');
    const $nextBtn = $('#next-btn');
    const $autofillBtn = $('#autofill-btn');

    // --- INITIALIZATION ---
    function init() {
        $.getJSON('test_toefl.json', function(data) {
            // Pisahkan soal berdasarkan section
            $.each(data, (i, question) => {
                if (allQuestions[question.section]) {
                    allQuestions[question.section].push(question);
                }
            });
            // Inisialisasi array jawaban
            $.each(sectionOrder, (i, sectionName) => {
                userAnswers[sectionName] = new Array(allQuestions[sectionName].length).fill(null);
            });
            
            loadSection(currentSectionIndex);
            startTimer(120 * 60); // Total waktu 2 jam (120 menit)
        }).fail(() => alert('Gagal memuat file soal. Pastikan test_toefl.json ada.'));
    }

    // --- SECTION AND QUESTION DISPLAY ---
    function loadSection(sectionIdx) {
        currentSectionIndex = sectionIdx;
        currentQuestionInSection = 0;
        const sectionName = sectionOrder[sectionIdx];
        $mainTitle.text(`${sectionName} Section`);
        displayQuestion();
        createNavigationButtons();
    }
    
    function displayQuestion() {
        const sectionName = sectionOrder[currentSectionIndex];
        const question = allQuestions[sectionName][currentQuestionInSection];
        let currentPassage = "";

        // Tampilkan passage untuk Reading
        $passageContainer.hide();
        if (question.section === 'Reading') {
            // Cari passage pertama yang bukan 'same' untuk grup soal ini
            for (let i = currentQuestionInSection; i >= 0; i--) {
                if (allQuestions[sectionName][i].passage.toLowerCase() !== 'same') {
                    currentPassage = allQuestions[sectionName][i].passage;
                    break;
                }
            }
            $passageContainer.html(currentPassage).show();
        }

        // Tampilkan audio untuk Listening
        $audioContainer.hide();
        if (question.section === 'Listening') {
            // Asumsi file audio ada di folder 'audio/'
            $audioContainer.find('audio').attr('src', `audio/${question.audio_file}`);
            $audioContainer.show();
        }

        $questionNumber.text(`No. ${currentQuestionInSection + 1}`);
        $questionText.text(question.question);
        $optionsContainer.empty();

        $.each(question.options, (key, value) => {
            const isChecked = userAnswers[sectionName][currentQuestionInSection] === key ? 'checked' : '';
            const optionHTML = `
                <div class="m-2">
                    <input type="radio" name="jawaban" id="opt-${key}" value="${key}" class="form-check-input" ${isChecked}>
                    <label for="opt-${key}" class="form-label">${key}. ${value}</label>
                </div>`;
            $optionsContainer.append(optionHTML);
        });

        updateNavButtons();
    }

    function createNavigationButtons() {
        const sectionName = sectionOrder[currentSectionIndex];
        const numQuestions = allQuestions[sectionName].length;
        $questionNavContainer.empty();

        for (let i = 0; i < numQuestions; i++) {
            const isAnswered = userAnswers[sectionName][i] !== null;
            const btnClass = isAnswered ? 'btn-primary' : 'btn-outline-primary';
            const $button = $(`<button class="btn btn-sm mx-1 my-1 question-nav-btn ${btnClass}">${i + 1}</button>`);
            
            $button.on('click', function() {
                currentQuestionInSection = i;
                displayQuestion();
            });
            $questionNavContainer.append($button);
        }
    }
    
    function updateNavButtons() {
        const sectionName = sectionOrder[currentSectionIndex];
        const lastQuestionInSection = currentQuestionInSection === allQuestions[sectionName].length - 1;
        const isLastSection = currentSectionIndex === sectionOrder.length - 1;

        $prevBtn.prop('disabled', currentQuestionInSection === 0);

        if (lastQuestionInSection) {
            if (isLastSection) {
                $nextBtn.text('Selesaikan Tes').removeClass('btn-primary').addClass('btn-success');
            } else {
                $nextBtn.text(`Lanjut ke Section ${sectionOrder[currentSectionIndex + 1]}`).removeClass('btn-success').addClass('btn-primary');
            }
        } else {
            $nextBtn.text('Next').removeClass('btn-success').addClass('btn-primary');
        }
    }

    // --- EVENT HANDLERS ---
    $nextBtn.on('click', function() {
        const sectionName = sectionOrder[currentSectionIndex];
        const lastQuestionInSection = currentQuestionInSection === allQuestions[sectionName].length - 1;

        if (lastQuestionInSection) {
            if (currentSectionIndex < sectionOrder.length - 1) {
                loadSection(currentSectionIndex + 1);
            } else {
                finishTest();
            }
        } else {
            currentQuestionInSection++;
            displayQuestion();
        }
    });

    $prevBtn.on('click', function() {
        if (currentQuestionInSection > 0) {
            currentQuestionInSection--;
            displayQuestion();
        }
    });

    $optionsContainer.on('change', 'input[type="radio"]', function() {
        const sectionName = sectionOrder[currentSectionIndex];
        userAnswers[sectionName][currentQuestionInSection] = $(this).val();
        createNavigationButtons(); // Refresh nav buttons to show it's answered
    });
    
    // --- TIMER ---
    function startTimer(durationInSeconds) {
        let timeLeft = durationInSeconds;
        function update() {
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                alert("Waktu Habis!");
                finishTest();
                return;
            }
            const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
            const seconds = String(timeLeft % 60).padStart(2, '0');
            $timer.text(`${hours}:${minutes}:${seconds}`);
            timeLeft--;
        }
        update();
        timerInterval = setInterval(update, 1000);
    }
    
    // --- SCORING & FINISHING ---
    function calculateRawScore(sectionName) {
        let correctCount = 0;
        const answers = userAnswers[sectionName];
        const questions = allQuestions[sectionName];
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] === questions[i].answer) {
                correctCount++;
            }
        }
        return correctCount;
    }

    function convertScore(sectionName, correctCount) {
        const table = conversionTables[sectionName];
        return table[correctCount] || 0; // Return 0 if score not in table
    }

    function finishTest() {
        clearInterval(timerInterval);

        const rawReading = calculateRawScore('Reading');
        const rawStructure = calculateRawScore('Structure');
        const rawListening = calculateRawScore('Listening');

        const scaledReading = convertScore('Reading', rawReading);
        const scaledStructure = convertScore('Structure', rawStructure);
        const scaledListening = convertScore('Listening', rawListening);
        
        const totalScore = Math.round(((scaledReading + scaledStructure + scaledListening) / 3) * 10);
        
        const testResult = {
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}),
            readingScore: scaledReading,
            structureScore: scaledStructure,
            listeningScore: scaledListening,
            totalScore: totalScore
        };
        
        saveResult(testResult);
        window.location.href = '../Dashboard.html';
    }

    function saveResult(result) {
        let history = JSON.parse(localStorage.getItem('toeflHistory')) || [];
        history.unshift(result); // Tambahkan hasil baru di awal
        localStorage.setItem('toeflHistory', JSON.stringify(history));
    }

    // --- ADMIN FEATURE ---
    $autofillBtn.on('click', function() {
        if (!confirm('Konfirmasi fitur dukun')) return;
        
        $.each(sectionOrder, (i, sectionName) => {
            $.each(allQuestions[sectionName], (j, question) => {
                userAnswers[sectionName][j] = question.answer;
            });
        });

        // Refresh tampilan
        displayQuestion();
        createNavigationButtons();
        alert('Semua jawaban telah diisi dengan benar.');
    });

    // --- START THE APP ---
    init();
});