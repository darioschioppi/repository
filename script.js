// Griglia di Valutazione - Script JavaScript
// Liceo delle Scienze Umane - Biennio

// Mappatura dei livelli ai punteggi effettivi
const scoreMapping = {
    criterion1: {
        8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5
    },
    criterion2: {
        8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4
    },
    criterion3: {
        8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4
    },
    criterion4: {
        8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4
    },
    criterion5: {
        8: 14.5, 7: 12.5, 6: 10.5, 5: 9, 4: 7.5, 3: 5.5, 2: 3
    }
};

// Descrittori per il breakdown
const criteriaNames = {
    criterion1: "Contenuto e Pertinenza",
    criterion2: "Organizzazione e Coerenza",
    criterion3: "Competenza Morfosintattica",
    criterion4: "Lessico e Registro",
    criterion5: "Capacità Critica e Riflessiva"
};

const maxScores = {
    criterion1: 25,
    criterion2: 20,
    criterion3: 20,
    criterion4: 20,
    criterion5: 15
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Imposta data corrente
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assignmentDate').value = today;

    // Aggiungi event listeners a tutti i radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', calculateScore);
    });

    // Event listeners per info studente
    const studentInputs = document.querySelectorAll('.student-info input');
    studentInputs.forEach(input => {
        input.addEventListener('input', updateLocalStorage);
    });

    document.getElementById('teacherNotes').addEventListener('input', updateLocalStorage);

    // Carica dati salvati se presenti
    loadSavedData();
});

// Calcola il punteggio totale
function calculateScore() {
    let totalScore = 0;
    const breakdown = {};

    // Calcola punteggio per ogni criterio
    for (let i = 1; i <= 5; i++) {
        const selectedRadio = document.querySelector(`input[name="criterion${i}"]:checked`);
        if (selectedRadio) {
            const level = parseInt(selectedRadio.value);
            const score = scoreMapping[`criterion${i}`][level];
            totalScore += score;
            breakdown[`criterion${i}`] = {
                score: score,
                max: maxScores[`criterion${i}`],
                name: criteriaNames[`criterion${i}`]
            };
        }
    }

    // Arrotonda il totale
    totalScore = Math.round(totalScore * 10) / 10;

    // Aggiorna visualizzazione
    document.getElementById('totalScore').textContent = totalScore;

    // Calcola voto in decimi
    const grade = calculateGrade(totalScore);
    document.getElementById('finalGrade').textContent = grade;

    // Determina giudizio
    const judgment = getJudgment(totalScore);
    document.getElementById('judgment').textContent = judgment;

    // Mostra breakdown
    displayBreakdown(breakdown, totalScore);

    // Salva in localStorage
    updateLocalStorage();
}

// Calcola il voto in decimi con metodo proporzionale
function calculateGrade(score) {
    if (score < 60) {
        // Da 0 a 59 -> voti da 1 a 5.5
        return Math.round((score / 60 * 4.5 + 1) * 2) / 2;
    } else {
        // Da 60 a 100 -> voti da 6 a 10
        return Math.round(((score - 60) / 40 * 4 + 6) * 2) / 2;
    }
}

// Determina il giudizio qualitativo
function getJudgment(score) {
    if (score >= 90) return "Eccellente";
    if (score >= 80) return "Ottimo";
    if (score >= 70) return "Buono";
    if (score >= 60) return "Discreto";
    if (score >= 55) return "Sufficiente";
    if (score >= 45) return "Mediocre";
    if (score >= 30) return "Insufficiente";
    return "Gravemente Insufficiente";
}

// Visualizza breakdown dettagliato
function displayBreakdown(breakdown, total) {
    const breakdownDiv = document.getElementById('breakdown');

    if (Object.keys(breakdown).length === 0) {
        breakdownDiv.innerHTML = '';
        return;
    }

    let html = '<h4>Dettaglio Punteggi per Criterio:</h4><div class="breakdown-items">';

    for (const [key, data] of Object.entries(breakdown)) {
        const percentage = Math.round((data.score / data.max) * 100);
        html += `
            <div class="breakdown-item">
                <div class="breakdown-header">
                    <span class="breakdown-name">${data.name}</span>
                    <span class="breakdown-score">${data.score} / ${data.max}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    breakdownDiv.innerHTML = html;
}

// Salva dati in localStorage
function updateLocalStorage() {
    const data = {
        studentName: document.getElementById('studentName').value,
        className: document.getElementById('className').value,
        assignmentDate: document.getElementById('assignmentDate').value,
        topic: document.getElementById('topic').value,
        teacherNotes: document.getElementById('teacherNotes').value,
        scores: {}
    };

    // Salva selezioni
    for (let i = 1; i <= 5; i++) {
        const selectedRadio = document.querySelector(`input[name="criterion${i}"]:checked`);
        if (selectedRadio) {
            data.scores[`criterion${i}`] = selectedRadio.value;
        }
    }

    localStorage.setItem('currentEvaluation', JSON.stringify(data));
}

// Carica dati salvati
function loadSavedData() {
    const saved = localStorage.getItem('currentEvaluation');
    if (saved) {
        const data = JSON.parse(saved);

        document.getElementById('studentName').value = data.studentName || '';
        document.getElementById('className').value = data.className || '';
        document.getElementById('assignmentDate').value = data.assignmentDate || '';
        document.getElementById('topic').value = data.topic || '';
        document.getElementById('teacherNotes').value = data.teacherNotes || '';

        // Ripristina selezioni
        for (const [criterion, value] of Object.entries(data.scores)) {
            const radio = document.querySelector(`input[name="${criterion}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
            }
        }

        // Ricalcola punteggio
        calculateScore();
    }
}

// Stampa griglia
function printEvaluation() {
    window.print();
}

// Esporta in PDF (utilizziamo la stampa del browser)
function exportToPDF() {
    alert('Usa la funzione "Stampa" del browser e seleziona "Salva come PDF" come destinazione per esportare la valutazione.');
    window.print();
}

// Salva valutazione in file JSON
function saveEvaluation() {
    const studentName = document.getElementById('studentName').value || 'studente';
    const date = document.getElementById('assignmentDate').value || 'data';

    const data = {
        studentInfo: {
            name: document.getElementById('studentName').value,
            class: document.getElementById('className').value,
            date: document.getElementById('assignmentDate').value,
            topic: document.getElementById('topic').value
        },
        scores: {},
        totalScore: document.getElementById('totalScore').textContent,
        grade: document.getElementById('finalGrade').textContent,
        judgment: document.getElementById('judgment').textContent,
        notes: document.getElementById('teacherNotes').value,
        timestamp: new Date().toISOString()
    };

    // Raccogli tutte le selezioni con descrittori
    for (let i = 1; i <= 5; i++) {
        const selectedRadio = document.querySelector(`input[name="criterion${i}"]:checked`);
        if (selectedRadio) {
            data.scores[`criterion${i}`] = {
                level: selectedRadio.value,
                score: scoreMapping[`criterion${i}`][parseInt(selectedRadio.value)],
                descriptor: selectedRadio.dataset.descriptor,
                criterionName: criteriaNames[`criterion${i}`]
            };
        }
    }

    // Crea blob e download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valutazione_${studentName.replace(/\s+/g, '_')}_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Salva anche nello storico del localStorage
    saveToHistory(data);
}

// Salva nello storico
function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
    history.unshift(data);

    // Mantieni solo le ultime 50 valutazioni
    if (history.length > 50) {
        history = history.slice(0, 50);
    }

    localStorage.setItem('evaluationHistory', JSON.stringify(history));
}

// Reset form
function resetForm() {
    if (confirm('Sei sicuro di voler cancellare tutti i dati e iniziare una nuova valutazione?')) {
        // Reset tutti i campi
        document.getElementById('studentName').value = '';
        document.getElementById('className').value = '';
        document.getElementById('topic').value = '';
        document.getElementById('teacherNotes').value = '';

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('assignmentDate').value = today;

        // Deseleziona tutti i radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });

        // Reset punteggi
        document.getElementById('totalScore').textContent = '0';
        const gradeInput = document.getElementById('finalGrade');
        if (gradeInput) {
            gradeInput.value = '';
            gradeInput.readOnly = true;
            gradeInput.removeAttribute('data-numeric-value');
        }
        document.getElementById('judgment').textContent = '-';
        document.getElementById('breakdown').innerHTML = '';

        // Reset pulsante modifica voto
        const editGradeBtn = document.getElementById('btnEditGrade');
        if (editGradeBtn) {
            editGradeBtn.textContent = '✏️';
            editGradeBtn.classList.remove('editing');
            editGradeBtn.title = 'Modifica voto manualmente';
        }

        // Cancella localStorage corrente
        localStorage.removeItem('currentEvaluation');

        // Reinizializza i listener per i radio button
        if (typeof initializeRadioListeners === 'function') {
            initializeRadioListeners();
        }

        // Reset stato modifica
        if (typeof editingEvaluationIndex !== 'undefined') {
            editingEvaluationIndex = null;
        }
        if (typeof gradeManuallyEdited !== 'undefined') {
            gradeManuallyEdited = false;
        }
        if (typeof updateEditButtonState === 'function') {
            updateEditButtonState();
        }
    }
}

// Funzione di utilità per formattare date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
}

// ========================================
// FUNZIONI EXCEL REGISTER
// ========================================

// Aggiungi valutazione corrente al registro Excel
function addToExcelRegister() {
    // Validazione: verifica che tutti i campi siano compilati
    const studentName = document.getElementById('studentName').value;
    const className = document.getElementById('className').value;
    const totalScore = document.getElementById('totalScore').textContent;

    if (!studentName) {
        alert('⚠️ Inserisci il nome dello studente prima di salvare nel registro.');
        return;
    }

    if (totalScore === '0' || totalScore === '-') {
        alert('⚠️ Completa la valutazione prima di salvarla nel registro.');
        return;
    }

    // Crea oggetto valutazione
    const evaluation = {
        id: Date.now(),
        studentName: studentName,
        className: className || 'N/A',
        date: document.getElementById('assignmentDate').value,
        topic: document.getElementById('topic').value || 'N/A',
        scores: {},
        totalScore: parseFloat(totalScore),
        grade: document.getElementById('finalGrade').textContent,
        judgment: document.getElementById('judgment').textContent,
        notes: document.getElementById('teacherNotes').value || '',
        timestamp: new Date().toISOString()
    };

    // Raccogli punteggi per criterio
    for (let i = 1; i <= 5; i++) {
        const selectedRadio = document.querySelector(`input[name="criterion${i}"]:checked`);
        if (selectedRadio) {
            evaluation.scores[`criterion${i}`] = {
                score: scoreMapping[`criterion${i}`][parseInt(selectedRadio.value)],
                descriptor: selectedRadio.dataset.descriptor
            };
        }
    }

    // Recupera registro esistente
    let register = JSON.parse(localStorage.getItem('excelRegister') || '[]');

    // Aggiungi nuova valutazione
    register.push(evaluation);

    // Salva nel localStorage
    localStorage.setItem('excelRegister', JSON.stringify(register));

    // Mostra conferma
    showNotification(`✅ Valutazione di ${studentName} aggiunta al registro! Totale: ${register.length} valutazioni.`);

    // Aggiorna visualizzazione registro
    updateRegisterDisplay();

    // Reset form per nuova valutazione
    if (confirm('Valutazione salvata! Vuoi iniziare una nuova valutazione?')) {
        resetForm();
    }
}

// Scarica registro completo in Excel
function downloadExcelRegister() {
    const register = JSON.parse(localStorage.getItem('excelRegister') || '[]');

    if (register.length === 0) {
        alert('⚠️ Il registro è vuoto. Aggiungi almeno una valutazione prima di esportare.');
        return;
    }

    // Prepara dati per Excel
    const excelData = [];

    // Intestazioni
    const headers = [
        'N°',
        'Nome e Cognome',
        'Classe',
        'Data',
        'Traccia',
        'Contenuto (25)',
        'Organizzazione (20)',
        'Morfosintattica (20)',
        'Lessico (20)',
        'Capacità Critica (15)',
        'Totale (100)',
        'Voto (10)',
        'Giudizio',
        'Note'
    ];

    excelData.push(headers);

    // Dati studenti
    register.forEach((evaluation, index) => {
        const row = [
            index + 1,
            evaluation.studentName,
            evaluation.className,
            formatDateShort(evaluation.date),
            evaluation.topic,
            evaluation.scores.criterion1?.score || '-',
            evaluation.scores.criterion2?.score || '-',
            evaluation.scores.criterion3?.score || '-',
            evaluation.scores.criterion4?.score || '-',
            evaluation.scores.criterion5?.score || '-',
            evaluation.totalScore,
            evaluation.grade,
            evaluation.judgment,
            evaluation.notes
        ];
        excelData.push(row);
    });

    // Aggiungi riga di statistiche
    excelData.push([]);
    excelData.push(['STATISTICHE CLASSE']);
    excelData.push(['Numero studenti:', register.length]);

    const avgScore = (register.reduce((sum, e) => sum + e.totalScore, 0) / register.length).toFixed(2);
    const avgGrade = (register.reduce((sum, e) => sum + parseFloat(e.grade), 0) / register.length).toFixed(2);

    excelData.push(['Media punteggio:', avgScore]);
    excelData.push(['Media voto:', avgGrade]);

    // Conta giudizi
    const judgmentCounts = {};
    register.forEach(e => {
        judgmentCounts[e.judgment] = (judgmentCounts[e.judgment] || 0) + 1;
    });

    excelData.push([]);
    excelData.push(['DISTRIBUZIONE GIUDIZI']);
    for (const [judgment, count] of Object.entries(judgmentCounts)) {
        excelData.push([judgment + ':', count]);
    }

    // Crea workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Formattazione colonne (larghezza)
    ws['!cols'] = [
        { wch: 5 },   // N°
        { wch: 25 },  // Nome
        { wch: 8 },   // Classe
        { wch: 12 },  // Data
        { wch: 40 },  // Traccia
        { wch: 12 },  // Contenuto
        { wch: 15 },  // Organizzazione
        { wch: 15 },  // Morfosintattica
        { wch: 12 },  // Lessico
        { wch: 15 },  // Capacità Critica
        { wch: 10 },  // Totale
        { wch: 8 },   // Voto
        { wch: 20 },  // Giudizio
        { wch: 50 }   // Note
    ];

    // Aggiungi worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registro Valutazioni');

    // Crea secondo foglio con dettagli
    const detailsData = [['DETTAGLI VALUTAZIONI']];
    detailsData.push([]);

    register.forEach((evaluation, index) => {
        detailsData.push([`STUDENTE ${index + 1}: ${evaluation.studentName}`]);
        detailsData.push(['Classe:', evaluation.className]);
        detailsData.push(['Data:', formatDateShort(evaluation.date)]);
        detailsData.push(['Traccia:', evaluation.topic]);
        detailsData.push([]);
        detailsData.push(['CRITERI DI VALUTAZIONE:']);

        for (let i = 1; i <= 5; i++) {
            const score = evaluation.scores[`criterion${i}`];
            if (score) {
                detailsData.push([
                    criteriaNames[`criterion${i}`] + ':',
                    score.score + ' / ' + maxScores[`criterion${i}`],
                    score.descriptor
                ]);
            }
        }

        detailsData.push([]);
        detailsData.push(['TOTALE:', evaluation.totalScore]);
        detailsData.push(['VOTO:', evaluation.grade]);
        detailsData.push(['GIUDIZIO:', evaluation.judgment]);
        detailsData.push(['NOTE:', evaluation.notes]);
        detailsData.push([]);
        detailsData.push(['---', '---', '---']);
        detailsData.push([]);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(detailsData);
    ws2['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Dettagli Completi');

    // Nome file con data
    const className = register[0]?.className || 'Classe';
    const today = new Date().toISOString().split('T')[0];
    const filename = `Registro_${className}_${today}.xlsx`;

    // Scarica file
    XLSX.writeFile(wb, filename);

    showNotification(`📥 Registro Excel scaricato: ${filename}`);
}

// Aggiorna visualizzazione registro nella pagina
function updateRegisterDisplay() {
    const register = JSON.parse(localStorage.getItem('excelRegister') || '[]');
    const statsDiv = document.getElementById('registerStats');
    const tableBody = document.getElementById('registerTableBody');

    // Aggiorna statistiche
    if (register.length > 0) {
        const avgScore = (register.reduce((sum, e) => sum + e.totalScore, 0) / register.length).toFixed(1);
        const avgGrade = (register.reduce((sum, e) => sum + parseFloat(e.grade), 0) / register.length).toFixed(1);

        statsDiv.innerHTML = `
            <span>📊 Valutazioni totali: <strong>${register.length}</strong></span>
            <span>📈 Media punteggio: <strong>${avgScore}/100</strong></span>
            <span>🎯 Media voto: <strong>${avgGrade}/10</strong></span>
        `;
    } else {
        statsDiv.innerHTML = '<span>📊 Nessuna valutazione nel registro</span>';
    }

    // Aggiorna tabella
    tableBody.innerHTML = '';

    register.forEach((evaluation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${evaluation.studentName}</strong></td>
            <td>${evaluation.className}</td>
            <td>${formatDateShort(evaluation.date)}</td>
            <td class="topic-cell">${truncateText(evaluation.topic, 30)}</td>
            <td>${evaluation.scores.criterion1?.score || '-'}</td>
            <td>${evaluation.scores.criterion2?.score || '-'}</td>
            <td>${evaluation.scores.criterion3?.score || '-'}</td>
            <td>${evaluation.scores.criterion4?.score || '-'}</td>
            <td>${evaluation.scores.criterion5?.score || '-'}</td>
            <td><strong>${evaluation.totalScore}</strong></td>
            <td class="grade-cell"><strong>${evaluation.grade}</strong></td>
            <td class="judgment-cell">${evaluation.judgment}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="viewEvaluation(${index})" title="Visualizza">👁️</button>
                <button class="btn-icon" onclick="deleteEvaluation(${index})" title="Elimina">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Mostra/nascondi registro
function toggleRegisterView() {
    const container = document.getElementById('registerTableContainer');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        updateRegisterDisplay();
    } else {
        container.style.display = 'none';
    }
}

// Svuota registro
function clearRegister() {
    if (confirm('⚠️ ATTENZIONE: Questa operazione eliminerà TUTTE le valutazioni dal registro.\n\nSei sicuro di voler continuare?')) {
        if (confirm('Confermi di voler eliminare definitivamente tutte le ' +
                   (JSON.parse(localStorage.getItem('excelRegister') || '[]').length) +
                   ' valutazioni?')) {
            localStorage.removeItem('excelRegister');
            updateRegisterDisplay();
            showNotification('🗑️ Registro svuotato completamente.');
        }
    }
}

// Visualizza dettagli valutazione
function viewEvaluation(index) {
    const register = JSON.parse(localStorage.getItem('excelRegister') || '[]');
    const evaluation = register[index];

    if (!evaluation) return;

    let details = `📝 VALUTAZIONE DETTAGLIATA\n\n`;
    details += `Studente: ${evaluation.studentName}\n`;
    details += `Classe: ${evaluation.className}\n`;
    details += `Data: ${formatDateShort(evaluation.date)}\n`;
    details += `Traccia: ${evaluation.topic}\n\n`;
    details += `PUNTEGGI:\n`;

    for (let i = 1; i <= 5; i++) {
        const score = evaluation.scores[`criterion${i}`];
        if (score) {
            details += `- ${criteriaNames[`criterion${i}`]}: ${score.score}/${maxScores[`criterion${i}`]}\n`;
        }
    }

    details += `\nTOTALE: ${evaluation.totalScore}/100\n`;
    details += `VOTO: ${evaluation.grade}/10\n`;
    details += `GIUDIZIO: ${evaluation.judgment}\n`;

    if (evaluation.notes) {
        details += `\nNOTE:\n${evaluation.notes}`;
    }

    alert(details);
}

// Elimina valutazione specifica
function deleteEvaluation(index) {
    const register = JSON.parse(localStorage.getItem('excelRegister') || '[]');
    const evaluation = register[index];

    if (confirm(`Eliminare la valutazione di ${evaluation.studentName}?`)) {
        register.splice(index, 1);
        localStorage.setItem('excelRegister', JSON.stringify(register));
        updateRegisterDisplay();
        showNotification(`🗑️ Valutazione eliminata.`);
    }
}

// Notifica toast
function showNotification(message) {
    // Rimuovi notifiche esistenti
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    // Crea notifica
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Mostra con animazione
    setTimeout(() => toast.classList.add('show'), 100);

    // Nascondi dopo 3 secondi
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Formatta data breve
function formatDateShort(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Tronca testo
function truncateText(text, maxLength) {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Inizializza visualizzazione registro all'avvio
document.addEventListener('DOMContentLoaded', function() {
    updateRegisterDisplay();
});
