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

// Funzione per il check del form prima dell'invio al server
function validaForm() {
    // Controllare che tutti i campi della form siano validi
    // In seguito redirezionare verso /signupValid
    
}