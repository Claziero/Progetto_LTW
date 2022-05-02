// Funzione per disdire una prenotazione
function unbook(id) {
    console.log("Disdetta per evento ID=" + id);

    // Reindirizza alla pagina di disdetta
    window.location.replace("/unbook=" + id);
    return;
}

// Funzione per eliminare un evento (organizzatore)
function remove(id) {
    console.log("Rimozione evento ID=" + id);

    // Reindirizza alla pagina di rimozione
    window.location.replace("/remove=" + id);
    return;
}

// Funzione per mostrare la tab di gestione delle prenotazioni (organizzatore)
function showPrenotazioni() {
    $('#prenotazioni').attr('class', 'tab-pane fade show active ');
    $('#prenotazioniTab').attr('class', 'nav-link active');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link');

    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per creare un evento (organizzatore)
function showEvento() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade show active');
    $('#creaTab').attr('class', 'nav-link active');
    
    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per rimuovere un evento (organizzatore)
function showRimozione() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link ');

    $('#rimozioni').attr('class', 'tab-pane fade show active');
    $('#rimuoviTab').attr('class', 'nav-link active');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab amministratore (organizzatore)
function showAdmin() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link ');

    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade show active');
    $('#adminTab').attr('class', 'nav-link active');
}

// Funzione per mostrare le prenotazioni (utente normale)
function showPrenotazioniNormal() {
    $('#prenotazioniNormal').attr('class', 'tab-pane fade show active');
    $('#prenotazioniNormalTab').attr('class', 'nav-link active');

    $('#beOrganizer').attr('class', 'tab-pane fade');
    $('#beOrganizerTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per essere organizzatore (utente normale)
function showBeOrganizer() {
    $('#prenotazioniNormal').attr('class', 'tab-pane fade');
    $('#prenotazioniNormalTab').attr('class', 'nav-link');

    $('#beOrganizer').attr('class', 'tab-pane fade show active');
    $('#beOrganizerTab').attr('class', 'nav-link active');
}

// Funzione per settare la data minima e massima di creazione di un evento
function setDates() {
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    $('#dateTime').attr('min', tomorrow.toISOString().slice(0, 16));
    $('#dateTime').attr('max', nextYear.toISOString().slice(0, 16));
}

// Funzione per richiedere di essere un organizzatore
function richiediOrg(email) {
    console.log("Richiesta privilegi per utente=" + email);

    // Crea una nuova richiesta verso il server
    // Le risposte vengono poi gestite dalla funzione displayRes
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayRes;
    httpRequest.open("GET", '/beOrganizer=' + email, true);
    httpRequest.send();
}

// Funzione per mostrare la risposta del server
function displayRes(res) {
    // Controlla che la risposta sia stata ricevuta e stampa il risultato
    if (res.target.readyState == 4 && res.target.status == 200) {
        if (res.target.responseText.slice(0,3) == '[1]') {
            $("#contentDiv").html(res.target.responseText.slice(3));
            $("#btnRichiedi").hide();
        }
        else
            $("#contentDiv").html(res.target.responseText.slice(3));
    }
}

// Funzione per la validazione del form
function validaCreazione() {
    // Tutti i requisiti sono già soddisfatti dai campi required
    // Non sono necessari controlli
    return true;
}
