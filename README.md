# Sistema Multi-Griglia di Valutazione
## Liceo delle Scienze Umane - Biennio

### Descrizione

Applicazione web professionale per la valutazione di prove scritte (Italiano e Latino) nel biennio del Liceo delle Scienze Umane. Il sistema integra **5 griglie di valutazione** complete, basate sulle migliori metodologie didattiche internazionali e sulle indicazioni nazionali MIUR.

### Metodologie Applicate

L'applicazione integra le seguenti metodologie pedagogiche:

1. **Tassonomia di Bloom** - Per la valutazione delle competenze cognitive (conoscenza, comprensione, applicazione, analisi, sintesi, valutazione)
2. **Rubric Assessment AAC&U** - Sistema di valutazione basato su descrittori di livello chiari e oggettivi
3. **Indicazioni Nazionali MIUR** - Criteri specifici per il biennio del Liceo delle Scienze Umane
4. **Framework Europeo delle Competenze Linguistiche** - Standard internazionali per la valutazione linguistica

### Caratteristiche Principali

#### 5 Criteri di Valutazione

1. **Contenuto e Pertinenza alla Traccia** (25 punti)
   - Comprensione della traccia
   - Ricchezza e profondità del contenuto
   - Originalità e apporti personali

2. **Organizzazione e Coerenza Testuale** (20 punti)
   - Struttura del testo
   - Argomentazione logica
   - Coerenza tra le parti

3. **Competenza Morfosintattica** (20 punti)
   - Correttezza grammaticale
   - Sintassi articolata
   - Assenza di errori morfologici

4. **Lessico e Registro Linguistico** (20 punti)
   - Ricchezza lessicale
   - Proprietà di linguaggio
   - Adeguatezza del registro

5. **Capacità Critica e Riflessiva** (15 punti)
   - Elaborazione personale
   - Riflessione critica
   - Maturità di pensiero

#### Livelli di Valutazione

Ogni criterio prevede 7 livelli di valutazione:

- **Eccellente** (90-100%)
- **Buono** (80-89%)
- **Discreto** (70-79%)
- **Sufficiente** (60-69%)
- **Mediocre** (50-59%)
- **Insufficiente** (35-49%)
- **Gravemente Insufficiente** (<35%)

### Funzionalità

#### Valutazione

- ✅ Selezione intuitiva dei livelli per ogni criterio
- ✅ Calcolo automatico del punteggio totale (0-100)
- ✅ Conversione automatica in voto decimale (1-10)
- ✅ Giudizio qualitativo automatico
- ✅ Breakdown dettagliato con grafici di progresso

#### 🆕 Gestione Registro Excel (NOVITÀ!)

- 📊 **Registro cumulativo** - Aggiungi valutazioni una alla volta
- 📥 **Esportazione Excel completa** - File .xlsx professionale con 2 fogli
- 📈 **Statistiche automatiche** - Media classe, distribuzione giudizi
- 👁️ **Visualizzazione registro** - Tabella interattiva con tutte le valutazioni
- 🗑️ **Gestione valutazioni** - Visualizza, elimina, modifica registro
- 💾 **Persistenza locale** - I dati rimangono salvati nel browser

#### Gestione Dati

- 💾 **Salvataggio automatico** in localStorage
- 📥 **Esportazione JSON** con tutti i dati della valutazione
- 🖨️ **Stampa** ottimizzata per documenti cartacei
- 📄 **Esportazione PDF** tramite funzione di stampa del browser
- 📊 **Excel professionale** con statistiche e dettagli completi

#### Interfaccia

- 📱 **Design responsive** - funziona su desktop, tablet e smartphone
- 🎨 **Interfaccia moderna** con gradients e animazioni fluide
- ♿ **Accessibile** - supporto completo per lettori di schermo
- 🌈 **Visual feedback** - card interattive con hover e selezione evidenziata

### Come Utilizzare

#### Workflow Base (Singola Valutazione)

1. **Apri l'applicazione**
   ```bash
   # Apri index.html nel browser
   open index.html
   # oppure
   firefox index.html
   # oppure doppio click sul file
   ```

2. **Inserisci i dati dello studente**
   - Nome e Cognome
   - Classe (es. 1A)
   - Data
   - Traccia/Argomento del tema

3. **Valuta ogni criterio**
   - Seleziona il livello appropriato per ciascuno dei 5 criteri
   - Leggi attentamente i descrittori di ogni livello
   - Il punteggio si aggiorna automaticamente

4. **Aggiungi note qualitative**
   - Inserisci commenti specifici
   - Evidenzia punti di forza
   - Indica aree di miglioramento

5. **Visualizza e salva**
   - Controlla il punteggio totale e il voto
   - Stampa o esporta la valutazione
   - Salva in formato JSON per lo storico

#### 🆕 Workflow Registro Excel (Classe Completa)

1. **Valuta il primo studente** (come sopra, punti 2-4)

2. **Clicca "📊 Aggiungi a Registro Excel"**
   - La valutazione viene salvata nel registro
   - Ricevi conferma di salvataggio
   - Il form si resetta per il prossimo studente

3. **Ripeti per ogni studente della classe**
   - Valuta tema successivo
   - Aggiungi al registro
   - Continua fino a completare tutti

4. **Visualizza il registro** (opzionale)
   - Clicca "👁️ Mostra/Nascondi Registro"
   - Controlla statistiche della classe
   - Verifica che tutti gli studenti siano presenti

5. **Scarica il file Excel completo**
   - Clicca "📥 Scarica Registro Completo Excel"
   - Il file include 2 fogli:
     - Registro sintetico con statistiche
     - Dettagli completi con descrittori
   - Condividi con la classe o la segreteria

📖 **Guida dettagliata Excel**: Vedi `GUIDA_EXCEL.md`

### Conversione Punteggio-Voto

Il sistema utilizza una conversione proporzionale:

- **0-59 punti** → Voti 1-5.5 (Insufficiente)
- **60-100 punti** → Voti 6-10 (Sufficiente-Eccellente)

| Punteggio | Voto | Giudizio |
|-----------|------|----------|
| 90-100 | 9-10 | Eccellente |
| 80-89 | 8-8.5 | Ottimo |
| 70-79 | 7-7.5 | Buono |
| 60-69 | 6-6.5 | Discreto |
| 55-59 | 5.5-6 | Sufficiente |
| 45-54 | 4.5-5.5 | Mediocre |
| 30-44 | 3-4.5 | Insufficiente |
| 0-29 | 1-3 | Gravemente Insufficiente |

### File dell'Applicazione

```
griglia-valutazione/
├── index.html                    # Struttura HTML - 5 griglie complete
├── styles.css                    # Stili e design responsive
├── script.js                     # Logica di calcolo base
├── script-multi-modifications.js # Override funzioni multi-griglia
├── grid-manager.js               # Configurazione 5 griglie
├── README.md                     # Documentazione principale
├── DEMO.html                     # Demo funzionalità
├── GUIDA_EXCEL.md               # Guida registri Excel
├── GUIDA_RIASSUNTO.md           # Metodologia riassunti
├── GUIDA_GRAMMATICA.md          # Teoria grammatica italiana
├── GUIDA_LATINO.md              # Morfosintassi latino base
└── GUIDA_VERSIONI_LATINO.md     # Traduzione versioni latino
```

### Tecnologie Utilizzate

- **HTML5** - Struttura semantica accessibile
- **CSS3** - Design moderno con gradients, flexbox e grid
- **JavaScript ES6+** - Logica applicativa e gestione dello stato
- **LocalStorage API** - Persistenza dati lato client
- **Print API** - Esportazione ottimizzata
- **SheetJS (xlsx)** - Libreria per generazione file Excel .xlsx

### Compatibilità Browser

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Vantaggi Pedagogici

1. **Oggettività** - Criteri chiari e descrittori dettagliati riducono la soggettività
2. **Trasparenza** - Gli studenti possono comprendere facilmente i criteri di valutazione
3. **Feedback costruttivo** - Spazio dedicato per commenti qualitativi
4. **Tracciabilità** - Storico completo delle valutazioni
5. **Efficienza** - Riduzione dei tempi di correzione grazie al calcolo automatico

### Riferimenti Pedagogici

- **Bloom, B. S.** (1956). Taxonomy of Educational Objectives
- **AAC&U** - Association of American Colleges and Universities - VALUE Rubrics
- **MIUR** - Indicazioni Nazionali per i Licei (2010)
- **Consiglio d'Europa** - Quadro Comune Europeo di Riferimento per le Lingue

### Personalizzazione

Per adattare l'applicazione alle esigenze specifiche della tua scuola:

1. **Modificare i punteggi**: Edita `scoreMapping` in `script.js`
2. **Cambiare i criteri**: Modifica le sezioni dei criteri in `index.html`
3. **Aggiustare i colori**: Personalizza le variabili CSS in `:root` nel file `styles.css`
4. **Modificare i livelli**: Aggiungi o rimuovi card di livello in ogni criterio

### Licenza

Applicazione sviluppata per uso didattico nel contesto del sistema scolastico italiano.

### Supporto

Per domande o suggerimenti riguardo all'applicazione, consulta la documentazione MIUR sulle griglie di valutazione o rivolgiti al coordinamento didattico del tuo istituto.

---

## 🆕 Novità Versione 4.0 - Sistema Multi-Griglia Completo

### 🎯 Menu Selezione Griglie - 5 Griglie Attive!

L'applicazione supporta **5 griglie di valutazione professionali** completamente operative:

1. **📝 Tema / Testo Argomentativo** ✅ ATTIVA
   - 5 criteri di valutazione
   - Tot 100 punti (25+20+20+20+15)
   - Metodologia: Bloom + AAC&U + MIUR

2. **📄 Riassunto Testo in Prosa** ✅ ATTIVA
   - 5 criteri specifici per riassunti
   - Tot 100 punti (30+25+20+15+10)
   - Metodologia: Brown-Day + PISA + PIRLS + CEFR

3. **📚 Verifica Grammatica Italiana** ✅ ATTIVA
   - 5 criteri grammaticali
   - Tot 100 punti (20+20+20+20+20)
   - Metodologia: LEND + GISCEL + Tesnière + Chomsky + Halliday
   - Argomenti: Verbi transitivi/intransitivi, Soggetto, Complemento oggetto, Complementi indiretti, Preposizioni

4. **🏛️ Verifica Latino (Verbi + I Decl.)** ✅ ATTIVA
   - 5 criteri morfosintattici
   - Tot 100 punti (25+20+20+20+15)
   - Metodologia: AICC + Cambridge + Ørberg + ACL + JACT
   - Argomenti: Analisi verbi, Analisi I declinazione, Traduzione bidirezionale, Apposizioni e attributi

5. **📜 Versione di Latino** ✅ ATTIVA
   - 5 criteri per traduzione brani
   - Tot 100 punti (20+25+25+20+10)
   - Metodologia: AICC + JACT + ACL + Translation Studies
   - Competenze: Morfologia, Sintassi e costrutti, Comprensione testuale, Traduzione, Lessico

### Gestione Registri Separati

✨ **Ogni griglia ha il proprio registro Excel separato**
- Registro Temi salvato indipendentemente
- Registro Riassunti salvato indipendentemente
- Registro Grammatica salvato indipendentemente
- Registro Verifiche Latino salvato indipendentemente
- Registro Versioni Latino salvato indipendentemente
- Export Excel personalizzato per tipo di prova
- Statistiche separate per ogni tipologia di valutazione

### Griglia Riassunto - Criteri Best of Breed

**Metodologie Internazionali Applicate:**
- 🇺🇸 **NCTE** (National Council of Teachers of English)
- 🌍 **PISA Reading Framework** (OECD)
- 📚 **PIRLS** (International Reading Literacy Study)
- 🇪🇺 **CEFR** (Common European Framework)
- 📖 **Brown-Day Methodology** (Summarization Rules)

**I 5 Criteri:**
1. **Comprensione e Selezione Informazioni** (30 pt)
2. **Capacità di Sintesi e Riduzione** (25 pt)
3. **Coerenza e Coesione Testuale** (20 pt)
4. **Correttezza Morfosintattica e Lessicale** (15 pt)
5. **Oggettività e Riformulazione Personale** (10 pt)

### Griglia Grammatica Italiana - Criteri Linguistici

**Metodologie Italiane e Internazionali:**
- 🇮🇹 **LEND** (Lingua e Nuova Didattica) + **GISCEL** (Gruppo Intervento Educazione Linguistica)
- 🌍 **Tesnière** (Dependency Grammar) + **Chomsky** (Generative Grammar) + **Halliday** (Functional Grammar)

**I 5 Criteri:**
1. **Verbi Transitivi e Intransitivi** (20 pt)
2. **Riconoscimento Soggetto** (20 pt)
3. **Complemento Oggetto** (20 pt)
4. **Complementi Indiretti** (20 pt)
5. **Preposizioni** (20 pt)

### Griglia Verifica Latino - Morfosintassi Base

**Metodologie Lingue Classiche:**
- 🇮🇹 **AICC** (Associazione Italiana Cultura Classica)
- 🌍 **Cambridge Latin Course** + **Ørberg Method** + **ACL Standards** + **JACT Reading Latin**

**I 5 Criteri:**
1. **Analisi e Traduzione Verbi** (25 pt)
2. **Analisi e Traduzione Nomi I Declinazione** (20 pt)
3. **Traduzione Latino → Italiano** (20 pt)
4. **Traduzione Italiano → Latino** (20 pt)
5. **Riconoscimento Apposizioni e Attributi** (15 pt)

### Griglia Versione di Latino - Traduzione Brani

**Metodologie Translation Studies:**
- 🇮🇹 **AICC** + **CUSL** (Consulta Universitaria Studi Latini)
- 🌍 **JACT Reading Latin** + **ACL Standards** + **Translation Theory**

**I 5 Criteri:**
1. **Analisi Morfologica** (20 pt) - Riconoscimento forme verbali e nominali
2. **Analisi Sintattica e Costrutti** (25 pt) - Participio congiunto, ablativo assoluto, cum narrativo, perifrastiche
3. **Comprensione del Testo** (25 pt) - Comprensione letterale, inferenziale, critica
4. **Traduzione in Italiano** (20 pt) - Correttezza, fluidità, naturalezza
5. **Lessico e Scelte Traduttive** (10 pt) - Proprietà lessicale e appropriatezza contestuale

## 🆕 Novità Versione 2.0

### Funzionalità Excel Integrate

✨ **Registro Cumulativo**
- Aggiungi valutazioni una alla volta
- Accumula tutte le valutazioni della classe
- Persistenza automatica nel browser

📊 **Esportazione Excel Professionale**
- File .xlsx con 2 fogli di lavoro
- Tabella riepilogativa con tutti gli studenti
- Foglio dettagli con descrittori completi
- Statistiche automatiche della classe

📈 **Analytics Integrati**
- Media punteggio classe in tempo reale
- Media voto classe
- Distribuzione giudizi
- Numero totale valutazioni

👁️ **Visualizzazione Interattiva**
- Tabella registro visualizzabile nell'app
- Azioni rapide (visualizza, elimina)
- Statistiche aggiornate in tempo reale

### Benefici per i Docenti

✅ **Workflow ottimizzato**: Valuta → Aggiungi → Esporta
✅ **Zero configurazione**: Nessun server, tutto in locale
✅ **Comunicazione facilitata**: Excel pronto per condivisione
✅ **Backup automatico**: Salvataggio locale persistente
✅ **Analisi immediata**: Statistiche classe automatiche

---

**Versione**: 4.0 (Sistema Multi-Griglia Completo - 5 Griglie)
**Ultima modifica**: Gennaio 2025
**Target**: Liceo delle Scienze Umane - Biennio (classi 1ª e 2ª)

**Changelog:**
- v4.0: Aggiunta quinta griglia Versione Latino + guide metodologiche complete per tutte le griglie
- v3.0: Sistema multi-griglia con menu selezione, griglia riassunto, grammatica italiana, verifica latino
- v2.0: Gestione registro Excel cumulativo con esportazione professionale
- v1.0: Griglia singola tema con valutazione automatica

**Guide Metodologiche Disponibili:**
- 📖 GUIDA_EXCEL.md - Gestione registri Excel
- 📖 GUIDA_RIASSUNTO.md - Metodologia riassunti
- 📖 GUIDA_GRAMMATICA.md - Teoria grammaticale italiana
- 📖 GUIDA_LATINO.md - Morfosintassi latino base
- 📖 GUIDA_VERSIONI_LATINO.md - Traduzione versioni di latino
