
//import database models 
import {All} from "../models/schema.js";
import {Sec} from "../models/menu_sections.js";
import {orders} from "../models/orders.js";
import {findfororder} from "../app.js";
import {rec_order} from "../bin/www.js";
//end import models 







//get section items by section name 
const getsection = async (req, res, next) => {
    let it=await Sec.findOne({name:req.params.sec_name});
    let sections_data= await Sec.find();


let section_items=new Array();
for(let i=0;i<it.items.length;i++){
    let d=await All.findById(it.items[i].id);
    section_items.push(d);
}
let number=0;
if(req.session.cart_items!=undefined){
for(let i=0;i<req.session.cart_items.length;i++){ number+=req.session.cart_items[i].qty;}
}
console.log(req.rawHeaders[15]);
    res.render("menu",{men:("menu|"+req.params.sec_name),num:number,sections:sections_data,browse:section_items
    ,s:(req.session.cart_items===undefined?new Array():req.session.cart_items),
    current_user:req.session.signed_customer==undefined?null:req.session.signed_customer});
  
  };




 

//function to add items to the cart 
  async function addto_sess_cart(req,id){
    let found=false;
  if(req.session.cart_items===undefined){
    req.session.cart_items=new Array();

  }else{
    for(let i=0;i<req.session.cart_items.length;i++){
        if(req.session.cart_items[i].item._id==id){
            req.session.cart_items[i].qty++;
           
            found=true;
            return i;
            //means that the item has been founded at the cart so its qty will increase i is the index 
        }
        
    }
  }

if(!found){
   
    let d= await All.findById(id);
    let obj={"item":d,"qty":1};
   //create new object with the item require and push it to the cart 
    req.session.cart_items.push(obj);
   
return d;
}
}
  const getitembyid= async (req, res, next) => {
   

    let index=await addto_sess_cart(req,req.params.id);
 

    console.log(typeof(index));
    if(!typeof(index)===Object){
       
        let f={"num":index};
        
        res.json(f);
    }
    else{ res.json(index); }
  
  };

// delete an item from the cart by id 

const delitem=async (req,res)=>{
    let index;
    for(let i=0;i<req.session.cart_items.length;i++){
      
        if(req.session.cart_items[i].item._id==req.params.id){
index=i;
req.session.cart_items[i].qty--;
if(req.session.cart_items[i].qty==0){
    req.session.cart_items.splice(i,1);
}
        }
    }
    let g={"num":index};

   res.json(g);
}

//check out function 

const check_out=async (req,res)=>{
  if(req.session.signed_customer===undefined||req.session.signed_customer===null){
    res.redirect("/customers/signin");
  }
  if(req.session.cart_items===null||req.session.cart_items===undefined){
    res.redirect("/products/All");
  }else{
    if(req.session.cart_items.length==0){
      res.redirect("/products/All");
    }
  }
  const obj={num:0,confirm:false};
    res.render("check_out",{cart:req.session.cart_items,user:req.session.signed_customer,ord:obj});
}
//make order 
const new_order=async (req,res)=>{
  const current_cart=req.session.cart_items;
  const current_customer=req.session.signed_customer;
  let emp;
  await findfororder().then((res)=>{
    
    emp=res;
  })
  if(emp===null){
    res.json({done:false});
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; 
  let dd = today.getDate();
  
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  
  const formattedToday = dd + '/' + mm + '/' + yyyy;
let numbers= await orders.find({customerphone:current_customer.Phone}).then((result)=>{
  if(result!==null&&result!==undefined){
  return result.length;
  }
})
numbers++;
 const ord=new orders({
  customername:current_customer.Firstname,
  customermail:current_customer.Email,
  customerphone:current_customer.Phone,
items:new Array(),
emp_name:emp.Name,
emp_phone:emp.Phone,
orderdate:formattedToday,
status:"Pending",
Addressid:"req.body.obj",
num:numbers,
 })
 console.log("stuck");
 for(let i=0;i<current_cart.length;i++){

  let obj={item_name:current_cart[i].item.name,Qty:0,price:current_cart[i].item.price};
  ord.items.push(obj);
 }
 await ord.save();

await rec_order(emp,ord);
const obj={num:ord.num,confirm:true};
req.session.cart_items=new Array();
res.render("check_out",{cart:req.session.cart_items,user:req.session.signed_customer,ord:obj});
}






//add section to menu

const postsection = async (req, res)=> {
   
  const obj={Name:req.body.Name
 
  }
      const section=new Sec(obj);
  
  try{
  await section.save();
  console.log("saved successfully");
  }catch(err){
  console.log(err);
  }

}


//add product to menu
const postproduct = async (req, res)=> {
   
  const obj={name:req.body.Name,
 path:req.body.path,
  price:req.body.price,
 description:req.body.description,
 section:req.body.section

  }
      const product=new All(obj);
  
  try{
  await product.save();
  console.log("saved successfully");
  }catch(err){
  console.log(err);
  }

}




  export {getsection,
  getitembyid,delitem,check_out,new_order,postsection,postproduct};