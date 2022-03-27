<?php
    /* Script per la connessione con il db postgres */

    // Funzione per la query di richiesta degli eventi in home page
    function mainListing () {
        // Connetti al db
        $conn_string = "host=localhost port=5432 dbname=EventHubDB user=postgres password=biar";
        $dbconn = pg_connect($conn_string) or die("Couldn't connect to database");

        // Crea ed esegui la query
        $query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione
                  FROM Evento;";
        $res = pg_query($dbconn, $query);

        //Se c'è stato un errore
        if (!$res) {
            echo "Errore nell'esecuzione della query";
            exit;
        }

        // Altrimenti per ogni riga crea un blocco nella home con i dati
        while ($row = pg_fetch_row($res)) {
            echo "
            <div class='listing jumbotron container border border-dark rounded mb-3'>
                <h3 class='display-6'>$row[0]</h3>
                <p class='lead'>Evento $row[1] il $row[2] [Posti rimanenti: $row[3]]</p>
                <hr class='my-1'>
                <p>Descrizione evento: $row[4]</p>
                <p class='lead'>
                    <a href='#' class='px-1'>
                        <button class='btn btn-info btn-lg'>Maggiori informazioni</button>
                    </a>
                    <a href='#' class=''>
                        <button class='btn btn-prenota btn-lg'>Prenota</button>
                    </a>
                </p>
            </div>
            ";


        }
    }


?>