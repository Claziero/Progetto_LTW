
// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

//const { password } = require("pg/lib/defaults");



var check = function () {
    if (document.getElementById('password').value ==
        document.getElementById('password_repeat').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'matching';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'not matching';
    }
}


var checkLgh = function () {
    var a = document.getElementById('password').value;
    if ((a.length) < 6) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'troppo corta';
    } else {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'lunghezza OK';
        
    }


}

var checkSex = function () {
    var a = document.getElementById('sesso').value;
    if ((a.length) != 1) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'inserire singolo carattere per sesso';
    }
    else if ((document.getElementById('sesso').value!='M') && (document.getElementById('sesso').value!='F') && (document.getElementById('sesso').value!='U') && (document.getElementById('sesso').value!='N') ){
        document.getElementById('message').style.color = 'red'
        document.getElementById('message').innerHTML = 'inserire M = maschio, F = femmina, N = non binario, U = non definito';
    }


}

var funshowPsw = function (){
    
    var txt = document.getElementById('password');
    if (txt.type== 'password'){
        txt.type = 'text';
    }else {
        txt.type="password";
    }
 
}

var funshowPsw2 = function (){
    var txt = document.getElementById('password_repeat');
    if (txt.type== 'password'){
        txt.type = 'text';
    }else {
        txt.type="password";
    }
 
}