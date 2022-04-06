const express = require('express');
const {engine} = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const session = require('express-session'); 

const app = express();
var uuid = 0;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Per usare file di stile css e script javascript
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
    secret: 'segreto',
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    name: 'nome cookie sessione',
    cookie: {maxAge: 1000*60*60*24}, // Durata max. 1 giorno
}));

// Render della homepage
app.get('/', async (req, res) => {

    // Esegui la query per il main listing
    var query = await db.loadMainListing();
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    res.render('home', {
        title: "Home", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query
    });
});

// Render della pagina di login
app.get('/login', (req, res) => {
    res.render('login', {
        title: "Login", 
        style: "style-signin.css",
        js: "validateSignin.js"
    });
});

// Render della pagina di registrazione
app.get('/signup', (req, res) => {
    res.render('signup', {
        title: "Registrati", 
        style: "style-signup.css",
        js: "validateSignup.js"
    });
});

// Per registrare un nuovo utente
app.post('/signupValid', (req, res) => {
    console.log("----Nuovo utente registrato----")
    console.log(req.body);

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
    db.insertUser(user);

    // Torna alla home
    return res.redirect('/');
});

// Per prendere i dati del login
app.post('/loginValid', (req, res) => {
    console.log("----Nuova richiesta di login----")
    console.log(req.body);

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    // Verifica le credenziali immesse
    db.logUser(user).then(log => {
        if (log == 0) {
            console.log("----Utente loggato:----")
            console.log(user.email);

            // Imposta la sessione
            req.session.user = {
                email: user.email
            }

            console.log(req.session);

            // Torna alla home
            return res.redirect('/');
        }
        else if (log == -1) {
            console.log("----Accesso errato: pwd errata----")
            console.log(user.email);
            
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
            console.log("----Accesso errato: email errata----")
            console.log(user.email);

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
app.get('/settings', (req, res) => {
    res.render('settings', {
        title: "Impostazioni", 
        style: "style-settings.css",
        js: "validateSettings.js"
    });
});

// Render della pagina di profilo
app.get('/profile', (req, res) => {
    res.render('profile', {
        title: "Profilo", 
        style: "style-settings.css", // Usa lo stesso stile di settings
        js: ""
    });
});

// Pagina 404 (errore)
app.use((req, res) => {
    res.render('404', {
        title: "Error404", 
        style: "style-main.css",
    });
})

// Porta 3000 per il server
app.listen(3000);
