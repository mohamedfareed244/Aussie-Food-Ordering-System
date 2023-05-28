// Description:
// This file is the entry point for the application.
// It sets up an HTTP server, connects to MongoDB,
// and listens for connections on the specified port.

// Module dependencies
import {Server} from 'socket.io';
import {app} from "../app.js";
import {chg_sock} from "../app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";
import twilio from "twilio";
import readline from "readline"
import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Get port from environment variable or default to 8000
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "127.0.0.1";

// Get MongoDB connection URI from environment variable 
const MURI = process.env.MURI;

// Create HTTP server.
const server = createServer(app);

//create Socket 
const io= new Server(server);


//aliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii

// import {Server} from 'socket.io';
// const io =new Server(server);
// // import io from 'socket.io-client';
// app.set('io', io);
// // let socketConnected=new set()


// io.on('connection',onConnected)
// function onConnected(socket){
//   console.log(socket.id)
// }
const curr_emp=null;
function set_emp(emp){
  curr_emp=emp;
}
io.on('connection', (socket) => {
  
  console.log('a user connected '+socket.id);
  chg_sock(curr_emp,socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
   io.to(socket.id).emit('rec mess',"hello ya alby ");
  });
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

export { mongoose,set_emp};