//add to menu page cart 
        async function add_to_cart(id){
            console.log(id);

            let obj= await get_item(id);
            console.log(obj);
            console.log(obj.path)
            //check if the item exists before or not 
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
let parent=document.getElementById("cart_body");

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

    
    
       

async function playsound(){
 let audio=  await new Audio("/Users/user/Downloads/Message notification.m4r");
        audio.play();
}
      async function get_item(id){
       
        let data;
        console.log(`the    http://127.0.0.1:3000/${id}`);
        let item= await fetch(`http://127.0.0.1:3000/products/getitem/${id}`,{method:'GET'}).then( function (response){
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
  
  
  
//add items to the cart at checkout page 
    async function inc_qty(id,price){
        let data =await get_item(id);
        console.log("start perocessing ");

console.log("theee data areeee "+data);
let num =parseInt(document.getElementsByClassName("in_span")[data].innerHTML);
num++;
document.getElementsByClassName("in_span")[data].innerHTML=num;
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
//add items to the cart at checkout page 
//del items from the cart at checkout page 
async function get_the2(id){
    let data;
   
    let item= await fetch(`http://127.0.0.1:3000/products/cartdel/${id}`,{method:'GET'}).then( function (response){
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



    async function dec_qty(id,price){
        //function send to backend api to decrease quantity of this item 
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
    //del items from the cart at checkout page 
  

function dis(){
    console.log("started");
    const item=document.getElementById("shows");
  
    if(item.style.display==="none"){
        console.log("started1");
        item.style.display="block";
    }else{
        item.style.display="none";
    }
}
