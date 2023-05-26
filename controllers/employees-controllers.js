
import {Emp} from "../models/Employees.js";
 


// const postemployees=(req, res)=> {
  
//     const employee=new Emp(req.body);
//     employee
//     .save( )
//     .then( result => {
//      console.log("succesfully saved");
//     })
//     .catch( err => {
//       console.log(err);
//     });
//   }



  const postemployees = async (req, res)=> {
   
    const obj={Name:req.body.Name,
   Email:req.body.Email,
    Address:req.body.Address,
    Phone:req.body.Phone,
    isadmin:req.body.admin===undefined?false:true,
verified:false
    }
        const employee=new Emp(obj);
    
    try{
    await employee.save();
    console.log("saved successfully");
    }catch(err){
    console.log(err);
    }

  }



  const getemployees= (req, res) => {
 
const curr=Emp.findOne({Email:req.body.Email,Password:req.body.Password});
if(curr===null||curr===undefined||!curr.verified){
  res.render("sign-in",{alert:true,text:"invalid Email or Password"})
}else{
  req.session.employee=curr;
  res.redirect("employees/profile")
}

  }

  const confirmmail=async (req,res)=>{
    const User = await Emp.findById(req.params.id);
    if(!User.verified){
      res.render("admin_account",{user:User});
    }else{
      res.redirect("/employees/profile")
    }
  }

  const empprof=async (req,res)=>{
    if(req.session.employee===undefined||req.session.employee===null){
res.rnder("admin_signin",{alert:true,text:"You must login first to access this section !"});
    }
  }






  export {getemployees,postemployees,confirmmail,empprof};