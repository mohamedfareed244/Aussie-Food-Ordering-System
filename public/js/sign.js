function validateemail(field)
{
    if(field==''){
        document.getElementById('mail').innerHTML='Please enter your phone number';
        document.getElementById('idmail').style.borderColor = "red";
        return false;
    }
    else if(field.length!==11){
        document.getElementById('mail').innerHTML=' invalid phone number ';
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
function validate()
{
    console.log("i join ")
    document.getElementById("waitsign").style.display="block";
 
}


