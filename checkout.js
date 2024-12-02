// Recupera il carrello dal localStorage
let carrello = JSON.parse(sessionStorage.getItem('carrello')) || [];
// Inizializza il conteggio al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    carrello = JSON.parse(sessionStorage.getItem('carrello')) || [];
    aggiornaConteggioCarrello();
});
function aggiornaConteggioCarrello() {
    const conteggioElement = document.getElementById("conteggioCarrello");
    const conteggioTotale = carrello.length;
    conteggioElement.textContent = conteggioTotale;
}
// Funzione per visualizzare il contenuto del carrello nella pagina di checkout
function mostraCarrello() {
    const elencoCarrello = document.getElementById("elencoCarrello");
    const totaleCarrello = document.getElementById("totaleCarrello");

    // Svuota il contenitore per aggiornare il contenuto
    elencoCarrello.innerHTML = '';
    if (carrello.length === 0) {
        elencoCarrello.innerHTML = "<p>Il carrello è vuoto.</p>";
        totaleCarrello.textContent = "Totale: €0.00";
        return;
    }

    let totale = 0;

    carrello.forEach((articolo, index) => {
        // Aggiungi ogni tovaglietta al DOM
        const articoloElement = document.createElement("div");
        articoloElement.classList.add("articolo-carrello");

        articoloElement.innerHTML = `
            <h3>Articolo ${index + 1}</h3>
            <img src="${articolo.immagine}" alt="Tovaglietta ${index + 1}" style="max-width: 200px;">
            <p>Prezzo: €${articolo.prezzo.toFixed(2)}</p>
            <button id="rimuovi-oggetto" onclick="rimuoviArticolo(${index})">Rimuovi Tovaglietta</button>
        `;

        elencoCarrello.appendChild(articoloElement);
        totale += articolo.prezzo;
    });

    // Visualizza il totale del carrello
    totaleCarrello.textContent = `Totale: €${totale.toFixed(2)}`;
}
// Funzione per rimuovere un articolo dal carrello
function rimuoviArticolo(index) {
    // Rimuove l'articolo dall'array `carrello`
    carrello.splice(index, 1);

    // Aggiorna il `localStorage` con il nuovo array `carrello`
    sessionStorage.setItem('carrello', JSON.stringify(carrello));

    // Ricarica l'elenco degli articoli e il totale
    mostraCarrello();
    aggiornaConteggioCarrello();
}
// Funzione per calcolare il totale del carrello
function calcolaTotaleCarrello() {
    return carrello.reduce((totale, articolo) => totale + articolo.prezzo, 0).toFixed(2);
}
// Funzione per gestire il click sul bottone del carrello
function vaiAlCheckout() {
    const carrelloSalvato = JSON.parse(sessionStorage.getItem('carrello')) || [];

    if (carrelloSalvato > 0) {
        // Se ci sono articoli nel carrello, vai alla pagina di checkout
        window.location.href = "checkout.html";
    } else {
        // Altrimenti mostra un messaggio di errore
        window.location.href = "checkout.html";
       // alert("Il carrello è vuoto. Aggiungi articoli prima di procedere al checkout.");
    }
}
// Inizializza il pulsante PayPal
function initPayPalButton() {
    paypal.Buttons({
        createOrder: (data, actions) => {
            const totale = calcolaTotaleCarrello();

            // Crea una transazione con il totale dinamico
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totale,
                        currency_code: "EUR",
                    }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
                alert("Pagamento completato da " + details.payer.name.given_name);

                // Invia i dettagli del carrello via email o salva l’ordine
                inviaDettagliOrdine();
            });
        },
        onError: (err) => {
            console.error(err);
            alert("Si è verificato un errore durante il pagamento con PayPal.");
        }
    }).render('#paypal-button-container');
}

// Esegui l’inizializzazione quando la pagina è pronta
document.addEventListener("DOMContentLoaded", () => {
    initPayPalButton();
});


// Chiama la funzione per mostrare il carrello al caricamento della pagina
document.addEventListener("DOMContentLoaded", mostraCarrello);
