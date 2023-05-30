// Description:
// This file is the entry point for the application.
// It sets up an HTTP server, connects to MongoDB,
// and listens for connections on the specified port.

// Module dependencies
import {customers} from "../models/customers.js"
import {Server} from 'socket.io';
import {app, findforchat} from "../app.js";
import {find_soc} from "../app.js";
import {chg_customersock} from "../app.js";
import ios from "express-socket.io-session";
import {chg_sock} from "../app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";
import {sessionMiddleware} from "../app.js"
import session from "express-session"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Session } from 'inspector';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Get port from environment variable or default to 8000
const PORT = process.env.PORT || "3001";
const HOST = process.env.HOST || "127.0.0.1";

// Get MongoDB connection URI from environment variable 
const MURI = process.env.MURI;

// Create HTTP server.
const server = createServer(app);

//create Socket 
const io= new Server(server);
// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

let connected_sockets=new Array();
let connected_customers=new Array();
io.on('connection',async (socket) => {
  const from=socket.handshake.headers.referer;
  const sess=socket.request.session;
if(from==="http://127.0.0.1:3001/"||from==="http://127.0.0.1:3001"){
await connected_customers.push(socket);
console.log("customer detected ");
sess.connected_emp= await findforchat(sess.signed_customer,socket.id);
if(sess.connected_emp===null){
  io.to(socket.id).emit('cantfind_emp');

}else{
await chg_customersock(sess.signed_customer,socket.id);

io.to(socket.id).emit('connects_emp',sess.connected_emp);
}
}else{
  await connected_sockets.push(socket);
  await chg_sock(sess.employee,socket.id);
}
  console.log('a user connected '+socket.id);
  console.log("the id in socket is : "+sess);

  socket.on('disconnect', () => {
    if(from==="http://127.0.0.1:3001/"||from==="http://127.0.0.1:3001"){
      for(let i=0;i<connected_customers.length;i++){
        if(connected_customers[i]===socket){
          connected_customers.splice(i,1);
          break;
        }
      }
    }else{
    for(let i=0;i<connected_sockets.length;i++){
      if(connected_sockets[i]===socket){
        connected_sockets.splice(i,1);
        break;
      }
    }
  }
    console.log('user disconnected');

  });
socket.on('sendmsgtoemp',async(msg)=>{
const cust=sess.signed_customer;
const emp=sess.connected_emp;
const chats=cust.chat;
const obj={"msg":msg.text,"issent":true};
await chats.push(obj);
await customers.findByIdAndUpdate(cust.id,{chat:chats}).then(async (re)=>{
  let index;
let socid;

do{
 await find_soc(emp).then((res)=>{
  socid=res;
 });
 console.log("the id is : "+socid);
 await getsoc(socid).then((res)=>{
  index =res;
 });
console.log("the index is : "+index);
console.log("in while loop ");
}while(index==-1);
io.to(socid).emit("recieve message",{"body":msg.text,"name":cust.Firstname,"phone":cust.Phone});

})
})
});




// Connect to DB and start the server
async function startServer() {
  try {
    console.log(MURI)
    await mongoose.connect(`${MURI}`);
    console.log("Connected to MongoDB");
    server.listen(PORT);
    server.on("error", onError);
    server.on("listening", onListening);
    console.log(`Server running at http://${HOST}:${PORT}/`);
  } catch (error) {
    console.error("Mongo Error: " + error);
  }
}

startServer();

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = `Port ${PORT}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const { port } = server.address();
  console.log(`Listening on Port ${port}`);
}


//recieve order for employees 
async function getsoc(id){
  for (let i=0;i<connected_sockets.length;i++){
    if(connected_sockets[i].id===id){
      return i;
    }
  }
  return -1;
}
async function rec_order(emp,order){
let index;
let socid;

do{
  console.log("in : ",emp);
console.log(emp.Password);
 await find_soc(emp).then((res)=>{
  socid=res;
 });
 console.log("the id is : "+socid);
 await getsoc(socid).then((res)=>{
  index =res;
 });
console.log("the index is : "+index);
console.log("in while loop ");
}while(index==-1);
io.to(socid).emit("recieve order",order);
}

export{mongoose,rec_order};