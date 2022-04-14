// Espandere il blocco corrente e inserire le nuove informazioni (Luogo e Organizzatore)
function info(id) {
    console.log("Maggiori informazioni per evento ID=" + id);

    // Crea una nuova richiesta di info verso il server
    // Le risposte vengono poi gestite dalla funzione displayInfo
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayInfo;
    httpRequest.open("GET", '/info=' + id, true);
    httpRequest.send();
}

// Funzione per mostrare le info nel blocco dell'evento
function displayInfo(info) {
    // Controlla che la risposta sia stata ricevuta e stampa le informazioni
    if (info.target.readyState == 4 && info.target.status == 200) {
        var n = info.target.responseURL.split("info=")[1];
        if (n.length != 0) {
            // Trasforma la stringa ricevuta in un oggetto per accedere ai campi
            obj = JSON.parse(info.target.responseText);

            // Imposta il testo dei paragrafi
            $("#e"+n+" #luogo").html($("#e"+n+" #luogo").html() + " " + obj.luogo);
            $("#e"+n+" #organizzatore").html($("#e"+n+" #organizzatore").html() + " " + obj.organizzatore);
            
            // Mostra i paragrafi
            $("#e"+n+" #luogo").css("display", "block");
            $("#e"+n+" #organizzatore").css("display", "block");

            // Disabilita il tasto maggiori informazioni
            $("#e"+n+" #info").css("display", "none");
        }
    }
    return;
}

// Funzione per prenotare un evento
function prenota(id) {
    console.log("Prenotazione per evento ID=" + id);

    // Crea una nuova richiesta di prenotazione verso il server
    // Le risposte vengono poi gestite dalla funzione displayError
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayError;
    httpRequest.open("GET", '/book=' + id, true);
    httpRequest.send();
}

// Funzione per gestire l'errore (eventuale) restituito dal server
function displayError(error) {
    // Se non c'è stato alcun errore allora reindirizza alla pagina che dice il server
    if (error.target.responseURL.endsWith("/profile")) {
        window.location.replace(error.target.responseURL);
        return;
    }

    // Altrimenti controlla che la risposta sia stata ricevuta e stampa l'errore
    if (error.target.readyState == 4 && error.target.status == 200) {
        var n = error.target.responseURL.split("book=")[1];
        if (n.length != 0)
            $("#e"+n+" #message").html(error.target.responseText);
    }
}
