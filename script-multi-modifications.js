// Multi-Grid Modifications
// Sovrascrive funzioni di script.js per supportare multiple griglie

// Stato di modifica: traccia se stiamo modificando una valutazione esistente
let editingEvaluationIndex = null;

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
        grade: document.getElementById('finalGrade').textContent,
        judgment: document.getElementById('judgment').textContent,
        notes: document.getElementById('teacherNotes').value || '',
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
