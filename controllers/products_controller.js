
//import database models 
import { All } from "../models/schema.js";
import { Sec } from "../models/menu_sections.js";
import { orders } from "../models/orders.js";
import { findfororder,__dirname } from "../app.js";
import { rec_order } from "../bin/www.js";
import path from "path"
import fs from "fs"
//end import models 







//get section items by section name 
const getsection = async (req, res, next) => {
  
  let it = await Sec.findOne({ name: req.params.sec_name });
  let sections_data = await Sec.find();


  let section_items = new Array();
  for (let i = 0; i < it.items.length; i++) {
    let d = await All.findById(it.items[i].id);
    section_items.push(d);
  }
  let number = 0;
  if (req.session.cart_items != undefined) {
    for (let i = 0; i < req.session.cart_items.length; i++) { number += req.session.cart_items[i].qty; }
  }
  console.log(req.rawHeaders[15]);
  res.render("menu", {
    men: ("menu|" + req.params.sec_name), num: number, sections: sections_data, browse: section_items
    , s: (req.session.cart_items === undefined ? new Array() : req.session.cart_items),
    current_user: req.session.signed_customer == undefined ? null : req.session.signed_customer
  });

};






//function to add items to the cart 
async function addto_sess_cart(req, id) {
  let found = false;
  if (req.session.cart_items === undefined) {
    req.session.cart_items = new Array();

  } else {
    for (let i = 0; i < req.session.cart_items.length; i++) {
      if (req.session.cart_items[i].item._id == id) {
        req.session.cart_items[i].qty++;

        found = true;
        return i;
        //means that the item has been founded at the cart so its qty will increase i is the index 
      }

    }
  }

  if (!found) {

    let d = await All.findById(id);
    let obj = { "item": d, "qty": 1 };
    //create new object with the item require and push it to the cart 
    req.session.cart_items.push(obj);

    return d;
  }
}
const getitembyid = async (req, res, next) => {


  let index = await addto_sess_cart(req, req.params.id);


  console.log(typeof (index));
  if (!typeof (index) === Object) {

    let f = { "num": index };

    res.json(f);
  }
  else { res.json(index); }

};

// delete an item from the cart by id 

const delitem = async (req, res) => {
  let index;
  for (let i = 0; i < req.session.cart_items.length; i++) {

    if (req.session.cart_items[i].item._id == req.params.id) {
      index = i;
      req.session.cart_items[i].qty--;
      if (req.session.cart_items[i].qty == 0) {
        req.session.cart_items.splice(i, 1);
      }
    }
  }
  let g = { "num": index };

  res.json(g);
}

//check out function 

const check_out = async (req, res) => {
  if (req.session.signed_customer === undefined || req.session.signed_customer === null) {
    res.redirect("/customers/signin");
  }
  if (req.session.cart_items === null || req.session.cart_items === undefined) {
    res.redirect("/products/All");
  } else {
    if (req.session.cart_items.length == 0) {
      res.redirect("/products/All");
    }
  }
  const obj = { num: 0, confirm: false };
  res.render("check_out", { cart: req.session.cart_items, user: req.session.signed_customer, ord: obj });
}
//make order 
const new_order = async (req, res) => {
  let voucher=req.session.voucher;
  if(voucher===undefined){
    voucher="none";
  }
  const current_cart = req.session.cart_items;
  const current_customer = req.session.signed_customer;
  let emp;
  await findfororder().then((res) => {

    emp = res;
  })
  if (emp === null) {
    res.json({ done: false });
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  let numbers = await orders.find({ customerphone: current_customer.Phone }).then((result) => {
    if (result !== null && result !== undefined) {
      return result.length;
    }
  })
  numbers++;
  console.log("the address is ",req.body.address);
  let no=req.body.notes;
  if(no.length==0){
    no="no comments";
  }
  const ord = new orders({
    customername: current_customer.Firstname,
    customermail: current_customer.Email,
    customerphone: current_customer.Phone,
    items: new Array(),
    emp_name: emp.Name,
    emp_phone: emp.Phone,
    orderdate: formattedToday,
    status: "Pending",
    Address: req.body.address,
    num: numbers,
    discount:voucher,
    notes:no,
  })
  console.log("stuck");
  for (let i = 0; i < current_cart.length; i++) {

    let obj = { item_name: current_cart[i].item.name, Qty:current_cart[i].qty, price: current_cart[i].item.price };
    ord.items.push(obj);
  }
  await ord.save();

  await rec_order(emp, ord);
  const obj = { num: ord.num, confirm: true };
  req.session.cart_items = new Array();
  res.json(obj);
  // res.render("check_out", { cart: req.session.cart_items, user: req.session.signed_customer, ord: obj });
}






//add section to menu

const postsection = async (req, res) => {

  const obj = {
    name: req.body.name

  }
  const section = new Sec(obj);

  try {
   await section.save();
   
    console.log("saved successfully");
  } catch (err) {
    console.log(err);
  }

}













//add product to menu
const postproduct = async (req, res) => {

  let imgFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.render("error-page");
  }
  console.log("the selected one is ",req.body.section);
 imgFile = req.files.paths;
 console.log(req.files.paths.name);
 uploadPath = __dirname+ '/public/images/' + req.files.paths.name ;

 imgFile.mv(uploadPath,(err)=>{
  
 })
const p="/images/"+req.files.paths.name;

  const obj = {
    name: req.body.name,
    path: p,
    price: req.body.price,
    description: req.body.description,
    section: req.body.section

  }
  const product = new All(obj);




  try {
    await product.save();
    let Id=product._id;
    Id=Id.valueOf();
    let obj={id:Id};
    await Sec.findOneAndUpdate({name:req.body.section},{$push:{items:obj}})
    await Sec.findOneAndUpdate({name:"All"},{$push:{items:obj}})
    console.log("saved successfully");
    res.redirect("/employees/profile/menu/All");
  } catch (err) {
    console.log(err);
  }

}

const getorderdet= async (req, res) => {

 const ord =await orders.findById(req.params.id);
 console.log("the orders founded is ",ord);
 res.json(ord);

}
const searchitems= async (req,res)=>{
  const word=req.body.search;
  await All.find({name:{ "$regex": word, "$options": "i" }}).then(async (o)=>{
    let sections_data = await Sec.find();
    let number = 0;
    if (req.session.cart_items != undefined) {
      for (let i = 0; i < req.session.cart_items.length; i++) { number += req.session.cart_items[i].qty; }
    }
    console.log("the array is ",o);
    res.render("menu", {
      men: ("menu|Search" ), num: number, sections: sections_data, browse: o
      , s: (req.session.cart_items === undefined ? new Array() : req.session.cart_items),
      current_user: req.session.signed_customer == undefined ? null : req.session.signed_customer
    });
  })
}

const getitemforedit=async (req,res)=>{

  const id=req.params.id;
  await All.findById(id).then((o)=>{
    if(o===null){
      res.json(null);
    }else{
res.json(o);
    }
  })
}
async function fileexists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}
const edititem= async (req,res)=>{
const item=await All.findById(req.body.idd);
  let imgFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.render("error-page");
  }
  
 imgFile = req.files.paths;
 console.log(req.files.paths.name);
 uploadPath = __dirname+ '/public/images/' + req.files.paths.name ;
  await fs.unlink(__dirname+ '/public'+item.path,(err)=>{
    if(err){
      console.log(err);
      res.render("error-page")
    }else{
      console.log("item removed");
    }
  });

imgFile.mv(uploadPath,(err)=>{
  
})
item.path="/images/"+req.files.paths.name;
item.name=req.body.itemname;
item.description=req.body.itemdes;
item.price=parseFloat(req.body.itemprice);
await item.save();
res.redirect("/employees/profile/menu/All")
// let fr=new FileReader();
// fr.onload=function(){

// }
}
const deleteitem= async (req,res)=>{
const id =req.params.id;
const item=await All.findById(id);
await Sec.findOneAndUpdate({name:item.section},{$pull:{items:{"id":id}}});
await Sec.findOneAndUpdate({name:"All"},{$pull:{items:{"id":id}}});
await All.findByIdAndDelete(id);
res.redirect("/employees/profile/menu/All");
}
export {
  getsection,
  getitembyid, delitem, check_out, new_order, postsection, postproduct,getorderdet,searchitems,getitemforedit,edititem,deleteitem
};
//formatedv
