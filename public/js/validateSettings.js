const { type } = require("express/lib/response");

function showSetPwd1 () {
    var txt = document.getElementById('password');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}

function showSetPwd2() {
    var txt = document.getElementById('password_repeat');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}


// Verifica la lunghezza minima della password
function checkLghSet() {
    if ($('#password').val().length < 8) {
        $('#password').attr('style', 'border-color: red');
        $('#message').attr('style', 'color: red');
        $('#message').html('La password deve contenere almeno 8 caratteri');
        return false;
    } else {
        $('#password').attr('style', 'border-color: green');
        $('#message').attr('style', 'color: green');
        $('#message').html('');
        return true;
    }
}

function checkPwdMatch() {
    if ($('#password').val() == $('#password_repeat').val()) {
        $('#message').html('');
        $('#password').attr('style', 'border-color: green');
        $('#password_repeat').attr('style', 'border-color: green');
        return true;
    } else {
        $('#message').attr('style', 'color: red');
        $('#message').html('Le password non corrispondono');
        $('#password_repeat').attr('style', 'border-color: red');
        return false;
    }
}

function enableChanges(){
    
    var el = document.getElementById('bottone');
    if (el.type == 'button' ){
        el.type='submit';
        el.value = 'conferma';
        document.getElementById('nome').removeAttribute('readonly');
        document.getElementById('cognome').removeAttribute('readonly');
        document.getElementById('data').removeAttribute('readonly');
        document.getElementById('oldPsw').removeAttribute('readonly');
        document.getElementById('password').removeAttribute('readonly');
        document.getElementById('password_repeat').removeAttribute('readonly');


    }


}


// Funzione per il controllo dei campi immessi prima della submit
function validaForm() {
    // COMPLETARE
    return true;
}