function validateemail(field)
{
    if(field==''){
        document.getElementById('mail').innerHTML='Please enter your email adress';
        document.getElementById('idmail').style.borderColor = "red";
        return false;
    }
    else{
        document.getElementById('mail').innerHTML='';
        return true;
    }
}
function validatepassword(field)
{
    if(field==''){
        document.getElementById('password').innerHTML='Please enter your password';
        document.getElementById('idpass').style.borderColor = "red";
        return false;
    }
    else{
        document.getElementById('password').innerHTML='';
        return true;
    }
}
function validate(form)
{
    let fail='';
    fail&=validateemail(form.idmail.value);
    fail&=validatepassword(form.idpass.value);
    

    if(fail)
        return true;
    else{
        return false;
    }
}