












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
        async function add_to_cart(id){
            console.log(id);

            let obj= await get_item(id);
            console.log(obj);
            console.log(obj.path)
            if(obj.path!=undefined){
                console.log("i entered ");
let node=document.createElement("div");
node.className="art";
let node1=document.createElement("img");
node1.src=obj.path;
console.log(node1.src);
node1.className="item_img";
let node2=document.createElement("span");
node2.className="s1";
let node3=document.createElement("b");
node3.innerHTML="item name : ";
node2.appendChild(node3);
let item_name=obj.name;
node2.innerHTML+=item_name;
let node4=document.createElement("br");
let node5=document.createElement("span");
node5.className="s2";
let node6=document.createElement("b");
node6.innerHTML="Price : ";
node5.appendChild(node6);
let node7=document.createElement("b");
node7.innerHTML="1";
node7.className="qty1";
node5.appendChild(node7);
node6.innerHTML+= `${obj.price} $ Qty : `;
node.appendChild(node1);
node.appendChild(node2);
node.appendChild(node4);
node.appendChild(node5);
let parent=document.getElementsByClassName("cc")[0];

parent.appendChild(node);
let number=parseInt( document.getElementById("notification").innerHTML);
number++;
document.getElementById("notification").innerHTML=number;
            }
             else{
              let g= document.getElementsByClassName("qty1")[obj].innerHTML;
              let num=parseInt(g);
              num++; 
              document.getElementsByClassName("qty1")[obj].innerHTML=num;
              let number=parseInt( document.getElementById("notification").innerHTML);
number++;
document.getElementById("notification").innerHTML=number;
            }
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

async function playsound(){
 let audio=  await new Audio("/Users/user/Downloads/Message notification.m4r");
        audio.play();
}
      async function get_item(id){
       
        let data;
        console.log(`the    http://127.0.0.1:3000/${id}`);
        let item= await fetch(`http://127.0.0.1:3000/${id}`,{method:'GET'}).then( function (response){
           data=response.json();
         console.log("the data "+data);
          return data;
        
      }
        ).then(function(data){
            console.log("step 2 : "+data);
           
      })
        console.log("step 3 : "+data);
        return data;
      
      
      
      
    }
    async function get_cart_items(){
        let data;
       
        let item= await fetch(`http://127.0.0.1:3000/getcart_items`,{method:'GET'}).then( function (response){
           data=response.json();
         console.log("the is "+data);
          return data;
        
      }
        ).then(function(data){
            console.log(data);
           
      })
        return data;
    }
    async function get_the(id){
        let data;
       
        let item= await fetch(`http://127.0.0.1:3000/add/item/${id}`,{method:'GET'}).then( function (response){
           data=response.json();
         console.log("the is "+response);
          return data;
        
      }
        ).then(function(result){
            console.log(result);
            data =result;
            return result;
           
      })
        return data;
    }
    async function get_the2(id){
        let data;
       
        let item= await fetch(`http://127.0.0.1:3000/del/item/${id}`,{method:'GET'}).then( function (response){
           data=response.json();
         console.log("the is "+response);
          return data;
        
      }
        ).then(function(result){
            console.log(result);
            data =result;
            return result;
           
      })
        return data;
    }

    async function inc_qty(id,price){
        let data =await get_the(id);
        console.log("start perocessing ");

console.log("theee data areeee "+data);
let num =parseInt(document.getElementsByClassName("in_span")[data.num].innerHTML);
num++;
document.getElementsByClassName("in_span")[data.num].innerHTML=num;
let curr_sum=parseInt(document.getElementById("table_item_number").innerHTML);
console.log(curr_sum);
curr_sum++;
let f=parseInt(document.getElementById("table_price").innerHTML);
f+=price;
document.getElementById("table_price").innerHTML= f;
document.getElementById("table_item_number").innerHTML=curr_sum;
document.getElementById("table_tax").innerHTML=Math.round((f/100)*14);
document.getElementById("table_total").innerHTML=Math.round((f/100)*14)+f;
    }
    async function dec_qty(id,price){
        let data =await get_the2(id);
        console.log("start perocessing ");


let num =parseInt(document.getElementsByClassName("in_span")[data.num].innerHTML);
num--;
if(num!=0){
document.getElementsByClassName("in_span")[data.num].innerHTML=num;
}else{
    const elements = document.getElementsByClassName("art");
    
        elements[data.num].parentNode.removeChild(elements[data.num]);
    
    
}
let curr_sum=parseInt(document.getElementById("table_item_number").innerHTML);
console.log(curr_sum);
curr_sum--;
let f=parseInt(document.getElementById("table_price").innerHTML);
f-=price;
document.getElementById("table_price").innerHTML= f;
document.getElementById("table_item_number").innerHTML=curr_sum;
document.getElementById("table_tax").innerHTML=Math.round((f/100)*14);
document.getElementById("table_total").innerHTML=Math.round((f/100)*14)+f;
    }
  


