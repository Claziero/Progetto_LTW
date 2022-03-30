//const pg = require('pg'); // Da errore

// Funzione per inizializzare la connessione e gli oggetti
function initialize(pg) {
    // Configurazione parametri (da cambiare)
    const config = {
        host: '127.0.0.1',
        user: 'postgres',     
        password: 'biar',
        database: 'EventHubDB',
        port: 5432,
        ssl: true
    };
    
    // Configurazione del client
    const client = new pg.Client(config);
}


// Funzione per la query al db
function runQuery(query) {
    // Connessione
    client.connect(err => {
        if (err) throw err;
        console.log("Connesso");
    });

    console.log("Query: " + query);

    var q = pgClient.query("SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID\
                            FROM Evento;");

    //Prova la query
    client.query(q).then(res => {
        const numRows = res.rows;

        rows.map(row => {console.log('> ${JSON.stringify(row)}');});
    })
    .catch(err => {console.log(err);});

}