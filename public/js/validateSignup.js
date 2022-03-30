
// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }



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
    if ((b.length) != 1) {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'inserire singolo carattere per sesso';
    }
    if ((document.getElementById('sesso').value!='M') && (document.getElementById('sesso').value!='F') && (document.getElementById('sesso').value!='U') && (document.getElementById('sesso').value!='N') ){
        document.getElementById('message').style.color = 'red'
        document.getElementById('message').innerHTML = 'inserire M = maschio, F = femmina, N = non binario, U = non definito';
    }


}

var funshowPsw = function (){
    var a = document.getElementById('showPsw');
    var password = document.getElementById('psw');

    if (a.checked ==true){
        document.getElementById('psw').type="text";
    }
}

