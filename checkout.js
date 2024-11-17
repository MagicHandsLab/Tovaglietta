// Recupera il carrello dal localStorage
let carrello = JSON.parse(localStorage.getItem('carrello')) || [];

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
            <h3>Tovaglietta ${index + 1}</h3>
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
    localStorage.setItem('carrello', JSON.stringify(carrello));

    // Ricarica l'elenco degli articoli e il totale
    mostraCarrello();
    aggiornaConteggioCarrello();
}
// Funzione per calcolare il totale del carrello
function calcolaTotaleCarrello() {
    return carrello.reduce((totale, articolo) => totale + articolo.prezzo, 0).toFixed(2);
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
