

// Verifica che le due password inserite siano uguali
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

// Verifica la lunghezza minima della password
function checkLgh() {
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

// Verifica che il sesso sia tra le scelte ammissibili
function checkSex() {
    var a = $('#sesso').val();
    return (a == 'M' || a == 'F' || a == 'U');
}

// verifica che la data inserita sia valida (almeno 18 anni)
function checkData() {
    var today = new Date();
    var date18 = today;
    var anno= today.getFullYear();
    console.log(anno);
    date18.setFullYear
   
    var signupdata = document.getElementById('data').value;
    console.log(date18);
    if ((date18) <= (signupdata)) {
        // document.getElementById('message').style.color= 'green';
        // document.getElementById('message').innerHTML = '';
        $('#message').attr('style', 'color: green');
        $('#message').html('');
        
        console.log("data valida");
        return true;
    } else {
        // document.getElementById('message').style.color= 'red';
        $('#message').attr('style', 'color: red');
        // document.getElementById('message').innerHTML = 'Devi essere maggiorenne per iscriverti al sito';
        $('#message').html('Devi essere maggiorenne per iscriverti al sito');
        console.log("data non valida");
        return false;
    }
}

// Mostra la password (1)
function showPwd() {
    if ($('#password').attr('type') == 'password')
        $('#password').attr('type', 'text');
    else
        $('#password').attr('type', 'password');
}

// Mostra la password (2)
function showPwd2() {
    if ($('#password_repeat').attr('type') == 'password')
        $('#password_repeat').attr('type', 'text');
    else
        $('#password_repeat').attr('type', 'password');
}


// Funzione per il check del form prima dell'invio al server
function validaForm() { // Controllare che tutti i campi della form siano validi
    return (checkLgh() && checkPwdMatch() && checkSex() && checkData());
}
