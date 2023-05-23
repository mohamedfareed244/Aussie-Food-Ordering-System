// Description:
// This file is the entry point for the application.
// It sets up an HTTP server, connects to MongoDB,
// and listens for connections on the specified port.

// Module dependencies
import app from "../app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";
import twilio from "twilio";
import readline from "readline"
import nodemailer from "nodemailer"
dotenv.config();

// async function sendsms(){

//   const trans=nodemailer.createTransport({service:'gmail',
// auth:{
//   user:"mohamedfareed429@gmail.com",
//   pass:"subvkcitoy99ppvfdmfa"
// }});
// const options={
//   from:"mohamedfareed429@gmail.com",
//   to:"mohamedfareed443@gmail.com",
//   subject:"testing",
//   text:"hello this is a text "
// }
// trans.sendMail(options,function (err,info){
//   if(err){
//     console.log("there are an error "+err)
//   }else{
//     console.log(info);
//   }
// })

//   Your AccountSID and Auth Token from console.twilio.com
// const accountSid = process.env.myacc;
// const authToken = process.env.mytoken;

// const client = new twilio(accountSid, authToken);

// client.messages
//   .create({
//     body: 'this is a testda',
//     to: '+201281414369',
//     from:'+17817767522'// From a valid Twilio number
//   })
//   .then((message) => console.log(message));
// }

// Get port from environment variable or default to 8000
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "127.0.0.1";

// Get MongoDB connection URI from environment variable 
const MURI = process.env.MURI;

// Create HTTP server.
const server = createServer(app);

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
    console.log("start the process of sending message ");
   
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

export default mongoose;