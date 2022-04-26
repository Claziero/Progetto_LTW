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
        // console.log(">Connesso al db");
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
        // console.log(">Disconnesso dal db");
    }
}

// Funzione per la query al db di tipo Insert/Delete/Update
// Restituisce il numero di righe della query invece delle righe stesse
async function runInsDelUpd(query) {
    // Configurazione del client
    const client = new pg.Client(config);

    // Connessione
    client.connect(err => {
        if (err) throw err;
        // console.log(">Connesso al db");
    });

    // Esegui la query
    try {
        return (await client.query(query)).rowCount;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
        // console.log(">Disconnesso dal db");
    }
}

// Funzione per prendere i dati della main-listing
async function loadMainListing() {
    // Query per il main-listing
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID\
                FROM Evento ORDER BY ID;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

/* Funzione per inserire un nuovo utente (registrazione)
 * Restituisce dei codici di errore a seconda del risultato della query:
 *  0 = query eseguita con successo
 *  -1 = query fallita (utente già registrato)
*/
async function insertUser(user) {
    // Query per l'inserimento
    var query = 'INSERT INTO Utente VALUES (';
    query += '\'' + user.nome + '\',';
    query += '\'' + user.cognome + '\',';
    query += '\'' + user.datanasc + '\',';
    query += '\'' + user.sesso + '\',';
    query += '\'' + user.email + '\',';
    query += '\'' + cjs.MD5(user.password).toString() + '\',';
    query += user.validato + ',';
    query += user.privilegi + ');';

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene eliminata 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
}

/*Funzione per inserire un nuovo evento
 * Restituisce dei codici di errore a seconda del risultato della query:
 * 0 = query eseguita con successo
 * -1 = query fallita (utente già registrato)
*/
async function insertEvent(event){
    var query = 'INSERT INTO Evento Values(';
    query += '\'' + event.titolo + '\',';
    query += '\'' + event.luogo + '\',';
    query += '\'' + event.tipo + '\',';
    query += '\'' + event.data + '\',';
    query += '\'' + event.posti + '\',';
    query += '\'' + event.descrizione + '\',';

    //Esegui la query
    try{
        var res= await runInsDelUpd(query);
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
    
}


/* Funzione per cambiare i dati di un utente
 * Restituisce dei codici di errore a seconda del risultato della query:
 *  0 = query eseguita con successo
 *  -1 = query fallita
*/
async function changeUser(user) {
    // Query per l'inserimento
    var query = 'UPDATE Utente SET ';
    query += 'Nome = \'' + user.nome + '\',';
    query += 'Cognome = \'' + user.cognome + '\',';
    query += 'DataNascita = \'' + user.datanasc + '\',';
    query += 'Passwd = \'' + cjs.MD5(user.newpwd).toString() + '\' ';
    query += 'WHERE Email = \'' + user.email + '\';';

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene sostituita 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
}

/* Funzione per la ricerca della password di un utente (login)
*  Restituisce dei codici a seconda del risultato ottenuto:
*   nome utente = Credenziali corrette
*   -1 = Password errata
*   -2 = Utente non registrato
*/
async function logUser(user) {
    // Query per la ricerca della password
    var query = 'SELECT passwd, nome FROM Utente WHERE email = \'' + user.email + '\';';

    // Esegui la query
    try {
        var res = await runQuery(query);

        // Se viene restituito un risultato dalla query
        if (res.length > 0) {
            // Genera e confronta gli hash
            var hash = cjs.MD5(user.password).toString();

            if (res[0]['passwd'] == hash) return res[0]['nome'];
            else return -1;
        }
        else return -2;
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere il livello di privilegi di un utente
async function getLevel(email) {
    var query = 'SELECT privilegi FROM Utente WHERE email = \'' + email + '\';';

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

/* Funzione per inserire una nuova prenotazione nel db
 * Restituisce dei codici a seconda del risultato ottenuto:
 *  0 = Inserimento effettuato con successo
 *  -1 = Errore nelle query
 *  -2 = Posti non disponibili
 *  -3 = Utente già registrato all'evento
*/
async function book(id, user) {
    // Controlla che la persona non sia già prenotata per questo evento
    var query = "SELECT * FROM Prenotazione WHERE Email_Utente = \'" + user.email +
        "\' AND ID_Evento = " + id;

    try {
        var res = await runQuery(query);

        // Se l'utente non è già iscritto
        if (res.length == 0) {
            // Controlla che i posti disponibili ci siano ancora
            query = "SELECT PostiDisponibili FROM Evento WHERE ID = " + id;

            try {
                res = await runQuery(query);

                // Se i posti ci sono allora prenota
                if (res[0]['postidisponibili'] > 0) {
                    // Imposta il timestamp della prenotazione
                    var now = new Date();
                    var timestamp = now.getFullYear() + '-' +
                        (now.getMonth() + 1).toString() + '-' +
                        now.getDate() + ' ' +
                        now.getHours() + ':' +
                        now.getMinutes() + ':' +
                        now.getSeconds();

                    query = "INSERT INTO Prenotazione VALUES (" +
                        id + ", \'" + user.email + "\', \'" + timestamp + "\')";

                    try {
                        res = await runQuery(query);

                        // Se res.length è 0 allora la query è andata a buon fine
                        if (res.length == 0) return 0;
                    }
                    catch (err) {
                        // Altrimenti viene generato un errore catturato qui
                        console.log(err);
                        return -1;
                    }
                }
                // Altrimenti restituisci un errore (posti non disponibili)
                else return -2;
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        }
        // Altrimenti restituisci un errore (utente giò registrato all'evento)
        else return -3;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per richiedere nuove info al db riguardo un evento
async function info(id) {
    // Imposta la query
    var query = "SELECT Luogo, Organizzatore FROM Evento WHERE ID = " + id;

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la ricerca di eventi
async function search(src) {
    // Imposta la query
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID\
                FROM Evento WHERE Titolo ILIKE \'%" + src + "%\' ORDER BY ID;"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la visualizzazione delle prenotazioni effettuate
async function prenotazioni(user) {
    // Imposta la query
    var query = "SELECT Titolo, Evento.DataOra, ID FROM Evento JOIN Prenotazione\
                ON ID_Evento = ID WHERE Email_Utente =\'" + user + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

/* Funzione per disdire una prenotazione effettuata
 * Restituisce dei codici di errore:
 *  0 = Disdetta effettuata con successo
 *  -1 = Errore nelle query
 *  -2 = Disdetta fallita
*/
async function unbook(id, user) {
    // Imposta la query
    var query = "DELETE FROM Prenotazione WHERE Email_Utente =\'" + user + "\'\
                AND ID_Evento =" + id + ";"

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);

        if (res == 1)
            return 0;
        else return -2;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

async function getUserData(email) {
    // Imposta la query
    var query = "SELECT Nome, Cognome, Datanascita FROM Utente WHERE email = \'" + email + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
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
    switch (giorno) {
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
    switch (mese) {
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
    loadMainListing,
    insertUser,
    changeUser,
    logUser,
    getLevel,
    book,
    info,
    search,
    prenotazioni,
    unbook,
    getUserData,
    formatDate,
    insertEvent
}