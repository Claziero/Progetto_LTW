const { ConditionalExpression } = require("requirejs");

// Verifica che le due password inserite siano uguali
function checkPwdMatch () {
    if (document.getElementById('password').value ==
        document.getElementById('password_repeat').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = '';
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('password_repeat').style.borderColor = 'green';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Le password non corrispondono';
        document.getElementById('password_repeat').style.borderColor = 'red';
    }
}

// Verifica la lunghezza minima della password
function checkLgh () {
    var a = document.getElementById('password').value;
    if ((a.length) < 8) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('message').innerHTML = 'La password deve contenere almeno 8 caratteri';
    } else {
        document.getElementById('message').style.color = 'green';
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('message').innerHTML = '';
    }
}

function showPwd () {
    var txt = document.getElementById('password');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}

function showPwd2 () {
    var txt = document.getElementById('password_repeat');
    if (txt.type == 'password') {
        txt.type = 'text';
    }else {
        txt.type = 'password';
    }
}

function checkAge (){
    var today = new Date();
    var date18 = today;
    date18.setFullYear = today.getFullYear - 18;
    signupdata = document.getElementById('data');
    if ((date18.getTime)<=(today.getTime)){
        document.getElementById('message').style.color= 'red';
        document.getElementById('message').innerHTML = 'Devi essere maggiorenne per iscriverti al sito';
        console.log("data valida");
        return true;
    } else {
        console.log("data non valida");
        return false;
    }

}

// Funzione per il check del form prima dell'invio al server
function validaForm() {
    
    // Controllare che tutti i campi della form siano validi
    // In seguito redirezionare verso /signupValid
    
}