//variabili di login

//inputEmail

//inputPassword


function showPwd () {
    var txt = document.getElementById('password');
    if (txt.type == 'password') {
        txt.type = 'text';
    } else {
        txt.type = 'password';
    }
}