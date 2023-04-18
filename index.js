const express = require('express');
const {engine} = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const fs = require('fs');

const SESS_NAME = 'session';
const SECRET_STR = 'segreto';
const EVS_PER_PAGE = 12;

const app = express();
app.listen(3000); // Porta 3000 per il server

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Per usare file di stile css e script javascript
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
    try {
        if (!req.session.user) {
            res.redirect('/login');
        }
        else next();
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

// Funzione per reindirizzare un utente alla home qualora fosse loggato
const redirectHome = (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/');
        }
        else next();
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

// Render della homepage
app.get('/', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Esegui la query per il main listing
        var query = await db.loadMainListing();

        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);

        // Se il numero di pagine è almeno 1 allora setta i link e i numeri di pagina
        if (numPages > 0) {
            // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
            var pages = [];
            for (let i = 1; i <= numPages; i++) pages.push({
                num: i, 
                link: '/' + i, 
                active: ''
            });

            pages[0]['link'] = '/';
            pages[0]['active'] = 'active';
            prev = {disabled: 'disabled'};
            next = {disabled: ''};
            
            // Ritaglia i risultati della query
            if (numPages > 1) query = query.slice(0, EVS_PER_PAGE);
            else next['disabled'] = 'disabled';
            error = '';
        }
        else {
            var pages = [{num: 1, link: '/', active: 'active'}];
            prev = {disabled: 'disabled'};
            next = {disabled: 'disabled'};
            error = 'Non ci sono nuovi eventi in questa sezione.';
        }

        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });
        
        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;

            // Esegui la query per vedere tutte le prenotazioni dell'utente
            var prenotazioni = await db.prenotazioni(req.session.user.username);
            
            // Ricava gli ID degli eventi prenotati
            var s = []
            prenotazioni.forEach (elem => {
                s.push(elem['id']);
            });

            // Imposta il campo prenotato
            query.forEach (elem => {
                if (s.includes(elem['id']))
                    elem['prenotato'] = true;
                else elem['prenotato'] = false;
            });
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
            log: logged,
            pages: pages,
            prev: prev,
            next: next,
            error: error
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della homepage (pagina diversa da 1)
app.get('/[0-9]+', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni il numero di pagina richiesta
        var n = req.originalUrl.split('/')[1];
        
        // Esegui la query per il main listing
        var query = await db.loadMainListing();
        
        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);

        // Se la pagina richiesta non esiste
        if (n > numPages) {
            res.render('404', {
                title: "Error404", 
                style: "style-main.css",
            });
            return;
        }

        // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
        var pages = [];
        for (let i = 1; i <= numPages; i++) pages.push({
            num: i, 
            link: '/' + i, 
            active: ''
        });
        pages[0]['link'] = '/';
        pages[n - 1]['active'] = 'active';
        prev = {disabled: ''};
        next = {disabled: ''};

        // Ritaglia i risultati della query
        if (numPages > 1) query = query.slice(EVS_PER_PAGE * (n - 1), EVS_PER_PAGE * n);

        if (n == numPages) next['disabled'] = 'disabled';

        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });
        
        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;

            // Esegui la query per vedere tutte le prenotazioni dell'utente
            var prenotazioni = await db.prenotazioni(req.session.user.username);
            
            // Ricava gli ID degli eventi prenotati
            var s = []
            prenotazioni.forEach (elem => {
                s.push(elem['id']);
            });

            // Imposta il campo prenotato
            query.forEach (elem => {
                if (s.includes(elem['id']))
                    elem['prenotato'] = true;
                else elem['prenotato'] = false;
            });
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
            log: logged,
            pages: pages,
            prev: prev,
            next: next
        });
    }    
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della homepage con eventi "Highlights"
app.get('/highlights/:n?', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;
        var n = parseInt(req.params.n);

        // Esegui la query per il main listing
        var query = await db.loadHighlights();

        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);

        // Se il numero di pagine è almeno 1 allora setta i link e i numeri di pagina
        if (numPages > 0) {
            // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
            var pages = [];
            for (let i = 1; i <= numPages; i++) pages.push({
                num: i, 
                link: '/highlights/' + i, 
                active: ''
            });
            pages[0]['link'] = '/highlights';
            
            // Se è stata richiesta una pagina diversa dalla prima
            if (n) {
                // Se la pagina richiesta non esiste
                if (n > numPages) {
                    res.render('404', {
                        title: "Error404", 
                        style: "style-main.css",
                    });
                    return;
                }

                pages[n - 1]['active'] = 'active';
                prev = {disabled: ''};

                // Ritaglia i risultati della query
                query = query.slice(EVS_PER_PAGE * (n - 1), EVS_PER_PAGE * n);
            }
            else {
                pages[0]['active'] = 'active';
                prev = {disabled: 'disabled'};
            }
            next = {disabled: ''};
            
            if (n && n == numPages) next['disabled'] = 'disabled';
            else if (numPages > 1) query = query.slice(0, EVS_PER_PAGE);
            else next['disabled'] = 'disabled';
            error = '';
        }
        else {
            var pages = [{num: 1, link: '/highlights', active: 'active'}];
            prev = {disabled: 'disabled'};
            next = {disabled: 'disabled'};
            error = 'Non ci sono nuovi eventi in questa sezione.';
        }
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });

        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;

            // Esegui la query per vedere tutte le prenotazioni dell'utente
            var prenotazioni = await db.prenotazioni(req.session.user.username);
            
            // Ricava gli ID degli eventi prenotati
            var s = []
            prenotazioni.forEach (elem => {
                s.push(elem['id']);
            });

            // Imposta il campo prenotato
            query.forEach (elem => {
                if (s.includes(elem['id']))
                    elem['prenotato'] = true;
                else elem['prenotato'] = false;
            });
        }
        // Altrimenti mostra solo i pulsanti di login e registrazione
        else {
            logged = false;
            utente = '';
        }

        res.render('home', {
            title: "Highlights", 
            style: "style-main.css",
            js: "homeActions.js", 
            mainList: query,
            utente: utente,
            log: logged,
            pages: pages,
            prev: prev,
            next: next,
            error: error
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della homepage con eventi "Prossimamente"
app.get('/next/:n?', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;
        var n = parseInt(req.params.n);

        // Esegui la query per il main listing
        var query = await db.loadNext();

        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);

        // Se il numero di pagine è almeno 1 allora setta i link e i numeri di pagina
        if (numPages > 0) {
            // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
            var pages = [];
            for (let i = 1; i <= numPages; i++) pages.push({
                num: i, 
                link: '/next/' + i, 
                active: ''
            });
            pages[0]['link'] = '/next';

            // Se è stata richiesta una pagina diversa dalla prima
            if (n) {
                // Se la pagina richiesta non esiste
                if (n > numPages) {
                    res.render('404', {
                        title: "Error404", 
                        style: "style-main.css",
                    });
                    return;
                }

                pages[n - 1]['active'] = 'active';
                prev = {disabled: ''};

                // Ritaglia i risultati della query
                query = query.slice(EVS_PER_PAGE * (n - 1), EVS_PER_PAGE * n);
            }
            else {
                pages[0]['active'] = 'active';
                prev = {disabled: 'disabled'};
            }
            next = {disabled: ''};
            
            if (n && n == numPages) next['disabled'] = 'disabled';
            else if (numPages > 1) query = query.slice(0, EVS_PER_PAGE);
            else next['disabled'] = 'disabled';
            error = '';
        }
        else {
            var pages = [{num: 1, link: '/next', active: 'active'}];
            prev = {disabled: 'disabled'};
            next = {disabled: 'disabled'};
            error = 'Non ci sono nuovi eventi in questa sezione.';
        }
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });

        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;

            // Esegui la query per vedere tutte le prenotazioni dell'utente
            var prenotazioni = await db.prenotazioni(req.session.user.username);
            
            // Ricava gli ID degli eventi prenotati
            var s = []
            prenotazioni.forEach (elem => {
                s.push(elem['id']);
            });

            // Imposta il campo prenotato
            query.forEach (elem => {
                if (s.includes(elem['id']))
                    elem['prenotato'] = true;
                else elem['prenotato'] = false;
            });
        }
        // Altrimenti mostra solo i pulsanti di login e registrazione
        else {
            logged = false;
            utente = '';
        }

        res.render('home', {
            title: "Prossimamente", 
            style: "style-main.css",
            js: "homeActions.js", 
            mainList: query,
            utente: utente,
            log: logged,
            pages: pages,
            prev: prev,
            next: next,
            error: error
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della homepage con "Eventi conclusi"
app.get('/passed/:n?', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;
        var n = parseInt(req.params.n);

        // Esegui la query per il main listing
        var query = await db.loadPassed();

        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);

        // Se il numero di pagine è almeno 1 allora setta i link e i numeri di pagina
        if (numPages > 0) {
            // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
            var pages = [];
            for (let i = 1; i <= numPages; i++) pages.push({
                num: i, 
                link: '/passed/' + i, 
                active: ''
            });
            pages[0]['link'] = '/passed';

            // Se è stata richiesta una pagina diversa dalla prima
            if (n) {
                // Se la pagina richiesta non esiste
                if (n > numPages) {
                    res.render('404', {
                        title: "Error404", 
                        style: "style-main.css",
                    });
                    return;
                }

                pages[n - 1]['active'] = 'active';
                prev = {disabled: ''};

                // Ritaglia i risultati della query
                query = query.slice(EVS_PER_PAGE * (n - 1), EVS_PER_PAGE * n);
            }
            else {
                pages[0]['active'] = 'active';
                prev = {disabled: 'disabled'};
            }
            next = {disabled: ''};
                    
            if (n && n == numPages) next['disabled'] = 'disabled';
            if (numPages > 1) query = query.slice(0, EVS_PER_PAGE);
            else next['disabled'] = 'disabled';
            error = '';
        }
        else {
            var pages = [{num: 1, link: '/passed', active: 'active'}];
            prev = {disabled: 'disabled'};
            next = {disabled: 'disabled'};
            error = 'Non ci sono nuovi eventi in questa sezione.';
        }
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });

        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;
        }
        // Altrimenti mostra solo i pulsanti di login e registrazione
        else {
            logged = false;
            utente = '';
        }

        res.render('home', {
            title: "Eventi passati", 
            style: "style-main.css",
            js: "homeActions.js", 
            mainList: query,
            utente: utente,
            log: logged,
            pages: pages,
            prev: prev,
            next: next,
            error: error
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina di registrazione
app.get('/signup', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Renderizza la pagina di signup
    res.render('signup', {
        title: "Registrati", 
        style: "style-signup.css",
        js: "validateSignup.js"
    });
});

// Per registrare un nuovo utente
app.post('/signupValid', (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Inserisci i dati nel db
        var user = {
            name: req.body.name,
            surname: req.body.surname,
            born: req.body.data,
            gender: req.body.gender,
            username: req.body.username,
            password: req.body.password,
            privileges: 0
        };

        // Prova la registrazione
        db.insertUser(user).then(sign => {
            // Se c'è un errore nella registrazione
            if (sign == -1) {
                console.log(">>Registrazione errata: username esistente (" + user.username + ")");

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
                console.log(">>Nuovo utente registrato: " + req.body.username);
                
                req.session.user = {
                    username: user.username,
                    name: user.name.charAt(0).toUpperCase() + user.name.slice(1)
                };
                req.session.views = 0;

                if (!req.session.user.username.includes('/')) {
                    // Crea il file di log per l'utente corrente
                    fs.writeFile('logs/' + user.username, '', err => {
                        if (err) console.log(err);
                    });
    
                    fs.chmod('logs/' + user.username, 0o644, err => {
                        if (err) console.log(err);
                    });
                }
        
                // Torna alla home
                return res.redirect('/');
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina di login
app.get('/login', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Renderizza la pagina di login
    res.render('signin', {
        title: "Login", 
        style: "style-signin.css",
        js: "validateSignin.js"
    });
});

// Per prendere i dati del login
app.post('/loginValid', (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;
        console.log(">>Nuova richiesta di login: " + req.body.username);

        var user = {
            username: req.body.username,
            password: req.body.password
        };

        // Verifica le credenziali immesse
        db.logUser(user).then(log => {
            if (typeof log === 'string') {
                console.log(">>Utente loggato: " + user.username);

                // Imposta la sessione
                req.session.user = {
                    username: user.username,
                    name: log.charAt(0).toUpperCase() + log.slice(1)
                }
                req.session.views = 0;

                // Torna alla home
                return res.redirect('/');
            }
            else if (log == -1) {
                console.log(">>Accesso errato: pwd errata (" + user.username + ")");
                
                res.render('signin', {
                    title: "Login", 
                    style: "style-signin.css",
                    js: "validateSignin.js",
                    username: req.body.username,
                    error: 'La password non è corretta. Riprova'
                });
                return;
            }
            else if (log == -2) {
                console.log(">>Accesso errato: mail errata (" + user.username + ")");

                res.render('signin', {
                    title: "Login", 
                    style: "style-signin.css",
                    js: "validateSignin.js",
                    username: req.body.username,
                    error: 'La mail non è registrata. Riprova'
                });
                return;
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina di impostazioni
app.get('/settings', redirectLogin, async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;
        }

        // Prendi i dati utente da mettere nei campi
        var userData = await db.getUserData(req.session.user.username);

        // Esegui la query per prendere il livello di privileges
        var livello = (await db.getLevel(req.session.user.username))[0].privileges;

        // Formatta la data in YYYY-MM-DD
        var d = new Date(userData[0].born);
        var data = d.getFullYear() + '-';
        if (d.getMonth() < 8) data += '0' 
        data += (d.getMonth() + 1) + '-';
        if (d.getDate() < 10) data += '0' 
        data += d.getDate();

        res.render('settings', {
            title: "Impostazioni", 
            style: "style-settings.css",
            js: "validateSettings.js",
            log: logged,
            utente: utente,
            name: userData[0].name,
            surname: userData[0].surname,
            data: data,
            privileges: livello == 0
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta i cambi dati del profilo utente
app.post('/changeUser', redirectLogin, async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Inserisci i dati nel db
        var user = {
            name: req.body.name,
            surname: req.body.surname,
            born: req.body.data,
            username: req.session.user.username,
            oldpwd: req.body.oldPsw,
            newpwd: req.body.password
        };

        // Nel caso l'aggiornamento dei dati non vada a buon fine
            // Se l'utente è loggato allora visualizza il dropdown in alto a destra
            if (req.session.user) {
                logged = true;
                utente = req.session.user.name;
            }

            // Prendi i dati utente da mettere nei campi
            var userData = await db.getUserData(req.session.user.username);

            // Esegui la query per prendere il livello di privileges
            var livello = (await db.getLevel(req.session.user.username))[0].privileges;

            // Formatta la data in YYYY-MM-DD
            var d = new Date(userData[0].born);
            var data = d.getFullYear() + '-';
            if (d.getMonth() < 8) data += '0' 
            data += (d.getMonth() + 1) + '-';
            if (d.getDate() < 10) data += '0' 
            data += d.getDate();

        // Prova a effettuare il cambiamento
        db.changeUser(user).then(b => {
            // Se è andato a buon fine
            if (b == 0) {
                console.log(">>Cambio dati effettuato (" + req.session.user.username + ")");
                
                res.render('settings', {
                    title: "Impostazioni", 
                    style: "style-settings.css",
                    js: "validateSettings.js",
                    log: logged,
                    utente: utente,
                    name: userData[0].name,
                    surname: userData[0].surname,
                    data: data,
                    privileges: livello == 0,
                    success: 'Cambio dati effettuato con successo. \
                        Effettua il logout per rendere effettive le modifiche.'
                });
                return;
            }
            // Se c'è un errore nelle query
            else if (b == -1) {
                console.log(">>Errore nel cambio dati (query) (" + user.username + ")");

                res.render('settings', {
                    title: "Impostazioni", 
                    style: "style-settings.css",
                    js: "validateSettings.js",
                    log: logged,
                    utente: utente,
                    name: userData[0].name,
                    surname: userData[0].surname,
                    data: data,
                    privileges: livello == 0,
                    error: 'Errore durante l\'aggiornamento dei dati. Riprova'
                });
                return;
            }
            // Se la password inserita non è corretta
            else if (b == -2) {
                console.log(">>Errore nel cambio dati (pwd errata) (" + user.username + ")");

                res.render('settings', {
                    title: "Impostazioni", 
                    style: "style-settings.css",
                    js: "validateSettings.js",
                    log: logged,
                    utente: utente,
                    name: userData[0].name,
                    surname: userData[0].surname,
                    data: data,
                    privileges: livello == 0,
                    error: 'Attenzione: la password attuale non è corretta. Riprova'
                });
                return;
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina di profilo
app.get('/profile', redirectLogin, async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;
        }

        // Esegui la query per le prenotazioni
        var query = await db.prenotazioni(req.session.user.username);

        // Esegui la query per lo storico
        var storico = await db.storico(req.session.user.username);

        // Esegui la query per prendere il livello di privileges
        var livello = (await db.getLevel(req.session.user.username))[0].privileges;

        var orgs = false;
        var username = null;
        var reqs = false;

        // Se sei un organizzatore 
        if (livello == 1) {
            // Cerca anche gli eventi organizzati
            var org = await db.organizzazioni(req.session.user.username);
            orgs = org.length > 0;

            // Formatta tutte le date ottenute
            org.forEach (elem => {
                elem['datetime'] = db.formatDate(elem['datetime'].toString());
            });

            // Cerca anche eventuali richieste di diventare organizzatore
            var richieste = await db.getRequests();
            reqs = richieste.length > 0;

            // Ricava la lista delle immagini disponibili
            var images = await db.getImagesList();
        }

        // Altrimenti sei un utente normale che può chiedere di essere organizzatore
        else username = req.session.user.username;
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });
        storico.forEach (elem => {
            elem['datetime'] = db.formatDate(elem['datetime'].toString());
        });

        res.render('profile', {
            title: "Profilo", 
            //style: "style-settings.css", // Usa lo stesso stile di settings
            style: "style-profile.css",
            js: "profileActions.js",
            prenotazioni: query,
            notEmpty: query.length > 0,
            log: logged,
            utente: utente,
            privileges: livello == 1,
            numOrg: orgs,
            organizzazioni: org,
            username: username,
            richiesta: livello == 3,
            utenti: richieste,
            requests: reqs, 
            storico: storico,
            notEmptyStorico: storico.length > 0,
            images: images
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina di logout
app.get('/logout', redirectLogin, (req, res) => {
    console.log(">>Utente uscito: " + req.session.user.username);

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

// Intercetta le cancellazioni dei profili utente
app.get('/deleteUser', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        var username = req.session.user.username;

        // Prova a registrare la prenotazione
        db.deleteUser(username).then(b => {
            if (b == 0) {
                console.log(">>[Elim. utente] Eliminazione effettuata (" + username + ")");

                // Redireziona alla pagina di logout
                res.redirect('/logout');
                res.end();
            }
            else if (b == -1) {
                console.log(">>[Elim. utente] Errore nella query (" + username + ")");

                // Redireziona alla pagina delle impostazioni
                res.redirect('/settings');
                res.end();
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le creazioni di nuovi eventi
app.post('/createEvent', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Recupera i dati inseriti
        var event = {
            organizer: req.session.user.username,
            title: req.body.title,
            location: req.body.location,
            type: req.body.eventType,
            data: req.body.dateTime,
            seats: req.body.seats,
            description: req.body.description,
            image: req.body.imgEvent
        };

        // Inserisci l'evento nel db
        db.insertEvent(event).then(b => {
            // Se c'è un errore nell'inserimento dell'evento
            if (b == -1) {
                console.log(">>Errore in inserimento evento (" + user.username + ")");

                // Redireziona alla pagina del profilo
                res.redirect("/profile");
                res.end();
                return;
            }
            // Altrimenti vai avanti e redireziona alla home
            else if (b == 0) {
                console.log(">>Inserimento evento effettuato (" + req.session.user.username + ")");
                
                // Redireziona alla pagina home
                res.redirect("/");
                res.end();
                return;
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le prenotazioni degli eventi
app.get('/book=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'ID della prenotazione
        var id = req.originalUrl.split('book=')[1];

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
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le richieste di essere organizzatori degli eventi
app.get('/beOrganizer=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'username dell'utente
        var username = req.originalUrl.split('beOrganizer=')[1];

        // Prova a registrare la prenotazione
        db.beOrganizer(username).then(b => {
            if (b == 0) {
                console.log(">>[Richiesta organ.] Richiesta OK");

                // Avvisa l'utente del successo
                res.write("[1]Richiesta inserita con successo. A breve potresti diventare un organizzatore");
                res.end();
            }
            else if (b == -1) {
                console.log(">>[Richiesta organ.] Errore nella query");

                // Avvisa l'utente dell'errore
                res.write("[0]Errore interno durante la richiesta. Riprova");
                res.end();
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le accettazioni delle richieste di essere organizzatori degli eventi
app.get('/acceptUser=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'username dell'utente
        var username = req.originalUrl.split('acceptUser=')[1];

        // Prova a registrare la prenotazione
        db.acceptRequest(username).then(b => {
            if (b == 0) {
                console.log(">>[Richiesta organ.] Richiesta Accettata (" + username + ")");

                // Redireziona alla pagina del profilo
                res.redirect('/profile');
                res.end();
            }
            else if (b == -1) {
                console.log(">>[Richiesta organ.] Errore nella query (" + username + ")");

                // Redireziona alla pagina del profilo
                res.redirect('/profile');
                res.end();
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le declinazioni delle richieste di essere organizzatori degli eventi
app.get('/declineUser=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'username dell'utente
        var username = req.originalUrl.split('declineUser=')[1];

        // Prova a registrare la prenotazione
        db.declineRequest(username).then(b => {
            if (b == 0) {
                console.log(">>[Richiesta organ.] Richiesta Respinta (" + username + ")");

                // Redireziona alla pagina del profilo
                res.redirect('/profile');
                res.end();
            }
            else if (b == -1) {
                console.log(">>[Richiesta organ.] Errore nella query (" + username + ")");

                // Redireziona alla pagina del profilo
                res.redirect('/profile');
                res.end();
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le eliminazioni degli eventi
app.get('/remove=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'ID della prenotazione
        var id = req.originalUrl.split('remove=')[1];

        // Prova a registrare la prenotazione
        db.deleteEvent(id).then(b => {
            if (b == 0) {
                console.log(">>[Rimozione.evento] Rimozione OK");

                // Redireziona alla pagina del profilo
                res.redirect('/profile');
                res.end();
            }
            else if (b == -1) {
                console.log(">>[Rimozione.evento] Errore nella query");

                // Redireziona alla pagina home
                res.redirect("/");
                res.end();
                return;            
            }
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le disdette degli eventi
app.get('/unbook=*', redirectLogin, (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'ID della prenotazione
        var id = req.originalUrl.split('unbook=')[1];

        // Prova a registrare la prenotazione
        db.unbook(id, req.session.user.username).then(b => {
            // Se è andata a buon fine l'eliminazione
            if (b == 0) 
                console.log(">>[Pren.evento] Disdetta OK");

            // Altrimenti se c'è stato un errore nella query
            else if (b == -1)
                console.log(">>[Pren.evento] Errore nella query");

            // Altrimenti se non c'è stata un'eliminazione
            else if (b == -2) 
                console.log(">>[Pren.evento] Disdetta FAILED");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Intercetta le ricerche di eventi
app.get('/search=:src/:n?', async (req, res) => {
    try {
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;
    
        // Ottieni il testo della ricerca
        var src = req.params.src;
        var n = parseInt(req.params.n);
    
        // Esegui la query
        var query = await db.search(src);

        if (req.session.user) {
            // Scrivi la query nel file di log dell'utente
            fs.appendFile('logs/' + req.session.user.username, src + '\n', (err) => {
                if (err) console.log(">>[Log] Errore nella scrittura del file");
            });
        }
    
        // Conta il numero di eventi per ricavare il numero delle pagine
        var numPages = Math.ceil(query.length / EVS_PER_PAGE);
    
        // Se il numero di pagine è almeno 1 allora setta i link e i numeri di pagina
        if (numPages > 0) {
            // Imposta i numeri di pagine, i link e gli stati degli elementi <li>
            var pages = [];
            for (let i = 1; i <= numPages; i++) pages.push({
                num: i, 
                link: '/search=' + src + '/' + i, 
                active: ''
            });
            pages[0]['link'] = '/search=' + src;
            
            // Se è stata richiesta una pagina diversa dalla prima
            if (n) {
                // Se la pagina richiesta non esiste
                if (n > numPages) {
                    res.render('404', {
                        title: "Error404", 
                        style: "style-main.css",
                    });
                    return;
                }
    
                pages[n - 1]['active'] = 'active';
                prev = {disabled: ''};
    
                // Ritaglia i risultati della query
                query = query.slice(EVS_PER_PAGE * (n - 1), EVS_PER_PAGE * n);
            }
            else {
                pages[0]['active'] = 'active';
                prev = {disabled: 'disabled'};
            }
            next = {disabled: ''};
            
            if (n == numPages) next['disabled'] = 'disabled';
            else if (numPages > 1) query = query.slice(0, EVS_PER_PAGE);
            else next['disabled'] = 'disabled';
        }
        else {
            var pages = [{num: 1, link: '/search=' + src, active: 'active'}];
            prev = {disabled: 'disabled'};
            next = {disabled: 'disabled'};
        }
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            try {
                elem['datetime'] = db.formatDate(elem['datetime'].toString());
            }
            catch (err) {
                elem['datetime'] = "Data non disponibile";
            }
        });
    
        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.name;
    
            // Esegui la query per vedere tutte le prenotazioni dell'utente
            var prenotazioni = await db.prenotazioni(req.session.user.username);
            
            // Ricava gli ID degli eventi prenotati
            var s = []
            prenotazioni.forEach (elem => {
                s.push(elem['id']);
            });
    
            // Imposta il campo prenotato
            query.forEach (elem => {
                if (s.includes(elem['id']))
                    elem['prenotato'] = true;
                else elem['prenotato'] = false;
            });
        }
        // Altrimenti mostra solo i pulsanti di login e registrazione
        else {
            logged = false;
            utente = '';
        }
    
        // Se la query non restituisce risultati allora segnalalo
        if (query.length == 0) 
            error = 'La ricerca non ha prodotto risultati! Riprova';
        else error = false;
    
        // Renderizza la nuova pagina
        res.render('home', {
            title: "Ricerca", 
            style: "style-main.css",
            js: "homeActions.js", 
            mainList: query,
            utente: utente,
            log: logged,
            pages: pages,
            prev: prev,
            next: next,
            error: error
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Intercetta le richieste di stampa degli eventi
app.get('/stampa=*', redirectLogin, async (req, res) => {
    try{
        // Incrementa il contatore di visualizzazioni della pagina
        req.session.views += 1;

        // Ottieni l'ID dell'evento
        var id = req.originalUrl.split('stampa=')[1];

        // Esegui la query
        var query = await db.getPrintData(id, req.session.user.username);
        
        // Formatta tutte le date ottenute
        query.forEach (elem => {
            elem['edataora'] = db.formatDate(elem['edataora'].toString());
            elem['pdataora'] = db.formatDate(elem['pdataora'].toString());
        });

        // Renderizza la pagina
        res.render('print', {
            title: "Stampa", 
            style: "style-print.css",
            js: "qrcode.min.js",
            dati: query
        });
    }
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

// Render della pagina delle FAQ
app.get('/faq', (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.name;
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    // Renderizza la pagina
    res.render('faq', {
        title: 'FAQ',
        style: 'style-faq.css',
        utente: utente,
        log: logged
    });
});


// Pagina 404 (errore)
app.use((req, res) => {
    res.render('404', {
        title: "Error404", 
        style: "style-main.css",
    });
});
