












function show_rules(){
    console.log('2');
 /*document.getElementById('safety_rules').style='height:30%';*/
document.getElementById('safety_image').style='margin-left:3%; width:50px; height:50px;';
document.getElementById('safety_label').style='font-size:7px; margin-left:3%;';
document.getElementById('Learn_more').style='left:2%; top: 17%;';
document.getElementById('Learn_more').innerHTML="Hide";


document.getElementById('safety_in_rules').style=' margin-left:10%';
document.getElementById("Learn_more").onclick=hide;
} 
function hide(){
    console.log('1');
    document.getElementById('Learn_more').innerHTML="Learn More";

document.getElementById('safety_image').style='margin-left:30%; width:80px; height:80px;';
document.getElementById('safety_label').style='font-size:20px; margin-left:20%;';
document.getElementById('Learn_more').style='left:75%; top: 12%;';
document.getElementById('safety_in_rules').style='margin-left:-150%';
document.getElementById("Learn_more").onclick=show_rules;
}
function turnObjToArray(obj){
    return [].map.call(obj, function(element) {
        return element;
    })
}




function myFunction() {
  document.getElementById("adds_list").classList.toggle("show");
}
function test(){
    let nodes=document.createElement("div");
    nodes.className="menu_items";
    let node1=document.createElement("img");
    node1.src="photos/burger.webp";
    node1.style.width="100%";
    node1.style.height="100%";
    let node2=document.createElement("div");
    node2.className="descr_and_add";
   let node3=document.createElement("img");
   node3.className="favrs";
   node3.src="photos/favourite.png";
  
   let node4=document.createElement("img");
   node4.className="favs";
   node4.src="photos/love.png";
  
   let node5=document.createElement("img");
   node5.className="icons";
   node5.src="photos/add.png";
   let node6=document.createElement("p");
   node6.className="decsription";
   node2.appendChild(node3);
   node2.appendChild(node4);
   node2.appendChild(node5);
   node2.appendChild(node6);

   nodes.appendChild(node1);
   nodes.appendChild(node2);
   document.getElementById("menubody").appendChild(nodes);

   

}

      function favorites(target){

        const x=document.querySelector("#menubody");
            
        if (target.className == "favs") {
            let indexs = document.getElementsByClassName('favs');
            let arr = turnObjToArray(indexs);
            let curr = arr.indexOf(target);
           
            document.getElementsByClassName('favrs')[curr].style = "display:block";
            document.getElementsByClassName('favs')[curr].style = "display:none";
        } else if (target.className == "favrs") {
            let indexs = document.getElementsByClassName('favrs');
            let arr = turnObjToArray(indexs);
            let curr = arr.indexOf(target);
            document.getElementsByClassName('favs')[curr].style = "display:block";
            document.getElementsByClassName('favrs')[curr].style = "display:none";
        } else if(target.className=="icons"){
            let indexs = document.getElementsByClassName('icons');
            let arr = turnObjToArray(indexs);
            let curr = arr.indexOf(target);
            console.log(curr);
        
          add_to_cart(curr);
        

        }

        }
        function add_to_cart(ind){
let node=document.createElement("div");
node.className="art";
let node1=document.createElement("img");
node1.src=document.getElementsByClassName("menu_img")[ind].src;
console.log(node1.src);
node1.className="item_img";
let node2=document.createElement("span");
node2.className="s1";
let node3=document.createElement("b");
node3.innerHTML="item name : ";
node2.appendChild(node3);
let item_name=document.getElementsByClassName("names")[ind].innerHTML;
node2.innerHTML+=item_name;
let node4=document.createElement("br");
let node5=document.createElement("span");
node5.className="s2";
let node6=document.createElement("b");
node5.appendChild(node6);
node6.innerHTML=document.getElementsByClassName("prices")[ind].innerHTML;
node.appendChild(node1);
node.appendChild(node2);
node.appendChild(node4);
node.appendChild(node5);
let parent=document.getElementsByClassName("kk")[0];

parent.appendChild(node);
document.getElementById("notification").innerHTML=document.getElementsByClassName("art").length;
let but=document.createElement("button");
but.id="check_now";
but.innerHTML="CheckOut Now";
let index=parent.childElementCount;
parent.removeChild(parent.children[index-2]);
parent.appendChild(but);
console.log("yes");
        }

        function check_out(target){
            if(target.id=="check_now"){
                location.href='check_out.html';
            }
        }
    
        function submitForm() {
            document.getElementById("addform").submit();
        }


      
