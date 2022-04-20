function showSetPwd1 () {
    var txt = document.getElementById('inputPsw');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}

function showSetPwd2() {
    var txt = document.getElementById('psw-repeat');
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
        $('#messageSet').attr('style', 'color: red');
        $('#messageSet').html('La password deve contenere almeno 8 caratteri');
        return false;
    } else {
        $('#password').attr('style', 'border-color: green');
        $('#messageSet').attr('style', 'color: green');
        $('#messageSet').html('');
        return true;
    }
}

function checkPwdMatch() {
    if ($('#password').val() == $('#password_repeat').val()) {
        $('#messageSet').html('');
        $('#password').attr('style', 'border-color: green');
        $('#password_repeat').attr('style', 'border-color: green');
        return true;
    } else {
        $('#messageSet').attr('style', 'color: red');
        $('#messageSet').html('Le password non corrispondono');
        $('#password_repeat').attr('style', 'border-color: red');
        return false;
    }
}
