// Description:
// This file is the entry point for the application.
// It sets up an HTTP server, connects to MongoDB,
// and listens for connections on the specified port.

// Module dependencies
import { addmsg, addmsgfromadmin } from "../controllers/customers-controller.js"
import { Server } from 'socket.io';
import {
  addemp, app, findforchat, add_customer, chg_custsock, getmyemp
  , remove_customer, repcust, find_customer_socket
} from "../app.js";
import { find_soc, remove_emp } from "../app.js";
import { customers } from "../models/customers.js"
import ios from "express-socket.io-session";
import { chg_sock } from "../app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import https from "https"
import dotenv from "dotenv";
import { sessionMiddleware } from "../app.js"
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


//create https server
// /etc/letsencrypt/live/aussiefood.store/privkey.pem private key path on server 
// /etc/letsencrypt/live/aussiefood.store/fullchain.pem certificate path on server 
const privatekey=fs.readFileSync("./ssl/key.pem",'utf-8');
const certificate =fs.readFileSync("./ssl/certificate.pem",'utf-8');
const credentials={
  key:privatekey,
  cert:certificate,
}


// Create HTTPS server.https. credentials
const server = https.createServer(credentials,app);

//create Socket 
const io = new Server(server);
// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

let connected_sockets = new Array();
let connected_customers = new Array();
io.on('connection', async (socket) => {
  const sess = socket.request.session;
  const from = socket.handshake.headers.referer;
  console.log("from ", from);
  if (from === "https://aussiefood.store/" || from === "https://aussiefood.store") {
    console.log("customer detected ");
    if (socket.request.session.signed_customer !== null && socket.request.session.signed_customer !== undefined) {
      console.log("not null")
      await connected_customers.push(socket);
      let finded;
      await add_customer(sess.signed_customer).then((res) => {
        finded = res;
        console.log("finded = ", finded);
      })
      if (!finded) {
        io.to(socket.id).emit("cantfind", {});
      } else {
        await chg_custsock(sess.signed_customer, socket.id).then(async () => {
          await getmyemp(sess.signed_customer).then((o) => {
            console.log("get my emp returned with ", o);
            io.to(o.soc).emit("newcustomer", { "customer": sess.signed_customer });
            io.to(socket.id).emit("connects_emp", { "name": o.name });
          })
        })
      }

    } else {
      console.log("not sogned in")
      io.to(socket.id).emit("require signin", {});
    }

  } else {
    if (sess.employee === null || sess.employee === undefined) {
      io.to(socket.id).emit("require signin", {});
    } else {
      await connected_sockets.push(socket);
      await chg_sock(sess.employee, socket.id);
    }
  }
  console.log('a user connected ' + socket.id);

  socket.on('disconnect', async () => {
    if (from === "https://aussiefood.store/" || from === "https://aussiefood.store") {
      for (let i = 0; i < connected_customers.length; i++) {
        if (connected_customers[i] === socket) {
          connected_customers.splice(i, 1);
          break;
        }
      }
      if (sess.signed_customer !== null && sess.signed_customer !== undefined) {
        let v = await remove_customer(sess.signed_customer);
        if (v !== null) {
          console.log("sending to admin ",v)
          io.to(v).emit("cust_disconnect", { "user": sess.signed_customer });
        }
      }
    }
    else {

      for (let i = 0; i < connected_sockets.length; i++) {
        if (connected_sockets[i] === socket) {
          connected_sockets.splice(i, 1);
          break;
        }
      }

    }
    console.log('user disconnected');
  });
  socket.on('sendtocustomer', async (msg) => {
    console.log("the admin emitted done ", msg.id)
    let user;
    await find_customer_socket(msg.id).then(async (o) => {
      console.log("the user returned is ", o);
      user = o.customer;
      sess.signed_customer = o.customer;
      await addmsgfromadmin(o.customer, msg.body).then((b) => {
        console.log("i will emit to socket ", o.soc);
        io.to(o.soc).emit("newmessage", { "msg": msg.body });
      })
    })


  })
  socket.on("diconnme", async () => {
    socket.disconnect();
  })
  socket.on("sendtoadmin", async (msg) => {
    console.log("now i will add")
    await addmsg(sess.signed_customer, msg.body).then(async (c) => {
      console.log("add msg : ", c);
      sess.signed_customer = c;
      await getmyemp(sess.signed_customer).then(async (o) => {
        await repcust(sess.signed_customer);
        const ff = sess.signed_customer.Firstname + " " + sess.signed_customer.Middlename;
        io.to(o.soc).emit("getmessage", { "from": { "name": ff, "phone": sess.signed_customer.Phone, "id": sess.signed_customer.id }, "body": msg.body });
      })
    })
  })

});




// Connect to DB and start the server
async function startServer() {
  try {
    console.log(MURI)
    await mongoose.connect(`${MURI}`);
    console.log("Connected to MongoDB");
    server.listen(PORT, "0.0.0.0");
    server.on("error", onError);
    server.on("listening", onListening);
    console.log(`Server running at https://${HOST}:${PORT}/`);

  } catch (error) {
    console.error("Mongo Error: " + error);
  }
}

startServer();
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
async function onListening() {
  const { port } = server.address();
  console.log(`Listening on Port ${port}`);

  
}


//recieve order for employees 
async function getsoc(id) {
  for (let i = 0; i < connected_sockets.length; i++) {
    if (connected_sockets[i].id === id) {
      return i;
    }
  }
  return -1;
}

async function rec_order(emp, order) {
  let index;
  let socid;

  do {
    console.log("in : ", emp);
    console.log(emp.Password);
    await find_soc(emp).then((res) => {
      socid = res;
    });
    console.log("the id is : " + socid);
    await getsoc(socid).then((res) => {
      index = res;
    });
    console.log("the index is : " + index);
    console.log("in while loop ");
  } while (index == -1);

  io.to(socid).emit("recieve order", order);
}

export { mongoose, rec_order, io };
//formated
