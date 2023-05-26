
import {Emp} from "../models/Employees.js";
 import nodemailer from "nodemailer"

import ejs from "ejs";







function sendmail(User){
  const trans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "aussiefood6@gmail.com",
      pass: "gqhnpwicffirkdhn"
    }
  });
  let data;
  ejs.renderFile("/Users/user/Desktop/web_back2 /views/emp_mail.ejs", { user: User }, (err, d) => {
    data = d;
   
  });
  console.log(User.id);
  const options = {
    from: "aussiefood6@gmail.com",
    to: User.Email,
    subject: "mail confirmation",
    html: data

  }
  trans.sendMail(options, function (err, info) {
    if (err) {
      console.log("there are an error " + err)
    } else {
      console.log(info);
    }
  })
}

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
    await sendmail(employee);
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
res.render("admin_signin",{alert:true,text:"You must login first to access this section !"});
    }
  }

const changepass= async (req,res)=>{
  if(req.session.employee===undefined||req.session.employee===null){
    res.render("admin_signin",{alert:true,text:"You must login first to access this section !"});
        }
        const curr=req.session.employee;
        curr.Password=req.body.psw;
        Emp.findOneAndReplace({Email:curr.Email},curr);
res.redirect("admin_account");
}




  export {getemployees,postemployees,confirmmail,empprof};