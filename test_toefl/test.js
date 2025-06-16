$(function() {
    // --- STATE MANAGEMENT ---
    let allQuestions = { Reading: [], Structure: [], Listening: [] };
    let userAnswers = { Reading: [], Structure: [], Listening: [] };
    const sectionOrder = ['Reading', 'Structure', 'Listening'];
    let currentSectionIndex = 0;
    let currentQuestionInSection = 0;
    let timerInterval;

    // Alokasi Waktu per Section (dalam detik)
    const sectionTimers = {
        Reading: 55 * 60,    // 55 Menit
        Structure: 25 * 60,  // 25 Menit
        Listening: 35 * 60   // 35 Menit
    };

    // Tabel Konversi Skor TOEFL
    const conversionTables = {
        Reading: { 35: 67, 34: 66, 33: 65, 32: 63, 31: 61, 30: 60, 29: 59, 28: 58, 27: 57, 26: 56, 25: 55, 24: 54, 23: 54, 22: 53, 21: 52, 20: 51, 19: 50, 18: 49, 17: 48, 16: 47, 15: 46, 14: 45, 13: 43, 12: 42, 11: 41, 10: 40, 9: 38, 8: 36, 7: 34, 6: 32, 5: 30, 4: 28, 3: 26, 2: 24, 1: 22, 0: 20 },
        Structure: { 35: 68, 34: 67, 33: 65, 32: 63, 31: 61, 30: 60, 29: 58, 28: 57, 27: 56, 26: 55, 25: 53, 24: 52, 23: 51, 22: 50, 21: 49, 20: 48, 19: 47, 18: 46, 17: 45, 16: 44, 15: 43, 14: 42, 13: 41, 12: 40, 11: 40, 10: 39, 9: 37, 8: 35, 7: 33, 6: 31, 5: 29, 4: 27, 3: 25, 2: 23, 1: 21, 0: 20 },
        Listening: { 30: 68, 29: 67, 28: 66, 27: 65, 26: 63, 25: 61, 24: 60, 23: 59, 22: 58, 21: 57, 20: 57, 19: 56, 18: 55, 17: 54, 16: 53, 15: 52, 14: 51, 13: 50, 12: 49, 11: 48, 10: 47, 9: 46, 8: 45, 7: 43, 6: 42, 5: 41, 4: 38, 3: 35, 2: 32, 1: 30, 0: 28 }
    };

    // UI ELEMENTS
    const $mainTitle = $('#main-section-title'), $timer = $('#countdown-timer'), $passageContainer = $('#passage-container'), $audioContainer = $('#audio-container'), $questionNumber = $('#question-number'), $questionText = $('#question-text'), $optionsContainer = $('#options-container'), $questionNavContainer = $('#question-nav-container'), $prevBtn = $('#prev-btn'), $nextBtn = $('#next-btn'), $autofillBtn = $('#autofill-btn');

    // INITIALIZATION
    function init() {
        $.getJSON('test_toefl.json', function(data) {
            $.each(data, (i, q) => { if (allQuestions[q.section]) allQuestions[q.section].push(q); });
            $.each(sectionOrder, (i, s) => { userAnswers[s] = new Array(allQuestions[s].length).fill(null); });
            loadSection(currentSectionIndex);
        }).fail(() => alert('Gagal memuat file soal. Pastikan test_toefl.json ada.'));
    }

    // SECTION AND QUESTION DISPLAY
    function loadSection(idx) {
        currentSectionIndex = idx;
        currentQuestionInSection = 0;
        const sectionName = sectionOrder[idx];

        $mainTitle.text(`${sectionName} Section`);
        displayQuestion();
        createNavigationButtons();
        
        const duration = sectionTimers[sectionName];
        startTimer(duration);
    }
    
    function displayQuestion() {
        const sectionName = sectionOrder[currentSectionIndex];
        const question = allQuestions[sectionName][currentQuestionInSection];
        
        $passageContainer.hide();
        let textContent = question.passage || question.dialog;
        if (question.section === 'Reading' && textContent && textContent.toLowerCase() === 'same') {
            for (let i = currentQuestionInSection; i >= 0; i--) {
                if (allQuestions[sectionName][i].passage.toLowerCase() !== 'same') {
                    textContent = allQuestions[sectionName][i].passage;
                    break;
                }
            }
        }
        if (textContent) $passageContainer.html(textContent.replace(/\n/g, '<br>')).show();
        
        $audioContainer.hide();
        if (question.section === 'Listening' && question.audio_file) {
            $audioContainer.find('audio').attr('src', `audio/${question.audio_file}`);
            $audioContainer.show();
        }

        $questionNumber.text(`No. ${currentQuestionInSection + 1}`);
        $questionText.text(question.question);
        $optionsContainer.empty();
        $.each(question.options, (key, value) => {
            const isChecked = userAnswers[sectionName][currentQuestionInSection] === key ? 'checked' : '';
            $optionsContainer.append(`<div class="m-2"><input type="radio" name="jawaban" id="opt-${key}" value="${key}" class="form-check-input" ${isChecked}><label for="opt-${key}" class="form-label">${key}. ${value}</label></div>`);
        });
        updateNavButtons();
    }

    function createNavigationButtons() {
        const sectionName = sectionOrder[currentSectionIndex], numQuestions = allQuestions[sectionName].length;
        $questionNavContainer.empty();
        for (let i = 0; i < numQuestions; i++) {
            const isAnswered = userAnswers[sectionName][i] !== null;
            $questionNavContainer.append($(`<button class="btn btn-sm mx-1 my-1 question-nav-btn ${isAnswered ? 'btn-primary' : 'btn-outline-primary'}">${i + 1}</button>`).on('click', function() {
                currentQuestionInSection = i;
                displayQuestion();
            }));
        }
    }

    function updateNavButtons() {
        const lastQ = currentQuestionInSection === allQuestions[sectionOrder[currentSectionIndex]].length - 1;
        const lastS = currentSectionIndex === sectionOrder.length - 1;
        $prevBtn.prop('disabled', currentQuestionInSection === 0);
        if (lastQ) $nextBtn.text(lastS ? 'Selesaikan Tes' : `Lanjut ke Section ${sectionOrder[currentSectionIndex + 1]}`).toggleClass('btn-primary', !lastS).toggleClass('btn-success', lastS);
        else $nextBtn.text('Next').removeClass('btn-success').addClass('btn-primary');
    }

    // EVENT HANDLERS
    $nextBtn.on('click', function() {
        const lastQ = currentQuestionInSection === allQuestions[sectionOrder[currentSectionIndex]].length - 1;
        if (lastQ) (currentSectionIndex < sectionOrder.length - 1) ? loadSection(currentSectionIndex + 1) : finishTest();
        else { currentQuestionInSection++; displayQuestion(); }
    });
    $prevBtn.on('click', function() { if (currentQuestionInSection > 0) { currentQuestionInSection--; displayQuestion(); } });
    $optionsContainer.on('change', 'input[type="radio"]', function() { userAnswers[sectionOrder[currentSectionIndex]][currentQuestionInSection] = $(this).val(); createNavigationButtons(); });
    $('#review-button-main').on('click', function() { displayReview(); $('#test-complete-container').hide(); $('#review-container').show(); });
    $autofillBtn.on('click', function() { if (!confirm('Admin Only: Yakin isi semua jawaban?')) return; $.each(sectionOrder, (i, s) => { $.each(allQuestions[s], (j, q) => { userAnswers[s][j] = q.answer; }); }); displayQuestion(); createNavigationButtons(); alert('Semua jawaban telah diisi.'); });

    // TIMER
    function startTimer(durationInSeconds) {
        clearInterval(timerInterval);
        let timeLeft = durationInSeconds;
        
        function update() {
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                const isLastSection = currentSectionIndex >= sectionOrder.length - 1;
                
                if (isLastSection) {
                    alert("Waktu untuk section terakhir telah habis. Tes akan diselesaikan.");
                    finishTest();
                } else {
                    const currentSectionName = sectionOrder[currentSectionIndex];
                    alert(`Waktu untuk section ${currentSectionName} telah habis. Anda akan diarahkan ke section berikutnya.`);
                    loadSection(currentSectionIndex + 1);
                }
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

    // SCORING & FINISHING
    function calculateRawScore(sectionName) { return userAnswers[sectionName].filter((ans, i) => ans === allQuestions[sectionName][i].answer).length; }
    function convertScore(sectionName, correctCount) { return conversionTables[sectionName][correctCount] || 0; }

    function finishTest() {
        clearInterval(timerInterval);
        const scaledReading = convertScore('Reading', calculateRawScore('Reading'));
        const scaledStructure = convertScore('Structure', calculateRawScore('Structure'));
        const scaledListening = convertScore('Listening', calculateRawScore('Listening'));
        const totalScore = Math.round(((scaledReading + scaledStructure + scaledListening) / 3) * 10);
        saveResult({ date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}), readingScore: scaledReading, structureScore: scaledStructure, listeningScore: scaledListening, totalScore: totalScore });
        $('#quiz-container').hide();
        $('#test-complete-container').show();
    }

    function saveResult(result) {
        let history = JSON.parse(localStorage.getItem('toeflHistory')) || [];
        history.unshift(result);
        localStorage.setItem('toeflHistory', JSON.stringify(history));
    }

    // REVIEW SESSION
    function displayReview() {
        const $reviewContent = $('#review-content');
        $reviewContent.empty();
        $.each(sectionOrder, function(s_idx, sectionName) {
            $reviewContent.append(`<h3 class="mt-4 p-2 bg-secondary text-white rounded">${sectionName} Section</h3>`);
            $.each(allQuestions[sectionName], function(q_idx, question) {
                const userAnswer = userAnswers[sectionName][q_idx], correctAnswer = question.answer;
                let optionsHTML = '<ul class="list-group">';
                $.each(question.options, function(key, value) {
                    let className = 'list-group-item', label = '';
                    if (key === correctAnswer) { className += ' correct-answer'; label = userAnswer === correctAnswer ? ' (Jawaban Anda Benar)' : ' (Jawaban Benar)'; }
                    else if (key === userAnswer) { className += ' wrong-answer'; label = ' (Jawaban Anda)'; }
                    optionsHTML += `<li class="${className}">${key}. ${value}${label}</li>`;
                });
                optionsHTML += '</ul>';
                
                let textContent = question.passage || question.dialog;
                if(question.section === 'Reading' && textContent && textContent.toLowerCase() === 'same') {
                   for (let i = q_idx; i >= 0; i--) if (allQuestions[sectionName][i].passage.toLowerCase() !== 'same') { textContent = allQuestions[sectionName][i].passage; break; }
                }
                const textHTML = textContent ? `<div class="p-2 my-2 bg-light border fst-italic">${textContent.replace(/\n/g, '<br>')}</div>` : '';

                $reviewContent.append(`<div class="card mb-3"><div class="card-header"><strong>Soal No. ${q_idx + 1}:</strong> ${question.question}</div><div class="card-body">${textHTML}${optionsHTML}</div><div class="card-footer bg-light"><strong>Penjelasan:</strong> ${question.explanation}</div></div>`);
            });
        });
    }

    // START THE APP
    init();
});