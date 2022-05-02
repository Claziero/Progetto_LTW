// Funzione per mostrare la vecchia password
function showSetPwd0() {
    if ($('#oldPsw').attr('type') == 'password')
        $('#oldPsw').attr('type', 'text');
    else 
        $('#oldPsw').attr('type', 'password');
}

// Funzione per mostrare la prima (nuova) password
function showSetPwd1() {
    if ($('#password').attr('type') == 'password')
        $('#password').attr('type', 'text');
    else 
        $('#password').attr('type', 'password');
}

// Funzione per mostrare la seconda (nuova) password
function showSetPwd2() {
    if ($('#password_repeat').attr('type') == 'password')
        $('#password_repeat').attr('type', 'text');
    else 
        $('#password_repeat').attr('type', 'password');
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

// Funzione per verificare la correttezza delle password immesse
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

// Funzione per abilitare la modifica della form
function enableChanges() {
    $("#btnModifica").hide();
    $('#btnSubmit').removeAttr('hidden');
    $('#nome').removeAttr('readonly');
    $('#cognome').removeAttr('readonly');
    $('#oldPsw').removeAttr('readonly');
    $('#password').removeAttr('readonly');
    $('#password_repeat').removeAttr('readonly');
}

// Funzione per il controllo dei campi immessi prima della submit
function validaForm() {
    // TBC
    return checkLghSet() && checkPwdMatch();
}