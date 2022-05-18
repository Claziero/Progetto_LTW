// Fading dei blocchi evento
$(document).ready(function () {
    $(".card").fadeIn(1500);

    // Ricava i link per i tasti "precedente" e "successivo" nella paginazione
    var active = $("li.active > a").attr("href").slice(1).split("/");
    active[1] = parseInt(active[1]);

    // Se proviene dalla pagina di ricerca
    if (active[0].startsWith("search")) {
        // Link precedente
        if (isNaN(active[1]) || active[1] == 2) prev = "/" + active[0];
        else prev = "/" + active[0] + "/" + String(active[1] - 1);

        // Link successivo
        if (isNaN(active[1])) next = "/" + active[0] + "/2";
        else next = "/" + active[0] + "/" + String(active[1] + 1);
    }
    // Azioni diverse in base alla pagina
    else switch (active[0]) {
        // Caso di pagine HIGHLIGHTS, PROSSIMAMENTE e EVENTI PASSATI
        case "highlights": case "next": case "passed":
            // Link precedente
            if (isNaN(active[1]) || active[1] == 2) prev = "/" + active[0];
            else prev = "/" + active[0] + "/" + String(active[1] - 1);

            // Link successivo
            if (isNaN(active[1])) next = "/" + active[0] + "/2";
            else next = "/" + active[0] + "/" + String(active[1] + 1);
            
            break;
        
        // Caso di pagine MAIN
        case "":
            prev = "/";
            next = "/2";
            break;

        case "2":
            prev = "/";
            next = "/3";
            break;

        default:
            prev = "/" + String(parseInt(active[0]) - 1);
            next = "/" + String(parseInt(active[0]) + 1);
            break;
    }

    // Imposta i link
    $("#prev").attr("href", prev);
    $("#next").attr("href", next);
});

// Funzione per prenotare un evento
function prenota(id) {
    console.log("Prenotazione per evento ID=" + id);

    // Crea una nuova richiesta di prenotazione verso il server
    // Le risposte vengono poi gestite dalla funzione displayError
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayError;
    httpRequest.open("GET", "/book=" + id, true);
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
        if (n.length != 0) {
            $("#e" + n + " #desc").attr("hidden", true);
            $("#e" + n + " #message").html(error.target.responseText);
        }
    }
}

// Funzione per la ricerca di un evento dalla barra di testo
function search() {
    // Recupera il testo all'interno della barra
    var src = $("#src").val();

    // Reindirizza alla pagina di ricerca
    window.location.replace("/search=" + src);
    return;
}
