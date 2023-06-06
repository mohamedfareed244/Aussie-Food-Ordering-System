import {voucher} from "../models/vouchers.js"

const generatefor = async (req,res)=>{
const id=req.body.userId;

const user= await voucher.findOne({mongoid:id});
if(user!==null){
    const obj ={code:null,Added:false};
    res.json(obj);
}else{
const arr= await voucher.find();
const num=arr.length;
num++;
const Code="dskjf-"+num.toString();//dskjf-13
const newuser={
value:10,
code:Code,
mongoid:id,
used:false,
}
const Save=new voucher(newuser);
await Save.save();
const obj ={code:Code,Added:true};
res.json(obj);
}


}


const apply = async (req,res)=>{
    console.log("i recieve ",req.body);
    const user=await voucher.findOne({code:req.body.code});
    if(user!==null){
        let finded;
        try {
            await fetch("https://dsk-jf.onrender.com/api", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id:user.mongoid
              }),
            })
            .then(async (o)=>{
        return o.json();
            }).then((o)=>{
                console.log("fareed returned with ",o);
             if(!o.found){
                res.json({applied:false});
             }else{
                req.session.voucher=req.body.code;
                res.json({applied:true});
             }
            })
        
          } catch (err) {
            console.log(err);
          }

    }else{
        res.json({applied:false});
    }
  
    
    
    
    }
export {generatefor,apply}