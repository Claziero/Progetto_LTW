const express = require('express');
const {engine} = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Per usare file di stile css e script javascript
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

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

// Per prendere i dati del login
app.post('/loginValid', (req,res)=>{
    console.log(req.body);
    var user = {
        emai: req.body.email,
        password: req.body.password
    };
    var valid= db.logUser(user);
    if (valid) {
        
    }else {

    }
});

// Per prendere i dati della registrazione
app.post('/signupValid', (req, res) => {
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
