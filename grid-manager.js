// Grid Manager - Gestione Multi-Griglia
// Gestisce il cambio tra diverse griglie di valutazione

// Configurazione griglie
const grids = {
    tema: {
        name: 'Tema / Testo Argomentativo',
        criteria: 5,
        scoreMapping: {
            criterion1: {8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5},
            criterion2: {8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4},
            criterion3: {8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4},
            criterion4: {8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4},
            criterion5: {8: 14.5, 7: 12.5, 6: 10.5, 5: 9, 4: 7.5, 3: 5.5, 2: 3}
        },
        criteriaNames: {
            criterion1: "Contenuto e Pertinenza",
            criterion2: "Organizzazione e Coerenza",
            criterion3: "Competenza Morfosintattica",
            criterion4: "Lessico e Registro",
            criterion5: "Capacità Critica e Riflessiva"
        },
        maxScores: {
            criterion1: 25,
            criterion2: 20,
            criterion3: 20,
            criterion4: 20,
            criterion5: 15
        },
        storageKey: 'excelRegister_tema'
    },
    riassunto: {
        name: 'Riassunto Testo in Prosa',
        criteria: 5,
        scoreMapping: {
            criterion1_rias: {8: 29, 7: 25.5, 6: 21.5, 5: 18.5, 4: 16, 3: 12, 2: 7},
            criterion2_rias: {8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5},
            criterion3_rias: {8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4},
            criterion4_rias: {8: 14.5, 7: 12.5, 6: 10.5, 5: 9, 4: 7.5, 3: 5.5, 2: 3},
            criterion5_rias: {8: 10, 7: 8.5, 6: 7, 5: 6, 4: 5, 3: 3.5, 2: 1.5}
        },
        criteriaNames: {
            criterion1_rias: "Comprensione e Selezione Informazioni",
            criterion2_rias: "Capacità di Sintesi e Riduzione",
            criterion3_rias: "Coerenza e Coesione Testuale",
            criterion4_rias: "Correttezza Morfosintattica e Lessicale",
            criterion5_rias: "Oggettività e Riformulazione Personale"
        },
        maxScores: {
            criterion1_rias: 30,
            criterion2_rias: 25,
            criterion3_rias: 20,
            criterion4_rias: 15,
            criterion5_rias: 10
        },
        storageKey: 'excelRegister_riassunto'
    },
    grammatica: {
        name: 'Verifica Grammatica Italiana',
        criteria: 5,
        scoreMapping: {
            criterion1_gram: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion2_gram: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion3_gram: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion4_gram: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion5_gram: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4}
        },
        criteriaNames: {
            criterion1_gram: "Verbi Transitivi e Intransitivi",
            criterion2_gram: "Riconoscimento Soggetto",
            criterion3_gram: "Complemento Oggetto",
            criterion4_gram: "Complementi Indiretti",
            criterion5_gram: "Preposizioni"
        },
        maxScores: {
            criterion1_gram: 20,
            criterion2_gram: 20,
            criterion3_gram: 20,
            criterion4_gram: 20,
            criterion5_gram: 20
        },
        storageKey: 'excelRegister_grammatica'
    },
    latino: {
        name: 'Verifica Latino (Verbi + I Decl.)',
        criteria: 5,
        scoreMapping: {
            criterion1_lat: {8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5},
            criterion2_lat: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion3_lat: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion4_lat: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion5_lat: {8: 14.5, 7: 12.5, 6: 10.5, 5: 9, 4: 7.5, 3: 5.5, 2: 3}
        },
        criteriaNames: {
            criterion1_lat: "Analisi e Traduzione Verbi",
            criterion2_lat: "Analisi e Traduzione Nomi I Declinazione",
            criterion3_lat: "Traduzione Latino → Italiano",
            criterion4_lat: "Traduzione Italiano → Latino",
            criterion5_lat: "Riconoscimento Apposizioni e Attributi"
        },
        maxScores: {
            criterion1_lat: 25,
            criterion2_lat: 20,
            criterion3_lat: 20,
            criterion4_lat: 20,
            criterion5_lat: 15
        },
        storageKey: 'excelRegister_latino'
    },
    versione: {
        name: 'Versione di Latino',
        criteria: 5,
        scoreMapping: {
            criterion1_vers: {8: 19.5, 7: 17.5, 6: 15.5, 5: 13, 4: 10, 3: 7, 2: 4},
            criterion2_vers: {8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5},
            criterion3_vers: {8: 24, 7: 21, 6: 18, 5: 15.5, 4: 13, 3: 9.5, 2: 5.5},
            criterion4_vers: {8: 19.5, 7: 17.5, 6: 15, 5: 12.5, 4: 10, 3: 7, 2: 4},
            criterion5_vers: {8: 10, 7: 8.5, 6: 7, 5: 6, 4: 5, 3: 3.5, 2: 1.5}
        },
        criteriaNames: {
            criterion1_vers: "Analisi Morfologica",
            criterion2_vers: "Analisi Sintattica e Costrutti",
            criterion3_vers: "Comprensione del Testo",
            criterion4_vers: "Traduzione in Italiano",
            criterion5_vers: "Lessico e Scelte Traduttive"
        },
        maxScores: {
            criterion1_vers: 20,
            criterion2_vers: 25,
            criterion3_vers: 25,
            criterion4_vers: 20,
            criterion5_vers: 10
        },
        storageKey: 'excelRegister_versione'
    }
};

// Griglia attualmente selezionata
let currentGrid = 'tema';

// Funzione per cambiare griglia
function selectGrid(gridType) {
    // Aggiorna griglia corrente
    currentGrid = gridType;

    // Aggiorna UI bottoni
    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${gridType}`).classList.add('active');

    // Nascondi tutte le griglie
    document.querySelectorAll('.evaluation-grid').forEach(grid => {
        grid.style.display = 'none';
    });

    // Mostra griglia selezionata
    document.getElementById(`grid-${gridType}`).style.display = 'block';

    // Aggiorna nome griglia corrente
    document.getElementById('currentGridName').textContent = grids[gridType].name;

    // Reset form
    resetFormForNewGrid();

    // Aggiorna visualizzazione registro
    updateRegisterDisplay();
}

// Reset form quando si cambia griglia
function resetFormForNewGrid() {
    // Mantieni dati studente
    const studentName = document.getElementById('studentName').value;
    const className = document.getElementById('className').value;
    const date = document.getElementById('assignmentDate').value;

    // Deseleziona tutti i radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Reset punteggi
    document.getElementById('totalScore').textContent = '0';
    const gradeInput = document.getElementById('finalGrade');
    if (gradeInput) {
        gradeInput.value = '';
        gradeInput.readOnly = true;
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

    // Reset note
    document.getElementById('teacherNotes').value = '';

    // Ripristina dati studente
    document.getElementById('studentName').value = studentName;
    document.getElementById('className').value = className;
    document.getElementById('assignmentDate').value = date;

    // Reinizializza i listener per la nuova griglia
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

    showNotification(`Griglia cambiata: ${grids[currentGrid].name}`);
}

// Ottieni configurazione griglia corrente
function getCurrentGridConfig() {
    return grids[currentGrid];
}

// Ottieni key localStorage per griglia corrente
function getCurrentStorageKey() {
    return grids[currentGrid].storageKey;
}
