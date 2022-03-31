const pg = require('pg');
const cjs = require('crypto-js')

// Configurazione parametri
const config = {
    host: '127.0.0.1',
    user: 'postgres',     
    password: 'biar',
    database: 'EventHubDB',
    port: 5432
};

/* Funzione per la query al db
 * Per ogni query che viene eseguita genera un nuovo client
 * e si connette al db.
 * Una volta eseguita la query, il client viene disconnesso,
 * così da lasciare il canale libero
*/
async function runQuery(query) {
    // Configurazione del client
    const client = new pg.Client(config);

    // Connessione
    client.connect(err => {
        if (err) throw err;
        console.log("Connesso al db");
    });
    
    // Esegui la query
    try {
        return (await client.query(query)).rows;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
        console.log("Disconnesso dal db");
    }
}

// Funzione per prendere i dati della main-listing
async function loadMainListing() {
    // Query per il main-listing
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID\
                FROM Evento;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per inserire un nuovo utente (registrazione)
async function insertUser(user) {
    // Query per l'inserimento
    var query = 'INSERT INTO Utente VALUES (';
    query += user.nome + ',';
    query += user.cognome + ',';
    query += user.datanasc + ',';
    query += user.sesso + ',';
    query += user.email + ',';
    query += cjs.MD5(user.password).toString() + ',';
    query += user.validato + ',';
    query += user.privilegi + ',';

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per la ricerca della password di un utente (login)
async function logUser(user) {
    // Query per la ricerca della password
    var query = 'SELECT passwd FROM Utente WHERE email = ${user.email}';

    // Esegui la query
    try {
        var res = await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }

    // Genera e confronta gli hash
    var hash = cjs.MD5(user.password).toString();
    return res[0]['passwd'] == hash; // Controllare la struttura di res
}


// Funzione per formattare la data e l'ora nel formato italiano
function formatDate(date) {
    var args = date.split(' ');

    var giorno = args[0];
    var mese = args[1];
    var data = args[2];
    var anno = args[3];
    var ora = args[4].slice(0, 5);
    // Altri argomenti ignorati

    // Traduzione del giorno
    switch(giorno) {
        case 'Mon':
            giorno = 'Lunedì';
            break;
        case 'Tue':
            giorno = 'Martedì'; 
            break;
        case 'Wed':
            giorno = 'Mercoledì';
            break;
        case 'Thu':
            giorno = 'Giovedì';
            break;
        case 'Fri':
            giorno = 'Venerdì';
            break;
        case 'Sat':
            giorno = 'Sabato';
            break;
        case 'Sun':
            giorno = 'Domenica';
            break;
    };

    // Traduzione del mese
    switch(mese) {
        case 'Jan':
            mese = 'Gennaio';
            break;
        case 'Feb':
            mese = 'Febbraio';
            break;
        case 'Mar':
            mese = 'Marzo';
            break;
        case 'Apr':
            mese = 'Aprile';
            break;
        case 'May':
            mese = 'Maggio';
            break;
        case 'Jun':
            mese = 'Giugno';
            break;
        case 'Jul':
            mese = 'Luglio';
            break;
        case 'Aug':
            mese = 'Agosto';
            break;
        case 'Sep':
            mese = 'Settembre';
            break;
        case 'Oct':
            mese = 'Ottobre';
            break;
        case 'Nov':
            mese = 'Novembre';
            break;
        case 'Dec':
            mese = 'Dicembre';
            break;
    }

    var data = giorno + " " + data + " " + mese + " " + anno + " " + ora;
    return data;
}

// Esporta i moduli
module.exports = {
    config,
    runQuery,
    loadMainListing, 
    insertUser,
    logUser,
    formatDate
}