<?php
    /* Script per la connessione con il db postgres */

    /* Funzione per convertire il formato della data
    *  $date in formato YYYY-MM-DD da convertire in DD-MM-YYYY 
    */
    function convertDate ($date) {
        return date("d-m-Y", strtotime($date));
    }

    // Funzione per la query di richiesta degli eventi in home page
    function mainListing () {
        // Connetti al db
        $conn_string = "host=localhost port=5432 dbname=EventHubDB user=postgres password=biar";
        $dbconn = pg_connect($conn_string) or die("Couldn't connect to database");

        // Crea ed esegui la query
        $query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID
                  FROM Evento;";
        $res = pg_query($dbconn, $query);

        //Se c'è stato un errore
        if (!$res) {
            echo "Errore nell'esecuzione della query";
            exit;
        }

        // Altrimenti per ogni riga crea un blocco nella home con i dati
        while ($row = pg_fetch_row($res)) {
            $titolo = $row[0];
            $tipo = $row[1];
            $dataarr = explode(' ', $row[2]);
            $data = convertDate($dataarr[0]);
            $ora = $dataarr[1];
            $posti = $row[3];
            $desc = $row[4];
            $id = $row[5]; 

            echo "
            <div class='listing jumbotron container border border-dark rounded mb-3'>
                <h3 class='display-6'>$titolo</h3>
                <p class='lead'>Evento $tipo il $data ore $ora [Posti rimanenti: $posti]</p>
                <hr class='my-1'>
                <p>Descrizione: $desc</p>
                <p class='lead'>
                    <button class='btn btn-info btn-lg px-3' onclick='info($id)'>Maggiori informazioni</button>
                    <button class='btn btn-prenota btn-lg' onclick='prenota($id)'>Prenota</button>
                </p>
            </div>
            ";
        }
    }


?>