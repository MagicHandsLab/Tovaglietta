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
// Funzione per aggiungere un accessorio trascinabile sul canvas
function aggiungiAccessorio(accessorioSrc) {
    console.log("Selezionato Accessorio:", accessorioSrc); // Debug: verifica quale accessorio è stato selezionato
    fabric.Image.fromURL(accessorioSrc, function(img) {
        if (!img) {
            console.error("Errore nel caricamento dell'immagine:", accessorioSrc);
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
    });
}
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





