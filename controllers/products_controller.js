
//import database models 
import {All} from "../models/schema.js";
import {Sec} from "../models/menu_sections.js";
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
console.log("the number will be sent is "+number);
    res.render("menu",{men:("menu|"+req.params.sec_name),num:number,sections:sections_data,browse:section_items
    ,s:(req.session.cart_items===undefined?new Array():req.session.cart_items)});
  
  };




//get item by id to add to cart 

//function to add items to the cart 
  async function addto_sess_cart(req,id){
    let found=false;
  if(req.session.cart_items===undefined){
    req.session.cart_items=new Array();

  }else{
    for(let i=0;i<req.session.cart_items.length;i++){
        if(req.session.cart_items[i].item._id==id){
            req.session.cart_items[i].qty++;
            console.log(req.session.cart_items[i]);
            found=true;
            return i;
            //means that the item has been founded at the cart so its qty will increase i is the index 
        }
        
    }
  }

if(!found){
    console.log("enter the not found case ")
    let d= await All.findById(id);
    let obj={"item":d,"qty":1};
   //create new object with the item require and push it to the cart 
    req.session.cart_items.push(obj);
   
return d;
}
}
  const getitembyid= async (req, res, next) => {
    console.log(req.params.id)

    let index=await addto_sess_cart(req,req.params.id);
 
    console.log("i recieve "+index);
    console.log(typeof(index));
    if(!typeof(index)===Object){
        console.log("start redirection to number page ");
        let f={"num":index};
        
        res.json(f);
    }
    else{ res.json(index); }
  
  };

// delete an item from the cart by id 

const delitem=async (req,res)=>{
    let index;
    for(let i=0;i<req.session.cart_items.length;i++){
        console.log("start searching ");
        if(req.session.cart_items[i].item._id==req.params.id){
index=i;
req.session.cart_items[i].qty--;
if(req.session.cart_items[i].qty==0){
    req.session.cart_items.splice(i,1);
}
        }
    }
    let g={"num":index};
    console.log(" i will repsonse with "+g.num);
   res.json(g);
}

//check out function 

const check_out=async (req,res)=>{
    res.render("check_out",{cart:req.session.cart_items});
}
  export {getsection,
  getitembyid,delitem,check_out};