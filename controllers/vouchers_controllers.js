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