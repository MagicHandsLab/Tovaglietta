// Inizializza il canvas di Fabric.js
const canvas = new fabric.Canvas('tovaglietta-canvas');
// Funzione per scaricare l'immagine del canvas
const padding = 20; // Margine in pixel attorno all'immagine

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.width * (img.height / img.width);

    // Ridimensiona l'immagine tenendo conto del padding
    const imgWidth = canvas.width - padding * 2;
    const imgHeight = canvas.height - padding * 2;

    // Pulisci e disegna l'immagine centrata con il padding
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, padding, padding, imgWidth, imgHeight);
}
// Prezzi di base
const prezzoBase = 10.00; // Prezzo di base della tovaglietta
const costoNome = 2.00;  // Costo per aggiungere un nome
const costoAccessorio = 0.50; // Costo per aggiungere un accessorio

// Variabile per tracciare il prezzo totale
let prezzoTotale = prezzoBase;

// Funzione per aggiornare il prezzo nel DOM
//function aggiornaPrezzo() {
//    document.getElementById("prezzoTotaleValue").textContent = prezzoTotale.toFixed(2);
//}
function scaricaImmagine() {
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1
    });

    // Creazione di un link per il download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'tovaglietta.png';
    link.click();
    console.log(dataURL);
}
// Assegna la funzione al pulsante di download
document.getElementById('scarica-immagine').addEventListener('click', scaricaImmagine);
document.getElementById('rimuovi-oggetto').addEventListener('click', rimuoviOggetto);
// Mostra il modal
// Event listener per chiudere il modal quando si clicca sulla 'x'


// Funzione per caricare la tovaglietta selezionata
function selezionaTovaglietta(tovagliettaSrc) {
    console.log("Selezionata tovaglietta:", tovagliettaSrc); // Debug: verifica quale tovaglietta è stata selezionata
    fabric.Image.fromURL(tovagliettaSrc, function(img) {
        if (!img) {
            console.error("Errore nel caricamento dell'immagine:", tovagliettaSrc);
            return;
        }
        // Imposta la tovaglietta centrale e non trascinabile
        img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        // Pulisce il canvas e aggiunge la tovaglietta selezionata
        canvas.clear();
        canvas.add(img);
        canvas.sendToBack(img); // Manda la tovaglietta sullo sfondo

        console.log("Tovaglietta caricata nel canvas con successo."); // Debug: conferma caricamento
    }, { crossOrigin: 'anonymous' }); // Aggiunge crossOrigin se serve per immagini da URL esterni
    // Evidenzia la tovaglietta selezionata
    document.querySelectorAll("#tovagliette-lista img").forEach(img => img.classList.remove("selected"));
    const selectedImg = document.querySelector(`#tovagliette-lista img[src="${tovagliettaSrc}"]`);
    if (selectedImg) {
        selectedImg.classList.add("selected");
    } else {
        console.error("Immagine della tovaglietta non trovata nella lista:", tovagliettaSrc);
    }
}
    let magazzino;

    // Carica i dati dal JSON
    fetch("database.json")
        .then(response => response.json())
        .then(data => {
            magazzino = data;
            console.log("Magazzino caricato:", magazzino); // Log per controllare i dati

        })
        .catch(error => console.error("Errore nel caricamento del magazzino:", error));

    // Funzione per aprire il modal e mostrare gli oggetti disponibili
function apriModal(oggettoNome, elemento) {
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('accessoriModal');
    const listaOggetti = document.getElementById('listaOggetti');
    listaOggetti.innerHTML = ''; // Pulisce il contenuto precedente

    const oggettiDisponibili = magazzino[oggettoNome]?.filter(obj => obj.quantità > 0) || [];
    
    // Se non ci sono oggetti disponibili, mostra un messaggio
    if (oggettiDisponibili.length === 0) {
        listaOggetti.innerHTML = "<p>Nessun oggetto disponibile</p>";
        return;
    }

    // Aggiunge gli oggetti disponibili al modal
    oggettiDisponibili.forEach(oggetto => {
        const imgElement = document.createElement('img');
        imgElement.src = oggetto.immagine;
        imgElement.alt = oggetto.nome;
        imgElement.style.width = '40px';
        imgElement.style.cursor = 'pointer';
        imgElement.style.margin = '10px';

        // Aggiunge evento di click per inserire l'oggetto nel canvas
        imgElement.addEventListener('click', () => {
            aggiungiAccessorio(oggetto.immagine);
            chiudiModal();
        });

        listaOggetti.appendChild(imgElement);
    });
    

   // Mostra overlay e popup centrato
    overlay.style.display = 'block';
    modal.style.display = 'flex';
}
function chiudiModal() {
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('accessoriModal');

    // Nasconde overlay e popup
    overlay.style.display = 'none';
    modal.style.display = 'none';
}
document.getElementById('overlay').addEventListener('click', function () {
    chiudiModal();
});
document.addEventListener('DOMContentLoaded', function() {
    const oggettiClickable = document.querySelectorAll('.oggetto');
    oggettiClickable.forEach(oggetto => {
        oggetto.addEventListener('click', () => {
            const oggettoNome = oggetto.getAttribute('data-nome');
            apriModal(oggettoNome, oggetto); // Passa l'elemento cliccato
        });
    });
});    
function aggiungiAccessorio(srcImmagine) {
    console.log("Selezionato Accessorio:", srcImmagine); // Debug: verifica quale accessorio è stato selezionato
    fabric.Image.fromURL(srcImmagine, function(img) {
        if (!img) {
            console.error("Errore nel caricamento dell'immagine:", srcImmagine);
            return;
        }
        img.set({
            left: 100,  // posizione orizzontale iniziale
            top: 100,   // posizione verticale iniziale
            selectable: true,  // permette di selezionare e trascinare l'oggetto
            lockScalingX: true, // blocca il ridimensionamento in larghezza
            lockScalingY: true, // blocca il ridimensionamento in altezza
            hasControls: true,  // abilita i controlli (incl. rotazione)
            hasBorders: true,   // mostra i bordi di selezione
            cornerStyle: 'circle', // per visualizzare gli angoli arrotondati
            tipo: 'accessorio'
        });

        // Aggiungi l'accessorio al canvas e rendilo attivo per il posizionamento
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
    });
     // Chiudi il modal dopo aver selezionato un accessorio
    chiudiModal();
    //prezzoTotale += costoAccessorio;
    //aggiornaPrezzo();

     // Funzione per chiudere il modal

}
window.onclick = function(event) {
        const modal = document.getElementById('accessoriModal');
        if (event.target === modal) {
            chiudiModal();
        }
};
function aggiungiTesto() {
    const textbox = new fabric.Textbox('Inserisci il tuo nome', {
        left: 150,      // posizione iniziale a sinistra
        top: 150,       // posizione iniziale dall'alto
        fontSize: 30,   // dimensione del testo
        fill: '#000001', // colore del testo
        editable: true, // rende il testo modificabile dall'utente
        selectable: true, // permette di trascinare la casella
        textAlign: 'center' // allinea il testo al centro della casella
    });
    
    // Aggiungi la casella di testo al canvas
    //canvas.add(textbox);
    //prezzoTotale += costoNome;
    //aggiornaPrezzo();

    console.log("Casella di testo aggiunta.");
}

function aggiungiTestoCurvo(testString) {
    const radius = 100; // Raggio dell'arco per il testo curvo
    const startAngle = -Math.PI / 2; // Inizia a metà cerchio (angolo in alto)
    const angleStep = Math.PI / testString.length; // Passo angolare tra ogni lettera

    // Aggiungi ogni lettera separatamente
    for (let i = 0; i < testString.length; i++) {
        const char = testString[i];
        const angle = startAngle + i * angleStep;

        // Calcola la posizione per ogni lettera lungo l'arco
        const left = canvas.width / 2 + radius * Math.cos(angle);
        const top = canvas.height / 2 + radius * Math.sin(angle);

        // Crea l'oggetto Fabric per ogni lettera
        const letter = new fabric.Text(char, {
            left: left,
            top: top,
            fontSize: 20,
            originX: 'center',
            originY: 'center',
            angle: (angle * 180) / Math.PI + 90 // Ruota ogni lettera per seguire l'arco
        });
               //canvas.add(letter);
    }
     //prezzoTotale += costoNome;
    //aggiornaPrezzo();
}
function startEditingText() {
    document.body.classList.add('no-scroll'); // Blocca lo scrolling
    // Codice per avviare la modifica del testo...
}

function stopEditingText() {
    document.body.classList.remove('no-scroll'); // Riattiva lo scrolling
    // Codice per terminare la modifica del testo...
}
function rimuoviOggetto() {
    // Ottieni l'oggetto selezionato
    const oggettoSelezionato = canvas.getActiveObject();

    // Verifica se esiste un oggetto selezionato
    if (oggettoSelezionato.tipo === 'accessorio') {
        canvas.remove(oggettoSelezionato); // Rimuovi l'oggetto
        canvas.discardActiveObject(); // Deseleziona l'oggetto rimosso
        canvas.renderAll(); // Rende visibile il cambiamento
        //prezzoTotale -= costoAccessorio;
        //aggiornaPrezzo();
    } else {
        canvas.remove(oggettoSelezionato); // Rimuovi l'oggetto
        canvas.discardActiveObject(); // Deseleziona l'oggetto rimosso
        canvas.renderAll(); // Rende visibile il cambiamento
        //prezzoTotale -= costoNome;
        //aggiornaPrezzo();
    }
}
// Aggiorna il prezzo totale iniziale
//aggiornaPrezzo();

