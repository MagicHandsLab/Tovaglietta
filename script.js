
let carrello = JSON.parse(sessionStorage.getItem('carrello')) || []; // Recupera il carrello dal sessionStorage o inizializza un array vuoto
// Inizializza il conteggio al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    carrello = JSON.parse(sessionStorage.getItem('carrello')) || [];
    aggiornaConteggioCarrello();
});
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
const prezzoBase = 12.00; // Prezzo di base della tovaglietta
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
// Funzione per aggiungere un articolo al carrello

// Funzione per aggiungere la tovaglietta visualizzata nel canvas al carrello
function aggiungiArticolo() {
    const canvas = document.getElementById("tovaglietta-canvas");
    if (canvas) {
        const canvasImage = canvas.toDataURL("image/jpeg', 0.5"); // Converti il contenuto del canvas in una stringa Base64
        const prezzo = 12.00; // Esempio di prezzo per una tovaglietta personalizzata, può essere dinamico se hai diversi prezzi
        const context = canvas.getContext("2d");


        // Ottieni i dati di immagine dal canvas
        const imgData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // Verifica se tutti i pixel sono trasparenti
        let isEmpty = true;
        for (let i = 0; i < imgData.length; i += 4) {
            if (imgData[i + 3] !== 0) { // Controlla il canale alpha per vedere se è trasparente
                isEmpty = false;
                break;
            }
        }

        if (isEmpty) {
            alert("Errore: Il contenuto è vuoto. Personalizza la tovaglietta prima di aggiungerla al carrello.");
            return;
        }

    const originalCanvas = document.getElementById('tovaglietta-canvas');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

// Imposta la stessa dimensione del canvas originale
tempCanvas.width = originalCanvas.width;
tempCanvas.height = originalCanvas.height;

// Copia solo il contenuto senza il contorno
tempCtx.drawImage(originalCanvas, 0, 0);

// Converti il canvas temporaneo in Blob
tempCanvas.toBlob((blob) => {
    
    // Salva l'immagine come URL Blob temporaneo
     blobUrl = URL.createObjectURL(blob);
    // Aggiungi la tovaglietta al carrello
        const prodotto = {
            id: carrello.length + 1,
            immagine: blobUrl,
            prezzo: prezzo,
        };
                aggiungiAlCarrello(prodotto);

        }, 'image/png', 0.7); // Formato JPEG, qualità 0.7



        
        
    } else {
        alert("Errore: canvas non trovato.");
    }
}

// Funzione per gestire il click sul bottone del carrello
function vaiAlCheckout() {
    const carrelloSalvato = JSON.parse(sessionStorage.getItem('carrello')) || [];
    if (carrelloSalvato > 0) {
        // Se ci sono articoli nel carrello, vai alla pagina di checkout
        window.location.href = "checkout.html";
    } else {
        window.location.href = "checkout.html";

        // Altrimenti mostra un messaggio di errore
        //alert("Il carrello è vuoto. Aggiungi articoli prima di procedere al checkout.");
    }

}

function aggiornaConteggioCarrello() {
    const conteggioElement = document.getElementById("conteggioCarrello");
    const conteggioTotale = carrello.length;
    conteggioElement.textContent = conteggioTotale;
}


document.addEventListener("DOMContentLoaded", function () {
    // Controlla se il banner è già stato mostrato in questa sessione
    if (!localStorage.getItem("bannerShown")) {
        // Mostra il banner aggiungendo la classe "show"
        const banner = document.getElementById("popupOverlay");
        banner.classList.add("show");

        // Imposta il flag per indicare che il banner è stato mostrato
        localStorage.setItem("bannerShown", "true");
    }
});

function apriMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.add("open");
    overlay.style.display = "block"; // Mostra l'overlay
}

function chiudiMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.remove("open");
    overlay.style.display = "none"; // Nascondi l'overlay
}
function cambiaColoreTitolo() {
            const titolo = document.getElementById('title1');
            const colori = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#a133ff', '#33ffd7'];
            let indice = 0;

            setInterval(() => {
                titolo.style.color = colori[indice]; // Cambia il colore del titolo
                indice = (indice + 1) % colori.length; // Passa al colore successivo
            }, 1000); // Cambia colore ogni 1000 millisecondi (1 secondo)
        }

        // Inizializza il cambiamento di colore del titolo all'avvio
cambiaColoreTitolo();
// Recupera il carrello da sessionStorage
function getCarrello() {
    return JSON.parse(sessionStorage.getItem("carrello")) || [];
}



// Aggiunge un prodotto al carrello
function aggiungiAlCarrello(prodotto) {
    let carrello = JSON.parse(sessionStorage.getItem("carrello")) || [];
    carrello.push(prodotto);
    sessionStorage.setItem("carrello", JSON.stringify(carrello));
    aggiornaBadgeCarrello();
    alert("Articolo aggiunto al carrello!");

    const dimensioneCarrello = new Blob([carrello]).size;

    console.log(`Dimensione dell'articolo in memoria: ${(dimensioneCarrello / 1024).toFixed(2)} KB`);


let totaleMemoriaUsata = 0;
for (let i = 0; i < sessionStorage.length; i++) {
    const chiave = sessionStorage.key(i);
    totaleMemoriaUsata += new Blob([sessionStorage.getItem(chiave)]).size;
}

console.log(`Totale memoria usata in sessionStorage: ${totaleMemoriaUsata / 1024} KB`);


}

// Aggiorna il badge con il conteggio articoli
function aggiornaBadgeCarrello() {
    const badge = document.getElementById("conteggioCarrello");
    const carrello = getCarrello();
    badge.textContent = carrello.length;
}
function aggiungiProdottoNatale(nome, prezzo, immagine) {
    const prodotto = {
        nome: nome,
        prezzo: prezzo,
        immagine: immagine,
    };
    aggiungiAlCarrello(prodotto);
    alert(`${nome} è stato aggiunto al carrello!`);
}

