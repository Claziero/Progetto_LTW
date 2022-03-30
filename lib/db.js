const pg = require('pg');

// Configurazione parametri (da cambiare)
const config = {
    host: '127.0.0.1',
    user: 'postgres',     
    password: 'biar',
    database: 'EventHubDB',
    port: 5432
};

// Configurazione del client
const client = new pg.Client(config);

// Funzione per la query al db
function runQuery(query) {
    // Connessione
    client.connect(err => {
        if (err) throw err;
        console.log("Connesso al db");
    });
    
    //Prova la query
    client.query(query).then(res => {
        res.rows.map(row => {console.log(row);});
    })
    .catch(err => {
        console.log(err);
    });
}

// Funzione per prendere i dati per main-listing
function loadMainListing() {
    // Query per il main-listing
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID\
                FROM Evento;";

    // Esegui la query
    runQuery(query);
}

// Esporta i moduli
module.exports = {
    client,
    config,
    runQuery,
    loadMainListing
}