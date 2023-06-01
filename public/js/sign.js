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
    document.getElementById("waitsign").style.display="block";
 
}



const display = document.querySelector(".display");
const input = document.querySelector("#upload");
let img = document.querySelector("img");

input.addEventListener("change", () => {
  let reader = new FileReader();
  reader.readAsDataURL(input.files[0]);
  reader.addEventListener("load", () => {
    display.innerHTML = `<img src=${reader.result} alt=''/>`;
  });
});