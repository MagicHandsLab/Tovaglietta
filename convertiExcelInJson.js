const xlsx = require('xlsx');
const fs = require('fs');

// Specifica il percorso del file Excel e il nome del file JSON di output
const nomeFileExcel = 'database.xlsx';
const nomeFileJson = 'database.json';

function convertiExcelInJson() {
    // Leggi il file Excel
    const workbook = xlsx.readFile(nomeFileExcel);

    // Seleziona il primo foglio di lavoro
    const nomeFoglio = workbook.SheetNames[0];
    const foglio = workbook.Sheets[nomeFoglio];

    // Converte il foglio di lavoro in un array di oggetti JSON
    const datiJson = xlsx.utils.sheet_to_json(foglio);

    // Scrive i dati JSON in un file
    fs.writeFileSync(nomeFileJson, JSON.stringify(datiJson, null, 2));

    console.log(`Conversione completata! I dati sono stati salvati in ${nomeFileJson}`);
}

convertiExcelInJson();
