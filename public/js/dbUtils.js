// Funzione per la ricerca di un evento dalla barra di testo
function search() {
    // Recupera il testo all'interno della barra
    var src = $("#src").val();
    console.log("Ricerca: " + src);

    // Crea una nuova richiesta verso il server
    // Le risposte vengono poi gestite dalla funzione displayResults
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayResults;
    httpRequest.open("GET", '/search=' + src, true);
    httpRequest.send();
}

// Funzione per mostrare gli eventi compatibili
function displayResults(res) {
    // console.log(res);
    if (res.target.readyState == 4 && res.target.status == 200) {
        console.log(res.target.responseText);

        var obj = JSON.parse(res.target.responseText);

        if (obj.length > 0) {
            // $(".listing").css("display", "none");
            obj.forEach(elem => {
                // $("body").append(elem);
                // TBC
            });
        }



        $("#e1 #message").html(res.target.responseText);
    }
}

