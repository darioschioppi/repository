// Multi-Grid Modifications
// Sovrascrive funzioni di script.js per supportare multiple griglie

// Stato di modifica: traccia se stiamo modificando una valutazione esistente
let editingEvaluationIndex = null;

// Stato modifica voto: traccia se il voto è stato modificato manualmente
let gradeManuallyEdited = false;

// Funzione per abilitare/disabilitare modifica voto manuale
function toggleGradeEdit() {
    const gradeInput = document.getElementById('finalGrade');
    const editButton = document.getElementById('btnEditGrade');

    if (gradeInput.readOnly) {
        // Abilita modifica
        gradeInput.readOnly = false;
        gradeInput.focus();
        gradeInput.select();
        editButton.textContent = '✓';
        editButton.classList.add('editing');
        editButton.title = 'Conferma voto';
    } else {
        // Disabilita modifica e valida
        const value = parseFloat(gradeInput.value);

        // Validazione
        if (isNaN(value) || value < 1 || value > 10) {
            alert('⚠️ Inserisci un voto valido tra 1 e 10 (mezzi voti consentiti: es. 6.5, 7.5)');
            return;
        }

        // Arrotonda ai mezzi voti (0.5)
        const roundedValue = Math.round(value * 2) / 2;
        gradeInput.value = roundedValue;

        gradeInput.readOnly = true;
        editButton.textContent = '✏️';
        editButton.classList.remove('editing');
        editButton.title = 'Modifica voto manualmente';

        gradeManuallyEdited = true;

        // Aggiorna giudizio basato sul voto modificato
        updateJudgmentFromGrade(roundedValue);

        showNotification(`✏️ Voto modificato manualmente: ${roundedValue}/10`);
    }
}

// Aggiorna giudizio in base al voto
function updateJudgmentFromGrade(grade) {
    let judgment = '';

    if (grade >= 9) judgment = 'Eccellente';
    else if (grade >= 8) judgment = 'Ottimo';
    else if (grade >= 7) judgment = 'Buono';
    else if (grade >= 6) judgment = 'Discreto';
    else if (grade >= 5.5) judgment = 'Sufficiente';
    else if (grade >= 4.5) judgment = 'Mediocre';
    else if (grade >= 3) judgment = 'Insufficiente';
    else judgment = 'Gravemente Insufficiente';

    document.getElementById('judgment').textContent = judgment;
}

// Funzione per aggiornare le note del docente con i descrittori selezionati
function updateTeacherNotesWithDescriptors() {
    const config = getCurrentGridConfig();
    const criteriaKeys = Object.keys(config.scoreMapping);
    const notesTextarea = document.getElementById('teacherNotes');

    // Raccoglie tutti i descrittori selezionati
    let notesContent = '';

    criteriaKeys.forEach(criterionKey => {
        const selectedRadio = document.querySelector(`input[name="${criterionKey}"]:checked`);
        if (selectedRadio) {
            const descriptor = selectedRadio.dataset.descriptor;
            const criterionName = config.criteriaNames[criterionKey];

            if (descriptor) {
                notesContent += `${criterionName}: ${descriptor}\n\n`;
            }
        }
    });

    // Aggiorna il textarea solo se ci sono descrittori
    if (notesContent.trim()) {
        notesTextarea.value = notesContent.trim();
    }
}

// Inizializza gli event listener per i radio button
function initializeRadioListeners() {
    // Aggiungi listener a tutti i radio button
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Quando cambia una selezione, aggiorna le note
            updateTeacherNotesWithDescriptors();
        });
    });
}

// Chiamata inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRadioListeners);
} else {
    initializeRadioListeners();
}

// Calcola il punteggio totale (VERSIONE MULTI-GRIGLIA)
function calculateScore() {
    let totalScore = 0;
    const breakdown = {};
    const config = getCurrentGridConfig();

    // Ottieni i nomi dei criteri per la griglia corrente
    const criteriaKeys = Object.keys(config.scoreMapping);

    // Calcola punteggio per ogni criterio
    criteriaKeys.forEach(criterionKey => {
        const selectedRadio = document.querySelector(`input[name="${criterionKey}"]:checked`);
        if (selectedRadio) {
            const level = parseInt(selectedRadio.value);
            const score = config.scoreMapping[criterionKey][level];
            totalScore += score;
            breakdown[criterionKey] = {
                score: score,
                max: config.maxScores[criterionKey],
                name: config.criteriaNames[criterionKey]
            };
        }
    });

    // Arrotonda il totale
    totalScore = Math.round(totalScore * 10) / 10;

    // Aggiorna visualizzazione
    document.getElementById('totalScore').textContent = totalScore;

    // Calcola voto in decimi SOLO se non è stato modificato manualmente
    if (!gradeManuallyEdited) {
        const grade = calculateGrade(totalScore);
        document.getElementById('finalGrade').value = grade;

        // Determina giudizio
        const judgment = getJudgment(totalScore);
        document.getElementById('judgment').textContent = judgment;
    } else {
        // Se modificato manualmente, mantieni il voto modificato
        // ma aggiorna il giudizio in base al voto corrente
        const currentGrade = parseFloat(document.getElementById('finalGrade').value);
        if (!isNaN(currentGrade)) {
            updateJudgmentFromGrade(currentGrade);
        }
    }

    // Mostra breakdown
    displayBreakdown(breakdown, totalScore);

    // Salva in localStorage
    updateLocalStorage();
}

// Aggiungi o modifica valutazione corrente al registro Excel (VERSIONE MULTI-GRIGLIA)
function addToExcelRegister() {
    const config = getCurrentGridConfig();
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
        gridType: currentGrid,
        gridName: config.name,
        studentName: studentName,
        className: className || 'N/A',
        date: document.getElementById('assignmentDate').value,
        topic: document.getElementById('topic').value || 'N/A',
        scores: {},
        totalScore: parseFloat(totalScore),
        grade: document.getElementById('finalGrade').value,
        judgment: document.getElementById('judgment').textContent,
        notes: document.getElementById('teacherNotes').value || '',
        gradeManuallyEdited: gradeManuallyEdited,
        timestamp: new Date().toISOString()
    };

    // Raccogli punteggi per criterio
    const criteriaKeys = Object.keys(config.scoreMapping);
    criteriaKeys.forEach(criterionKey => {
        const selectedRadio = document.querySelector(`input[name="${criterionKey}"]:checked`);
        if (selectedRadio) {
            evaluation.scores[criterionKey] = {
                score: config.scoreMapping[criterionKey][parseInt(selectedRadio.value)],
                level: parseInt(selectedRadio.value),
                descriptor: selectedRadio.dataset.descriptor,
                criterionName: config.criteriaNames[criterionKey]
            };
        }
    });

    // Recupera registro esistente per questa griglia
    const storageKey = getCurrentStorageKey();
    let register = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Verifica se stiamo modificando o aggiungendo
    if (editingEvaluationIndex !== null && editingEvaluationIndex >= 0) {
        // MODIFICA valutazione esistente
        // Mantieni l'ID originale se esiste
        evaluation.id = register[editingEvaluationIndex].id || Date.now();
        register[editingEvaluationIndex] = evaluation;

        // Salva nel localStorage
        localStorage.setItem(storageKey, JSON.stringify(register));

        // Mostra conferma
        showNotification(`✏️ Valutazione di ${studentName} modificata con successo!`);

        // Reset stato modifica
        editingEvaluationIndex = null;
        updateEditButtonState();
    } else {
        // AGGIUNGI nuova valutazione
        evaluation.id = Date.now();
        register.push(evaluation);

        // Salva nel localStorage
        localStorage.setItem(storageKey, JSON.stringify(register));

        // Mostra conferma
        showNotification(`✅ Valutazione di ${studentName} aggiunta al registro ${config.name}! Totale: ${register.length} valutazioni.`);
    }

    // Aggiorna visualizzazione registro
    updateRegisterDisplay();

    // Reset form per nuova valutazione
    if (confirm('Valutazione salvata! Vuoi iniziare una nuova valutazione?')) {
        resetForm();
        editingEvaluationIndex = null;
        gradeManuallyEdited = false;
        updateEditButtonState();
    }
}

// Aggiorna visualizzazione registro nella pagina (VERSIONE MULTI-GRIGLIA)
function updateRegisterDisplay() {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const statsDiv = document.getElementById('registerStats');
    const tableBody = document.getElementById('registerTableBody');

    // Aggiorna statistiche
    if (register.length > 0) {
        const avgScore = (register.reduce((sum, e) => sum + e.totalScore, 0) / register.length).toFixed(1);
        const avgGrade = (register.reduce((sum, e) => sum + parseFloat(e.grade), 0) / register.length).toFixed(1);

        statsDiv.innerHTML = `
            <span>📊 Valutazioni totali (${config.name}): <strong>${register.length}</strong></span>
            <span>📈 Media punteggio: <strong>${avgScore}/100</strong></span>
            <span>🎯 Media voto: <strong>${avgGrade}/10</strong></span>
        `;
    } else {
        statsDiv.innerHTML = `<span>📊 Nessuna valutazione nel registro per ${config.name}</span>`;
    }

    // Aggiorna tabella
    tableBody.innerHTML = '';

    register.forEach((evaluation, index) => {
        const row = document.createElement('tr');

        // Costruisci celle per i punteggi dei criteri
        const criteriaKeys = Object.keys(config.scoreMapping);
        let scoreCells = '';
        criteriaKeys.forEach(key => {
            scoreCells += `<td>${evaluation.scores[key]?.score || '-'}</td>`;
        });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${evaluation.studentName}</strong></td>
            <td>${evaluation.className}</td>
            <td>${formatDateShort(evaluation.date)}</td>
            <td class="topic-cell">${truncateText(evaluation.topic, 30)}</td>
            ${scoreCells}
            <td><strong>${evaluation.totalScore}</strong></td>
            <td class="grade-cell"><strong>${evaluation.grade}</strong></td>
            <td class="judgment-cell">${evaluation.judgment}</td>
            <td class="actions-cell">
                <button class="btn-icon" onclick="viewEvaluation(${index})" title="Visualizza">👁️</button>
                <button class="btn-icon" onclick="editEvaluation(${index})" title="Modifica">✏️</button>
                <button class="btn-icon" onclick="deleteEvaluation(${index})" title="Elimina">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Scarica registro completo in Excel (VERSIONE MULTI-GRIGLIA)
function downloadExcelRegister() {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (register.length === 0) {
        alert('⚠️ Il registro è vuoto. Aggiungi almeno una valutazione prima di esportare.');
        return;
    }

    // Prepara dati per Excel
    const excelData = [];

    // Intestazioni dinamiche
    const headers = [
        'N°',
        'Nome e Cognome',
        'Classe',
        'Data',
        'Traccia'
    ];

    // Aggiungi intestazioni criteri
    const criteriaKeys = Object.keys(config.scoreMapping);
    criteriaKeys.forEach(key => {
        const name = config.criteriaNames[key];
        const max = config.maxScores[key];
        headers.push(`${name} (${max})`);
    });

    headers.push('Totale (100)', 'Voto (10)', 'Giudizio', 'Note');

    excelData.push(headers);

    // Dati studenti
    register.forEach((evaluation, index) => {
        const row = [
            index + 1,
            evaluation.studentName,
            evaluation.className,
            formatDateShort(evaluation.date),
            evaluation.topic
        ];

        // Aggiungi punteggi criteri
        criteriaKeys.forEach(key => {
            row.push(evaluation.scores[key]?.score || '-');
        });

        row.push(
            evaluation.totalScore,
            evaluation.grade,
            evaluation.judgment,
            evaluation.notes
        );

        excelData.push(row);
    });

    // Aggiungi statistiche
    excelData.push([]);
    excelData.push([`STATISTICHE CLASSE - ${config.name}`]);
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

    // Formattazione colonne dinamica
    const colWidths = [
        { wch: 5 },   // N°
        { wch: 25 },  // Nome
        { wch: 8 },   // Classe
        { wch: 12 },  // Data
        { wch: 40 },  // Traccia
    ];

    // Aggiungi larghezze per criteri
    criteriaKeys.forEach(() => {
        colWidths.push({ wch: 15 });
    });

    colWidths.push(
        { wch: 10 },  // Totale
        { wch: 8 },   // Voto
        { wch: 20 },  // Giudizio
        { wch: 50 }   // Note
    );

    ws['!cols'] = colWidths;

    // Aggiungi worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registro Valutazioni');

    // Crea secondo foglio con dettagli
    const detailsData = [[`DETTAGLI VALUTAZIONI - ${config.name}`]];
    detailsData.push([]);

    register.forEach((evaluation, index) => {
        detailsData.push([`STUDENTE ${index + 1}: ${evaluation.studentName}`]);
        detailsData.push(['Classe:', evaluation.className]);
        detailsData.push(['Data:', formatDateShort(evaluation.date)]);
        detailsData.push(['Traccia:', evaluation.topic]);
        detailsData.push([]);
        detailsData.push(['CRITERI DI VALUTAZIONE:']);

        criteriaKeys.forEach(key => {
            const score = evaluation.scores[key];
            if (score) {
                detailsData.push([
                    config.criteriaNames[key] + ':',
                    score.score + ' / ' + config.maxScores[key],
                    score.descriptor
                ]);
            }
        });

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
    ws2['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Dettagli Completi');

    // Nome file con data e tipo griglia
    const className = register[0]?.className || 'Classe';
    const gridType = currentGrid.charAt(0).toUpperCase() + currentGrid.slice(1);
    const today = new Date().toISOString().split('T')[0];
    const filename = `Registro_${gridType}_${className}_${today}.xlsx`;

    // Scarica file
    XLSX.writeFile(wb, filename);

    showNotification(`📥 Registro Excel scaricato: ${filename}`);
}

// Visualizza dettagli valutazione (VERSIONE MULTI-GRIGLIA)
function viewEvaluation(index) {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const evaluation = register[index];

    if (!evaluation) return;

    let details = `📝 VALUTAZIONE DETTAGLIATA - ${config.name}\n\n`;
    details += `Studente: ${evaluation.studentName}\n`;
    details += `Classe: ${evaluation.className}\n`;
    details += `Data: ${formatDateShort(evaluation.date)}\n`;
    details += `Traccia: ${evaluation.topic}\n\n`;
    details += `PUNTEGGI:\n`;

    const criteriaKeys = Object.keys(config.scoreMapping);
    criteriaKeys.forEach(key => {
        const score = evaluation.scores[key];
        if (score) {
            details += `- ${config.criteriaNames[key]}: ${score.score}/${config.maxScores[key]}\n`;
        }
    });

    details += `\nTOTALE: ${evaluation.totalScore}/100\n`;
    details += `VOTO: ${evaluation.grade}/10\n`;
    details += `GIUDIZIO: ${evaluation.judgment}\n`;

    if (evaluation.notes) {
        details += `\nNOTE:\n${evaluation.notes}`;
    }

    alert(details);
}

// Modifica valutazione esistente (VERSIONE MULTI-GRIGLIA)
function editEvaluation(index) {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const evaluation = register[index];

    if (!evaluation) return;

    // Imposta l'indice di modifica
    editingEvaluationIndex = index;

    // Carica dati nel form
    document.getElementById('studentName').value = evaluation.studentName;
    document.getElementById('className').value = evaluation.className;
    document.getElementById('assignmentDate').value = evaluation.date;
    document.getElementById('topic').value = evaluation.topic;
    document.getElementById('teacherNotes').value = evaluation.notes;

    // Carica le selezioni dei criteri
    const criteriaKeys = Object.keys(config.scoreMapping);
    criteriaKeys.forEach(criterionKey => {
        const score = evaluation.scores[criterionKey];
        if (score && score.level) {
            // Seleziona il radio button corrispondente
            const radio = document.querySelector(`input[name="${criterionKey}"][value="${score.level}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
    });

    // Ricalcola il punteggio per aggiornare la visualizzazione
    calculateScore();

    // Se il voto era stato modificato manualmente, ripristinalo
    if (evaluation.gradeManuallyEdited) {
        gradeManuallyEdited = true;
        document.getElementById('finalGrade').value = evaluation.grade;
        updateJudgmentFromGrade(parseFloat(evaluation.grade));
    }

    // Aggiorna stato pulsante
    updateEditButtonState();

    // Scroll alla sezione valutazione
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showNotification(`✏️ Modifica della valutazione di ${evaluation.studentName}. Modifica i dati e clicca su "Aggiungi a Registro Excel" per salvare le modifiche.`);
}

// Elimina valutazione specifica (VERSIONE MULTI-GRIGLIA)
function deleteEvaluation(index) {
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const evaluation = register[index];

    if (confirm(`Eliminare la valutazione di ${evaluation.studentName}?`)) {
        register.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(register));
        updateRegisterDisplay();
        showNotification(`🗑️ Valutazione eliminata.`);
    }
}

// Svuota registro (VERSIONE MULTI-GRIGLIA)
function clearRegister() {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const count = JSON.parse(localStorage.getItem(storageKey) || '[]').length;

    if (confirm(`⚠️ ATTENZIONE: Questa operazione eliminerà TUTTE le ${count} valutazioni del registro "${config.name}".\n\nSei sicuro di voler continuare?`)) {
        if (confirm(`Confermi di voler eliminare definitivamente tutte le ${count} valutazioni?`)) {
            localStorage.removeItem(storageKey);
            updateRegisterDisplay();
            showNotification(`🗑️ Registro "${config.name}" svuotato completamente.`);
        }
    }
}

// Aggiorna lo stato visuale del pulsante quando si modifica
function updateEditButtonState() {
    const addButton = document.querySelector('button[onclick="addToExcelRegister()"]');
    const cancelButton = document.getElementById('cancelEditBtn');

    if (!addButton) return;

    if (editingEvaluationIndex !== null && editingEvaluationIndex >= 0) {
        // Modalità modifica
        addButton.innerHTML = '✏️ Salva Modifiche al Registro';
        addButton.style.backgroundColor = '#ff9800';
        addButton.style.borderColor = '#ff9800';

        // Mostra pulsante annulla
        if (cancelButton) {
            cancelButton.style.display = 'inline-block';
        }
    } else {
        // Modalità normale
        addButton.innerHTML = '📊 Aggiungi a Registro Excel';
        addButton.style.backgroundColor = '';
        addButton.style.borderColor = '';

        // Nascondi pulsante annulla
        if (cancelButton) {
            cancelButton.style.display = 'none';
        }
    }
}

// Annulla modifica e torna alla modalità aggiunta
function cancelEdit() {
    editingEvaluationIndex = null;
    updateEditButtonState();
    resetForm();
    showNotification('❌ Modifica annullata.');
}

// Stampa registro completo in PDF (1 foglio A4 per studente)
function printRegisterAsPDF() {
    const config = getCurrentGridConfig();
    const storageKey = getCurrentStorageKey();
    const register = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (register.length === 0) {
        alert('⚠️ Il registro è vuoto. Aggiungi almeno una valutazione prima di stampare.');
        return;
    }

    // Crea una nuova finestra per la stampa
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert('⚠️ Impossibile aprire la finestra di stampa. Verifica le impostazioni del popup blocker.');
        return;
    }

    // Genera HTML per la stampa
    let htmlContent = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro Valutazioni - ${config.name}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            color: #333;
            line-height: 1.4;
        }

        .page {
            width: 100%;
            min-height: 100vh;
            max-height: 100vh;
            page-break-after: always;
            padding: 15px;
            display: flex;
            flex-direction: column;
        }

        .page:last-child {
            page-break-after: auto;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .school-name {
            font-size: 11px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 3px;
        }

        .document-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 3px;
        }

        .grid-type {
            font-size: 13px;
            color: #34495e;
            font-style: italic;
        }

        .student-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 3px 5px rgba(0,0,0,0.1);
        }

        .student-name {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .student-details {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            opacity: 0.95;
            margin-bottom: 8px;
        }

        .student-topic {
            font-size: 11px;
            opacity: 0.9;
            font-style: italic;
            margin-top: 5px;
        }

        .grade-section {
            background: #f8f9fa;
            border-left: 4px solid #27ae60;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
            text-align: center;
        }

        .grade-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
        }

        .grade-value {
            font-size: 48px;
            font-weight: bold;
            color: #27ae60;
            line-height: 1;
        }

        .notes-section {
            flex-grow: 1;
            background: white;
            border: 1.5px solid #e0e0e0;
            border-radius: 4px;
            padding: 15px;
            max-height: 450px;
            overflow: hidden;
        }

        .notes-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #3498db;
        }

        .notes-content {
            font-size: 11px;
            color: #2c3e50;
            white-space: pre-wrap;
            line-height: 1.5;
            max-height: 390px;
            overflow: hidden;
        }

        .footer {
            margin-top: auto;
            padding-top: 10px;
            border-top: 1px solid #bdc3c7;
            text-align: center;
            font-size: 9px;
            color: #95a5a6;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .page {
                page-break-after: always;
            }

            .page:last-child {
                page-break-after: auto;
            }
        }
    </style>
</head>
<body>
`;

    // Genera una pagina per ogni studente
    register.forEach((evaluation, index) => {
        const date = new Date().toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        htmlContent += `
    <div class="page">
        <div class="header">
            <div class="school-name">Liceo delle Scienze Umane</div>
            <div class="document-title">Scheda di Valutazione</div>
            <div class="grid-type">${config.name}</div>
        </div>

        <div class="student-info">
            <div class="student-name">${evaluation.studentName}</div>
            <div class="student-details">
                <span>📚 Classe: ${evaluation.className}</span>
                <span>📅 Data: ${formatDateShort(evaluation.date)}</span>
            </div>
            <div class="student-topic">📝 Traccia: ${evaluation.topic}</div>
        </div>

        <div class="grade-section">
            <div class="grade-label">Valutazione Finale</div>
            <div class="grade-value">${evaluation.grade}/10</div>
        </div>

        <div class="notes-section">
            <div class="notes-title">📝 Note e Commenti del Docente</div>
            <div class="notes-content">${evaluation.notes || 'Nessuna nota disponibile.'}</div>
        </div>

        <div class="footer">
            Documento generato il ${date} - Pagina ${index + 1} di ${register.length}
        </div>
    </div>
`;
    });

    htmlContent += `
</body>
</html>
`;

    // Scrivi il contenuto nella finestra di stampa
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Attendi che il contenuto sia caricato e poi stampa
    printWindow.onload = function() {
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            showNotification(`📄 Apertura finestra stampa PDF con ${register.length} studenti...`);
        }, 250);
    };
}
