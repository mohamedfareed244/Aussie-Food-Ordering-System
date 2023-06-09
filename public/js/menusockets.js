document.getElementById("alylert").style.display= "none";

var socket = io();
socket.on('connect', () => {
  console.log("socket id " + socket.id);
})

var form = document.getElementById("form");
var input = document.getElementById("input");

socket.on('recieve message', async (msg) => {
  console.log("i recived message with ", msg);
  sou1();
})

socket.on('recieve order', async (msg) => {
  displayalert("You have recieved a new order");
  console.log("recieve", msg);
  sou();

})
socket.on("require signin", () => {
  location.href = '/employees/signin';
})
socket.on("newcustomer", async (msg) => {
  displayalert("New customer connected to chat ");
  sou1();
  console.log("i recieve ", msg.customer.Firstname);
})
socket.on("getmessage", async (msg) => {
  console.log("msg from ", msg.from);
  displayalert(`You have recieved new message `);
  sou1();
})
async function displayalert(text) {
  document.getElementById("alylert").style.display="block";
  document.getElementById("almsg").innerHTML = `${text}`
 setTimeout(hidealert,3000);

}
async function hidealert() {
  document.getElementById("alylert").style.display= "none";

}
async function sou() {

  let audio = document.getElementById("audio");
  audio.play().catch((err) => {
    console.log(err);
  })

}
async function sou1() {

  let audio = document.getElementById("audio1");
  audio.play().catch((err) => {
    console.log(err);
  })

}