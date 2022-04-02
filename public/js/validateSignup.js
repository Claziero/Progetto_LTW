// Verifica che le due password inserite siano uguali
function checkPwdMatch () {
    if (document.getElementById('password').value ==
        document.getElementById('password_repeat').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = '';
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('password_repeat').style.borderColor = 'green';
        return true;
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Le password non corrispondono';
        document.getElementById('password_repeat').style.borderColor = 'red';
        return false;
    }
}

// Verifica la lunghezza minima della password
function checkLgh () {
    var a = document.getElementById('password').value;
    if ((a.length) < 8) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('message').innerHTML = 'La password deve contenere almeno 8 caratteri';
        return false;        
    } else {
        document.getElementById('message').style.color = 'green';
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('message').innerHTML = '';
        return true;        
    }
}

// Verifica che il sesso sia tra le scelte ammissibili
function checkSex () {
    var a = document.getElementById('sesso').value;
    return (a == 'M' || a == 'F' || a == 'U');
}

// verifica che la data inserita sia valida (almeno 18 anni)
function checkData () {
    // TBA
    return true;
}

// Mostra la password (1)
function showPwd () {
    var txt = document.getElementById('password');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}

// Mostra la password (2)
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
    return (checkLgh() && checkPwdMatch() && checkSex() && checkData());
}