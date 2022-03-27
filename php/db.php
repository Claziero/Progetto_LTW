<?php
    // Script per la connessione con il db postgres
    $conn_string = "host=localhost port=5432 dbname=EventHubDB user=postgres password=biar";
    
    $dbconn = pg_connect($conn_string) or die("Couldn't connect to database");

    


?>