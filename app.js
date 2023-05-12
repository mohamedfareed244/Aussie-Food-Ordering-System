import express from "express";
import ejs from "ejs";
import mongoose from "mongoose"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {All} from "./models/schema.js";
import {Sec} from "./models/menu_sections.js";
import { CLIENT_RENEG_LIMIT } from "tls";
import session from "express-session";
//Read the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = "127.0.0.1";
const port = 3000;
const app = express();
app.use(session({ secret: 'Your_Secret_Key' }));

let itemsa =[
    {name:'desserts',
    items:[{id:"645addea49fd0936f566da59"},{id:"645addea49fd0936f566da5a"}]
  } ,
  {name:'frozen',
  items:[{id:"645addea49fd0936f566da5b"},{id:"645addea49fd0936f566da5c"}]
},
{name:'indv_meal',
items:[{id:"645addea49fd0936f566da5d"},{id:"645addea49fd0936f566da5e"},{id:"645addea49fd0936f566da5f"}]
}
 
    ]


async function read(id){
    
   let d=await All.findById(id);
   return d;

}

mongoose.connect("mongodb+srv://mohamed2102759:202102759@cluster0.6cb4ip3.mongodb.net/?retryWrites=true&w=majority")
.then(result => {app.listen(3000, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`Server running at local dirname :  ${__dirname})  `);
 
  });})
.catch(err => {console.log(err);})

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));


app.get('/menu/:sec_name',  async function(req,res){
    let it=await Sec.findOne({name:req.params.sec_name});
    let sections_data= await Sec.find();
// for(let i=0;i<sections_data;i++){
//     console.log("aa");
//     if(sections_data[i].name==req.params.sec_name){
// it=sections_data[i];
// console.log("founded")
// break;
//     }
// }

let section_items=new Array();
for(let i=0;i<it.items.length;i++){
    let d=await All.findById(it.items[i].id);
    section_items.push(d);
}

    res.render("menu",{men:("menu|"+req.params.sec_name),num:(req.session.cart_items===undefined?new Array():req.session.cart_items.length),sections:sections_data,browse:section_items
    ,s:(req.session.cart_items===undefined?new Array():req.session.cart_items)});




// for(let i=0;i<itemsa.length;i++){
//     const all_data=new All(itemsa[i]);
//     all_data.save().then(function(result){
//         
//     })
// }
})

app.get('/menu/:sec_name/:item_id', async function (req,res){
    let it=await Sec.findOne({name:req.params.sec_name});
    let sections_data= await Sec.find();
    let section_items=new Array();
for(let i=0;i<it.items.length;i++){
    let d=await All.findById(it.items[i].id);
    section_items.push(d);
}
if(req.session.cart_items===undefined){
    req.session.cart_items=new Array();
}

let d=await All.findById(req.params.item_id);
console.log(req.params.item_id);
req.session.cart_items.push(d);

res.redirect("/menu/"+req.params.sec_name);
//res.render("menu",{men:("menu|"+req.params.sec_name),s:req.session.cart_items,sections:sections_data,browse:section_items,num:req.session.cart_items.length});

})
app.get('/checkout',function(req,res){
    res.render("check_out",{cart:req.session.cart_items});
})
















