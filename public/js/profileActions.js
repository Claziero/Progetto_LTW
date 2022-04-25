// Funzione per disdire una prenotazione
function unbook(id) {
    console.log("Disdetta per evento ID=" + id);

    // Reindirizza alla pagina di disdetta
    window.location.replace("/unbook=" + id);
    return;
}

function showEvento(){
    document.getElementById('prenotazioni').setAttribute('class', 'tab-pane fade ');
    document.getElementById('prenotazioniTab').setAttribute('class', 'nav-link');

    document.getElementById('creaEvento').setAttribute('class', 'tab-pane fade show active');
    document.getElementById('creaTab').setAttribute('class', 'nav-link active');

    document.getElementById('admin').setAttribute('class', 'tab-pane fade');
    document.getElementById('adminTab').setAttribute('class', 'nav-link');

}

function showPrenotazioni(){
    document.getElementById('prenotazioni').setAttribute('class', 'tab-pane fade show active ');
    document.getElementById('prenotazioniTab').setAttribute('class', 'nav-link active');

    document.getElementById('creaEvento').setAttribute('class', 'tab-pane fade');
    document.getElementById('creaTab').setAttribute('class', 'nav-link');

    document.getElementById('admin').setAttribute('class', 'tab-pane fade');
    document.getElementById('adminTab').setAttribute('class', 'nav-link');

}

function showAdmin(){
    document.getElementById('prenotazioni').setAttribute('class', 'tab-pane fade ');
    document.getElementById('prenotazioniTab').setAttribute('class', 'nav-link');

    document.getElementById('creaEvento').setAttribute('class', 'tab-pane fade');
    document.getElementById('creaTab').setAttribute('class', 'nav-link ');

    document.getElementById('admin').setAttribute('class', 'tab-pane fade show active');
    document.getElementById('adminTab').setAttribute('class', 'nav-link active');

}

// Funzione per settare la data minima e massima di creazione di un evento
function setDates(){
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    $('#dataTime').attr('min', tomorrow.toISOString().slice(0, 16));
    $('#dataTime').attr('max', nextYear.toISOString().slice(0, 16));
}
