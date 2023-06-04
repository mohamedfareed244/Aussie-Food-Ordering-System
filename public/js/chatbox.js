const popup = document.querySelector('.chat-popup');
const chatBtn = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit');
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('input');






let interv=null;
let socket;
function connectme(){
  socket =io();
socket.on('connect',()=>{
 console.log("socket id "+socket.id);
 document.getElementsByClassName("conversation")[0].scrollTo(0,document.getElementsByClassName("conversation")[0].scrollHeight);
})
socket.on("require signin",()=>{
location.href='/customers/signin';
})
socket.on("cantfind", ()=>{
 
 console.log("cant find")
document.getElementById("spin").innerHTML="wait while we connecting you to agent ";
document.getElementsByClassName("badge")[0].style.display="block";
interv=setTimeout(connectme,10000);
console.log(interv);
})
socket.on("newmessage",(msg)=>{
 sou();
 let text=msg["msg"];
 let node =document.createElement("div");
 node.className="talkleft";
 let node1=document.createElement("p");
 node1.innerHTML=`${text}`;
 node.appendChild(node1);
 document.getElementsByClassName("conversation")[0].appendChild(node);
 document.getElementsByClassName("conversation")[0].scrollTo(0,document.getElementsByClassName("conversation")[0].scrollHeight);
})
socket.on('connects_emp',(emp)=>{
document.getElementById("waiting").style.display="none";
 clearInterval(interv);
 document.getElementById("spin").innerHTML=emp.name;
 sou();
clearInterval(interv);
})
}
function sendmessage(){
 console.log("socket must be = ",socket);
 let msg=document.getElementById("msgbody").value;
 document.getElementById("msgbody").value="";
 let node=document.createElement("div");
 node.className="talkright";
 let node1=document.createElement("p");
 node1.innerHTML=msg;
 node.appendChild(node1);
 document.getElementsByClassName("conversation")[0].appendChild(node);
 console.log("the value us ",msg);
 socket.emit("sendtoadmin",({"body":msg}));
 document.getElementsByClassName("conversation")[0].scrollTo(0,document.getElementsByClassName("conversation")[0].scrollHeight);
}



async function sou(){

 let audio = document.getElementById("audio");
audio.play().catch((err)=>{
 console.log(err);
})

}

chatBtn.addEventListener('click', ()=>{
    popup.classList.toggle('show');
    connectme();
})




