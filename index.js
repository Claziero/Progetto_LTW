const express = require('express');
const {engine} = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const session = require('express-session'); 

const SESS_NAME = 'session';
const SECRET_STR = 'segreto';

const app = express();
app.listen(3000); // Porta 3000 per il server

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Per usare file di stile css e script javascript
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Per l'uso della sessione 
app.use(session({
    secret: SECRET_STR,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    name: SESS_NAME,
    cookie: {maxAge: 1000*60*60*1}, // Durata max. 1 ora
}));

// Funzione per reindirizzare un utente alla pagina di login qualora non fosse loggato
const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    else next();
}

// Funzione per reindirizzare un utente alla home qualora fosse loggato
const redirectHome = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    }
    else next();
}

// Render della homepage
app.get('/', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    // Esegui la query per il main listing
    var query = await db.loadMainListing();
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    res.render('home', {
        title: "Home", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged
    });
});

// Render della pagina di login
app.get('/login', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    res.render('login', {
        title: "Login", 
        style: "style-signin.css",
        js: "validateSignin.js"
    });
});

// Render della pagina di registrazione
app.get('/signup', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    res.render('signup', {
        title: "Registrati", 
        style: "style-signup.css",
        js: "validateSignup.js"
    });
});

// Per registrare un nuovo utente
app.post('/signupValid', (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Inserisci i dati nel db
    var user = {
        nome: req.body.nome,
        cognome: req.body.cognome,
        datanasc: req.body.data,
        sesso: req.body.sesso,
        email: req.body.email,
        password: req.body.password,
        validato: true,
        privilegi: 0
    };

    db.insertUser(user).then(sign => {
        // Se c'è un errore nella registrazione
        if (sign == -1) {
            console.log(">>Registrazione errata: email esistente (" + user.email + ")");

            res.render('signup', {
                title: "Registrati", 
                style: "style-signup.css",
                js: "validateSignup.js",
                error: 'La mail esiste già. Prova ad accedere'
            });
            return;
        }
        // Altrimenti vai avanti e crea la sessione
        else {
            console.log(">>Nuovo utente registrato: " + req.body.email);
            
            req.session.user = {
                email: user.email,
                nome: user.nome.charAt(0).toUpperCase() + user.nome.slice(1)
            };
            req.session.views = 0;
    
            // Torna alla home
            return res.redirect('/');
        }
    });
});

// Per prendere i dati del login
app.post('/loginValid', (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    console.log(">>Nuova richiesta di login: " + req.body.email);

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    // Verifica le credenziali immesse
    db.logUser(user).then(log => {
        if (typeof log === 'string') {
            console.log(">>Utente loggato: " + user.email);

            // Imposta la sessione
            req.session.user = {
                email: user.email,
                nome: log.charAt(0).toUpperCase() + log.slice(1)
            }
            req.session.views = 0;

            // Torna alla home
            return res.redirect('/');
        }
        else if (log == -1) {
            console.log(">>Accesso errato: pwd errata (" + user.email + ")");
            
            res.render('login', {
                title: "Login", 
                style: "style-signin.css",
                js: "validateSignin.js",
                email: req.body.email,
                error: 'La password non è corretta. Riprova'
            });
            return;
        }
        else if (log == -2) {
            console.log(">>Accesso errato: mail errata (" + user.email + ")");

            res.render('login', {
                title: "Login", 
                style: "style-signin.css",
                js: "validateSignin.js",
                email: req.body.email,
                error: 'La mail non è registrata. Riprova'
            });
            return;
        }
    });
});

// Render della pagina di impostazioni
app.get('/settings', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    res.render('settings', {
        title: "Impostazioni", 
        style: "style-settings.css",
        js: "validateSettings.js"
    });
});

// Render della pagina di profilo
app.get('/profile', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    res.render('profile', {
        title: "Profilo", 
        style: "style-settings.css", // Usa lo stesso stile di settings
        js: ""
    });
});

// Render della pagina di logout
app.get('/logout', redirectLogin, (req, res) => {
    console.log(">>Utente uscito: " + req.session.user.email);

    // Elimina la sessione
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }

        res.clearCookie(SESS_NAME);
    });
    
    res.render('logout', {
        title: "Logout"
    });
});

// Intercetta le prenotazioni degli eventi
app.get('/book=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'ID della prenotazione
    var id = req.originalUrl.split('=')[1];

    // Prova a registrare la prenotazione
    db.book(id, req.session.user).then(b => {
        if (b == 0) {
            console.log(">>[Pren.evento] Prenotazione OK");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Pren.evento] Errore nella query");

            // Avvisa l'utente dell'errore
            res.write("Errore interno durante la prenotazione. Riprova");
            res.end();
        }
        else if (b == -2) {
            console.log(">>[Pren.evento] Posti non disp");

            // Avvisa l'utente dell'errore
            res.write("Siamo spiacenti, ma i posti disponibili sono terminati!");
            res.end();
        }
        else if (b == -3) {
            console.log(">>[Pren.evento] Utente già registrato");

            // Avvisa l'utente dell'errore
            res.write("Attenzione! Sei già prenotato per questo evento. Visita il tuo profilo.");
            res.end();
        }
    });
});


// Pagina 404 (errore)
app.use((req, res) => {
    res.render('404', {
        title: "Error404", 
        style: "style-main.css",
    });
});
