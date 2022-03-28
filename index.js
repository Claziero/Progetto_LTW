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

// Porta 3000 per il server
app.listen(3000);
