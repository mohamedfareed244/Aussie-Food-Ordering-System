import { customers } from "../models/customers.js";
import { io } from "../bin/www.js";
import nodemailer from "nodemailer"
import ejs from "ejs"
import validator from 'validator';

async function sendsms(User) {

  const trans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "aussiefood6@gmail.com",
      pass: "gqhnpwicffirkdhn"
    }
  });
  let data;
  ejs.renderFile("/Users/user/Desktop/web_back2 /views/template.ejs", { user: User }, (err, d) => {
    data = d;
    console.log(d);
  });
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



let pass = true;
//validations
function validate(req, res) {
  pass = true;
  let text = '';


  const obj = {
    Firstname: req.body.Firstname,
    Middlename: req.body.Middlename,
    Lastname: req.body.Lastname,
    Phone: req.body.Phone,
    Email: req.body.Email,
    Password: req.body.Password,
    confirm: req.body.psw_confirmt
  };

  if (obj.Firstname.trim() === '' || obj.Lastname.trim() === '' || obj.Middlename.trim() === ''
    || obj.Password.trim() === '' || obj.confirm.trim() === '' || obj.Email.trim() === '' ||
    obj.Phone.trim() === '') {

    text = 'Please fill out all the form!';
    pass = false;
    res.render("register", { alert: true, text: text });

  }

  if (!validator.isEmail(obj.Email)) {
    pass = false;
    text = 'Invalid email';
    res.render("register", { alert: true, text: text });
  }

  if (!validator.isMobilePhone(obj.Phone)) {
    pass = false;
    text = 'Invalid phone';
    res.render("register", { alert: true, text: text });
  }





  if (obj.Password == obj.confirm) {

    const hasUpperCase = /[A-Z]/.test(obj.Password);
    const hasLowerCase = /[a-z]/.test(obj.Password);
    const hasNumber = /[0-9]/.test(obj.Password);
    const hasSpecialChar = /[!@#$%^&*().]/.test(obj.Password);
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      pass = false;
      text = 'password must contain uppercase, lowercase , number and special character';
      res.render("register", { alert: true, text: text });

    }

  }
  else {
    pass = false;
    text = 'Passwords are not match';
    res.render("register", { alert: true, text: text });

  }


}






//add new customer to the database 
const postcustomers = async (req, res) => {
  await validate(req, res);
  if (pass) {
    console.log(req.body.Phone);
    await customers.findOne({ Email: req.body.Email }).then(async (result) => {
      if (result !== null) {
        res.render("register", { alert: true, text: "this email already exists ! " });
      } else {
        const obj = {
          Firstname: req.body.Firstname,
          Middlename: req.body.Middlename,
          Lastname: req.body.Lastname,
          Phone: req.body.Phone,
          "Orders": new Array(),
          Email: req.body.Email,
          Password: req.body.Password,
          "chat": new Array(),
          verified: false,
          favorites: new Array(),
          addreses: new Array()
        }
        const customer = new customers(obj);

        try {
          await customer.save();
          sendsms(customer);
          res.redirect("/products/All");
        } catch (err) {
          console.log(err);
        }
      }

    })




  }



}
//customer sign in 
const getcustomers = async (req, res) => {

  let current_customer;
  console.log(req.body.phone);
  console.log(req.body.password);
  await customers.findOne({ Email: req.body.phone, Password: req.body.password }).then((result) => {
    current_customer = result;
  })
  console.log(current_customer);

  if (current_customer === undefined || current_customer === null) {
    res.render("sign-in", { alert: true, text: " incorrect email or password " });

  } else {
    if (!current_customer.verified) {
      res.render("sign-in", { alert: true, text: " you have to verify your email firstly check your mailbox please" });
      return;
    }
    req.session.signed_customer = current_customer;
    console.log(req.rawHeaders[19]);
    res.redirect("/products/All");
  }
}



const customerpr = async (req, res) => {
  if (req.session.signed_customer === null || req.session.signed_customer === undefined) {
    res.render("sign-in", { alert: true, text: "you must sign in to access profile " });
  } else {
    res.render("personalinfo", { customer: req.session.signed_customer });
  }
}

const customeror = async (req, res) => {
  res.render("customer_orders");
}

const customerchnagepass = async (req, res) => {

  if (req.session.signed_customer === undefined || req.session.signed_customer === null) {
    res.render("sign-in", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.signed_customer;
    if (curr.Password == req.body.currentpassword) 
    {
      if (req.body.newpassword == req.body.confirmPassword)
       {
        curr.Password = req.body.newpassword;

        await customers.findOneAndReplace({ Email: curr.Email }, curr);
        console.log("password changed ");

        res.render("personalinfo", { customer: req.session.signed_customer });
      }
      else {
        console.log(req.body.newpassword,req.body.confirmPassword);
      }
    }

    else {
      res.render("personalinfo", { customer: req.session.signed_customer });
    }
  }

}




const customerml = async (req, res) => {

  console.log("recieve request");
  const customer = await customers.findById(req.params.id);

  if (!customer.verified) {
    customer.verified = true;
    await customers.findByIdAndUpdate(customer.id, customer);
    req.session.signed_customer = customer;
  }

  res.redirect('/');

}

const customeraddr = async (req, res) => {
  if (req.session.signed_customer === null || req.session.signed_customer === undefined) {
    res.render("sign-in", { alert: true, text: "you must sign in to access addreses " });
  } else {
    res.render("addressinfo", { user: req.session.signed_customer });
  }
}


const customerfav = async (req, res) => {
  res.render('favoriteinfo');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//customer sockets connections 
const addmsg = async (customer, msg) => {
  const obj = { "msg": msg, issent: true };
  await customer.chat.push(obj);
  const newobj = await customer.chat;

  console.log("in adding ");
  customer.chat = newobj;

  await customers.findOneAndReplace({ Email: customer.Email }, customer);

  return customer;
}


const addmsgfromadmin = async (customer, msg) => {
  const obj = { "msg": msg, issent: false };
  await customer.chat.push(obj);
  const newobj = await customer.chat;

  console.log("in adding ");
  customer.chat = newobj;

  await customers.findOneAndReplace({ Email: customer.Email }, customer);

  return customer;
}
const getmsgs = async (req,res) => {
 const ch=await customers.findById(req.params.id)
 .then(async (o)=>{
  return o.chat;
 })

 res.json(ch);
}
export { addmsg, getcustomers, postcustomers, customerpr, customeror, customerml, customeraddr, customerfav, addmsgfromadmin, customerchnagepass , getmsgs};
