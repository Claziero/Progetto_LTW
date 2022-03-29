const express = require('express');
const {engine} = require('express-handlebars');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// Per usare file di stile css e script javascript
app.use(express.static("public"));

// Render della homepage
app.get('/', (req, res) => {
    res.render('home', {
        title: "Home", 
        style: "style-main.css",
        js: "homeActions.js"
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
<<<<<<< HEAD
        title: "Signup", 
=======
        title: "Registrati", 
>>>>>>> a099fdefefa3d1760bd9f8d0f761988c61559b44
        style: "style-signup.css",
        js: "validateSignup.js"
    });
});

<<<<<<< HEAD
=======
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
>>>>>>> a099fdefefa3d1760bd9f8d0f761988c61559b44

// Porta 3000 per il server
app.listen(3000);
