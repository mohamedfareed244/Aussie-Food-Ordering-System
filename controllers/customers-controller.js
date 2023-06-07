import { customers } from "../models/customers.js";
import { orders } from "../models/orders.js";
import { io } from "../bin/www.js";
import nodemailer from "nodemailer"
import ejs from "ejs"
import validator from 'validator';
import { All } from "../models/schema.js";

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
    
  });
  const options = {
    from: "AussieFood",
    to: User.Email,
    subject: "mail confirmation",
    html: data

  }
  trans.sendMail(options, function (err, info) {
    if (err) {
      console.log("there are an error " + err)
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
  if (req.session.signed_customer === null || req.session.signed_customer === undefined) {
    res.render("sign-in", { alert: true, text: "you must sign in to access profile " });
  }else{
    const x=await orders.find({customermail:req.session.signed_customer.Email});
  res.render("customer_orders",{orders:x});
  }
}

const customerchnagepass = async (req, res) => {

  if (req.session.signed_customer === undefined || req.session.signed_customer === null) {
    res.render("sign-in", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.signed_customer;
    if (curr.Password == req.body.currentpassword) {
      if (req.body.password == req.body.confirmPassword) {
        curr.Password = req.body.password;

        await customers.findOneAndReplace({ Email: curr.Email }, curr);
        console.log("password changed ");

        res.render("personalinfo", { customer: req.session.signed_customer });
      }
      else {
        console.log(req.body.password, req.body.confirmPassword);
      }
    }

    else {
      res.render("personalinfo", { customer: req.session.signed_customer });
    }
  }

}
const customerlogout = async (req, res) => {
req.session.signed_customer= null;
res.redirect('/');
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
    // const x=await orders.find({customermail:req.session.signed_customer.Email});
    res.render("addressinfo", { user: req.session.signed_customer });
  }
}


const customerfav = async (req, res) => {
  if(req.session.signed_customer===null||req.session.signed_customer===undefined){
    res.render("sign-in",{alert:true,text:"You should sign in first to access favourites "})
  }else{
    const obj=req.session.signed_customer.favorites;
    let a=new Array();
    for(let i=0;i<obj.length;i++){
      const g=await All.findById(obj[i].itemId);
a.push(g);
    }
  res.render('favoriteinfo',{items:a});
  }
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
const getmsgs = async (req, res) => {
  console.log("now fetching the messages ");
  const ch = await customers.findById(req.params.id)
    .then(async (o) => {
      return o.chat;
    })
  console.log(" the message will be json to the custojer is ", ch);
  res.json(ch);
}
//////////////////////////////////////////////////////////
const addadr = async (req, res) => {
if(req.session.signed_customer===null||req.session.signed_customer===undefined){
  res.render("sign-in",{alert:true,text:"You should login firstly to add new address"});
}else{
  const addr={
    location:req.body.location,
    Adress:req.body.Adress,
    apartment:req.body.apartment,
    floor:req.body.floor,
    Building:req.body.Building
  }
  const curr=req.session.signed_customer;
  const newobj=curr.addreses;
  newobj.push(addr);
  curr.addreses=newobj;
  await customers.findOneAndUpdate({_id:curr._id},{$push:{addreses:addr}});
  req.session.signed_customer= await customers.findById(curr._id);
 
  res.redirect("/customers/profile/addr");
}
}
const deladr = async (req, res) => {
  if(req.session.signed_customer===null||req.session.signed_customer===undefined){
    res.render("sign-in",{alert:true,text:"You should login firstly to add new address"});
  }else{
  await customers.updateOne({_id:req.session.signed_customer._id},{ $pull: { addreses: { _id: req.params.id } } });
  req.session.signed_customer=await customers.findById(req.session.signed_customer._id);
  res.redirect("/customers/profile/addr");

  }
  }
  const confirml = async (req,res) => {
    let order = await orders.findById(req.params.id);
    const trans = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "aussiefood6@gmail.com",
        pass: "gqhnpwicffirkdhn"
      }
    });
    let data;
    let sums=0;
    for(let i=0;i<order.items.length;i++){
      sums+=order.items[i].price*order.items[i].Qty;
    }
    ejs.renderFile("/Users/user/Desktop/web_back2 /views/order-confirm-mail.ejs", { ord:order , sum:sums}, (err, d) => {
      data = d;
      console.log(d);
    });
    const options = {
      from: "aussiefood6@gmail.com",
      to: order.customermail,
      subject: "order confirmation",
      html: data
  
    }
    trans.sendMail(options, async function (err, info) {
      if (err) {
        console.log("there are an error " + err)
      } else{
        await orders.findByIdAndUpdate(order._id,{status:"Delivered"}).then((o)=>{
         res.json({type:true});
        })
     }
     
    })

    }
    const disconfirml = async (req, res) => {
      let order = await orders.findById(req.params.id);
      const trans = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "aussiefood6@gmail.com",
          pass: "gqhnpwicffirkdhn"
        }
      });
      let data;
      let sums=0;
      for(let i=0;i<order.items.length;i++){
        sums+=order.items[i].price*order.items[i].Qty;
      }
      ejs.renderFile("/Users/user/Desktop/web_back2 /views/order-disconfirm-mail.ejs", { ord:order , sum:sums}, (err, d) => {
        data = d;
        console.log(d);
      });
      const options = {
        from: "aussiefood6@gmail.com",
        to: order.customermail,
        subject: "order cancellation",
        html: data
    
      }
      trans.sendMail(options, async function (err, info) {
        if (err) {
          console.log("there are an error " + err)
        } else{
           await orders.findByIdAndUpdate(order._id,{status:"Cancelled"}).then((o)=>{
            res.json({type:true});
           })
        }
       
        
      })
      }
      async function addfav(req,res){
        if(req.session.signed_customer===null||req.session.signed_customer===undefined){
          res.json({added:false});
        }else{
    
          await customers.findOneAndUpdate({_id:req.session.signed_customer._id},{$push:{favorites:{itemId:req.params.id}}});
          req.session.signed_customer= await customers.findById(req.session.signed_customer._id);
          res.json({added:true});
        }
      }
      async function remfav(req,res){
        if(req.session.signed_customer===null||req.session.signed_customer===undefined){
          res.json({removed:false});
        }else{
    
          await customers.findOneAndUpdate({_id:req.session.signed_customer._id},{$pull:{favorites:{itemId:req.params.id}}});
          req.session.signed_customer= await customers.findById(req.session.signed_customer._id);
          res.json({removed:true});
        }
      }
      async function remfavpro(req,res){
        if(req.session.signed_customer===null||req.session.signed_customer===undefined){
          res.render("sign-in",{alert:true,text:"you have to sign in first to make this action "})
        }else{
    
          await customers.findOneAndUpdate({_id:req.session.signed_customer._id},{$pull:{favorites:{itemId:req.params.id}}});
          req.session.signed_customer= await customers.findById(req.session.signed_customer._id);
          const obj=req.session.signed_customer.favorites;
          let a=new Array();
          for(let i=0;i<obj.length;i++){
            const g=await All.findById(obj[i].itemId);
      a.push(g);
          }
          res.render("favoriteinfo",{items:a});
        }
      }
export { addmsg, getcustomers, postcustomers, customerpr, customeror, customerml, customeraddr, customerfav, addmsgfromadmin, customerchnagepass, getmsgs ,addadr,deladr,confirml,disconfirml,addfav,remfav,remfavpro , customerlogout};

