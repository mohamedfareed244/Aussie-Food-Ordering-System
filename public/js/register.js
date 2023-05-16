
function validatefName(field)
    {
        if(field==''){
            document.getElementById('fname').innerHTML='You must enter your first name.';
            document.getElementById('inputfname').style.borderColor = "red";
            return false;
        }
        else{
            document.getElementById('fname').innerHTML='';
            return true;
        }
    }
    function validateMName(field)
    {
        if(field==''){
            document.getElementById('mname').innerHTML='You must enter your middle name.';
            document.getElementById('inputmname').style.borderColor = "red";
            return false;
        }
        else{
            document.getElementById('mname').innerHTML='';
            return true;
        }
    }
    function validateLName(field)
    {
        if(field==''){
            document.getElementById('lname').innerHTML='You must enter your last name.';
            document.getElementById('inputlname').style.borderColor = "red";
            return false;
        }
        else{
            document.getElementById('lname').innerHTML='';
            return true;
        }
    }
    function validatenumber(field)
    { 
         var phoneno = /^\d{11}$/;
         if(field.match(phoneno))
         {
             return true;
         }
         else
          {
            document.getElementById('phone').innerHTML='Enter a valid number';
            document.getElementById('inputphone').style.borderColor = "red";

              return false;
         }
    }
    
    
    function ValidateEmail(input)
     {

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

         if (input.value.match(validRegex)) 
           {
                 return true;

           } 
        else
         {

             document.getElementById('mail').innerHTML='Enter a valid email';
            document.getElementById('inputmail').style.borderColor = "red";

             return false;

         }

        }
    function validatePassword(field1, field2)
    {
        let valid=true;
        if(field1=='')
        {
            document.getElementById('password').innerHTML='you must enter a Password.';
            document.getElementById('inputpass').style.borderColor = "red";
            valid=false;
        }
        else
        {
            document.getElementById('password').innerHTML='';
        }
        if(field1!=field2 || field2=='')
        {
            document.getElementById('cpassword').innerHTML='you must enter a matching Password.';
            document.getElementById('inputcpass').style.borderColor = "red";
            valid=false;
        }
        else
        {
            document.getElementById('cpasword').innerHTML='';
        }
        return valid;
    }

    function validate(form)
    {
        let fail='';
        fail&=validatefName(form.inputfname.value);
        fail&=validateMName(form.inputmname.value);
        fail&=validateLName(form.inputlname.value);
        fail&=validatenumber(form.inputphone.value);
        // fail&=ValidateEmail(form.inputmail.value);
        fail&=validatePassword(form.inputpass.value, form.inputcpass.value);



        if(fail)
        {
            return true;
        }
            
        else
        {
            return false;
        }
    }
function validate1(form)
    {
        let fail='';
       
        fail&=validatePassword(form.inputpass.value, form.inputcpass.value);



        if(fail)
        {
            return true;
        }
            
        else{
            return false;
        }
    }
