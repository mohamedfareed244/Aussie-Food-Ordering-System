function validateemail(field) {
    if (field == '') {
        document.getElementById('mail').innerHTML = 'Please enter your email adress';
        document.getElementById('idmail').style.borderColor = "red";
        return false;
    }

}
function validatepassword(field) {
    if (field == '') {
        document.getElementById('password').innerHTML = 'Please enter your password';
        document.getElementById('idpass').style.borderColor = "red";
        return false;
    }

}
function validate(form) {
    let fail = '';
    fail &= validateemail(form.idmail.value);
    fail &= validateMName(form.idpass.value);
    if (fail) {
        return true;
    }

    else {
        return false;
    }

}
//formated

