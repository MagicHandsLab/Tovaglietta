// Inizializza il canvas di Fabric.js
const canvas = new fabric.Canvas('tovaglietta-canvas');

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
const accessori = {
    "accessorio1": [
        "img/ape1.png",
        "img/ape2.png"
    ],
    "accessorio2": [
        "img/cuore1.png",
        "img/cuore2.png",
        "img/cuore3.png",
        "img/cuore4.png",
        "img/cuore5.png"
    ],
    "accessorio3": [
        "img/dino1.png",
        "img/dino2.png",
        "img/dino3.png",
        "img/dino4.png",
        "img/dino5.png",
        "img/dino6.png",
        "img/dino7.png",
        "img/dino8.png",
        "img/dino9.png",
        "img/dino10.png",
        "img/dino11.png"
    ],
    "accessorio4": [
        "img/farfalla1.png",
        "img/farfalla2.png",
        "img/farfalla3.png",
        "img/farfalla4.png",
        "img/farfalla5.png",
        "img/farfalla6.png"
    ],
    "accessorio5": [
        "img/fiore1.png",
        "img/fiore2.png",
        "img/fiore3.png"
    ],
    "accessorio6": [
        "img/fioreB1.png",
        "img/fioreB2.png",
        "img/fioreB3.png",
        "img/fioreB4.png"
    ],
    "accessorio7": [
        "img/foglia1.png",
        "img/foglia2.png",
        "img/foglia3.png",
        "img/foglia4.png",
        "img/foglia5.png",
        "img/foglia6.png"
    ]
};
// Funzione per mostrare il modal e caricare gli accessori specifici
function mostraModal(accessorioTipo) {
    const oggettiContainer = document.getElementById('oggetti-container');
    oggettiContainer.innerHTML = ''; // Pulisci il contenuto precedente
    // Verifica se esiste il tipo di accessorio
    if (!accessori[accessorioTipo]) {
        console.error(`Tipo di accessorio "${accessorioTipo}" non trovato!`);
        return;
    }
    // Log per confermare l'apertura del modal
    console.log(`Apro il modal per il tipo di accessorio: ${accessorioTipo}`);

    // Carica gli oggetti per il tipo selezionato
    accessori[accessorioTipo].forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.onclick = () => aggiungiAccessorio(src);
        // Log di debug per il caricamento dell'immagine
        console.log(`Carico immagine: ${src}`);
        oggettiContainer.appendChild(img);
    });

    // Mostra il modal
    document.getElementById('modal').style.display = 'block';
}

// Funzione per nascondere il modal
function chiudiModal() {
    document.getElementById('modal').style.display = 'none';
}
// Funzione per aggiungere un accessorio trascinabile sul canvas
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
        });

        // Aggiungi l'accessorio al canvas e rendilo attivo per il posizionamento
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
    });
     // Chiudi il modal dopo aver selezionato un accessorio
    chiudiModal();
}
// Event listener per chiudere il modal se l'utente clicca fuori dal contenuto
window.onclick = function(event) {
    const modal = document.getElementById('modal');
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
    canvas.add(textbox);
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

        canvas.add(letter);
    }
}





