
import { Emp } from "../models/Employees.js";
import nodemailer from "nodemailer"
import ejs from "ejs";
import { addemp, get_customers } from "../app.js";
import { orders } from "../models/orders.js";
import { Sec } from "../models/menu_sections.js";

import {All } from "../models/schema.js";


import {customers } from "../models/customers.js";




//confirm mail 
function sendmail(User) {
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



const postemployees = async (req, res) => {

  const obj = {
    Name: req.body.Name,
    Email: req.body.Email,
    Address: req.body.Address,
    Phone: req.body.Phone,
    isadmin: req.body.admin === undefined ? false : true,
    verified: false,
    Password: ""
  }
  const employee = new Emp(obj);

  try {
    await employee.save();
    await sendmail(employee);
    console.log("saved successfully");
  } catch (err) {
    console.log(err);
  }

}


// create a new employee and send them an email
const getemployees = async (req, res) => {
  console.log(req.body.Email)
  console.log(req.body.password)
  let curr;
  await Emp.findOne({ Email: req.body.Email, Password: req.body.password }).then((res) => {
    curr = res;
  })

  console.log(curr);
  if (curr === null || curr === undefined || !curr.verified) {
    res.render("admin_signin", { alert: true, text: "invalid Email or Password" })
  } else {
    req.session.employee = curr;
    console.log("start redirection");
    await addemp(curr);

    res.redirect("/employees/profile");
  }

}
//verified 
const confirmmail = async (req, res) => {
  const User = await Emp.findById(req.params.id);
  if (!User.verified) {
    req.session.employee = User;
    User.verified = true;
    await User.save();
    await addemp(User);
    res.render("admin_account", { user: User });
  } else {
    res.redirect("/employees/profile")
  }
}
//admin profile 
const empprof = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  } else {

    res.render("admin_account", { user: req.session.employee });
  }
}

const changepass = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    curr.Password = req.body.psw;
    await Emp.findOneAndReplace({ Email: curr.Email }, curr);

    res.render("admin_account", { user: req.session.employee });
  }
}

///// chat //////

const getchats = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    const requested = req.params.id;
    let obj;
    if (connected.length == 0) {
      res.redirect("/employees/profile");
    }
    for (let i = 0; i < connected.length; i++) {
      if (connected[i].id === requested) {
        obj = connected[i];
        break;
      }
    }
    res.render("admin_chat", { "connected": connected, "selected": obj });
  }
}
const getallchats = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    console.log("the number is ", connected.length)
    if (connected.length == 0) {
      console.log("yesssss")
      res.redirect("/employees/profile");
    } else {
      console.log("all the connected is ", connected);
      console.log(connected[0].chat);
      res.render("admin_chat", { "connected": connected, "selected": connected[0] });
    }
  }
}
const getallchatssel = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    console.log("all the connected is ", connected);
    let sel;
    for (let i = 0; i < connected.length; i++) {
      if (connected[i]._id === req.params.id) {
        sel = connected[i];
        break;
      }
    }
    res.render("admin_chat", { "connected": connected, "selected": sel });
  }
}
/////////////
const emporder= async(req,res)=>{
const curr=req.session.employee;
if(curr===null||curr===undefined){
  res.render("admin_signin",{alert:true,text:"You have to sign in first to access orders section "});
}else{
await orders.find({emp_name:curr.Name,emp_phone:curr.Phone}).then((items)=>{
  res.render("dashboard-orders",{orders:items});
}).catch((err)=>{
  res.render("error-page");
})
}
}



//get section items by section name 
// const getsectionAdmin = async (req, res,) => {
//   Sec.find()
//   .then((result) => {
//     res.render('admin-dashboard-menu',{employes:result})

//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }; 











//get emps in table
const GetAllemps = (req, res) => {
  Emp.find()
    .then((result) => {
      console.log(result)
      res.render('dashboard-employees', { employees: result });
    })
    .catch((err) => {
      console.log(err);
    });
};











//get sections in menu
const GetAllsections = (req, res) => {
 Sec.find()
    .then((result) => {
      console.log(result)
      res.render('admin-dashboard-menu', { section: result });
    })
    .catch((err) => {
      console.log(err);
    });
};








//get products in menu in menu
const GetAllproducts = (req, res) => {
  All.find()
     .then((result) => {
       console.log(result)
       res.render('admin-dashboard-menu', {produc: result });
     })
     .catch((err) => {
       console.log(err);
     });
 };
 





 const GetAllcustomers = (req, res) => {
  customers.find()
     .then((result) => {
       console.log(result)
       res.render('recent-customers', {custt: result });
     })
     .catch((err) => {
       console.log(err);
     });
 };
 




export { getallchatssel, getemployees, postemployees, confirmmail, empprof, changepass, getallchats ,emporder,GetAllemps,GetAllsections,GetAllproducts,GetAllcustomers};
//formated


