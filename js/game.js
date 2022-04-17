// main.js

//const { default: Moralis } = require("moralis/types");

const serverUrl = "https://ilfapq8h4jyq.usemoralis.com:2053/server";
const appId = "C2fy4GQRDTtKZpuTPEElzLXFObQMotGnvt7uFMT2";
const contract = "0xd203058935aa3Bac85AA4a6abF5732c5d0ebf74D"
const chain = "avalanche testnet"


var amount = 1;
const fee = 2;

const linkArr = [];



Moralis.start({ serverUrl, appId });
async function cashedSession(){
  let user = Moralis.User.current();
  if (user) {
    try {
      console.log(user)
      console.log(user.get('ethAddress'))
      console.log();
      returnUserNFTData();
   } catch(error) {
     console.log(error)
   }
  }
}



async function returnUserNFTData() {
  const userEthNFTs = await Moralis.Web3API.account.getNFTsForContract({chain:chain, token_address:contract});
  //console.log(userEthNFTs);

  var items = 0;

  userEthNFTs.result.forEach(function(nft){
    let url = fixURL(nft.token_uri);
    fetch(url)
    .then(response => response.json())
    .then(data => {
      $("#content").html($("#content").html()+"<h2>"+data.name+"</h2>");
      $("#content").html($("#content").html()+"<h3>"+data.description+"</h3>");
      $("#content").html($("#content").html()+"<img width=100 height=100 src='"+fixURL(data.image)+"'/>");
      linkArr.push(data.image);
      items++;
      console.log(items);
      console.log(userEthNFTs.result.length);
      if(items === userEthNFTs.result.length){
        buildImage();
        console.log(linkArr);
      }
    })
  })
}

function fixURL(url){
  if(url.startsWith("https://gateway")){
    console.log("https://ipfs.moralis.io:2053/ipfs/"+url.split("https://gateway.moralisipfs.com/ipfs/").slice(-1))
    return "https://ipfs.moralis.io:2053/ipfs/"+url.split("https://gateway.moralisipfs.com/ipfs/").slice(-1);
  }
  else{
    return url+"?format=json";
  }
}

async function buildImage() {
  console.log("building images")
  var id = 0;
  for (const image of linkArr) {
    console.log(image);
    img = document.createElement('img');
    img.setAttribute("id", id);
    img.setAttribute("class","img");
    img.src = image;
    document.getElementById('survivor_list').appendChild(img);
    img.onclick = mark(id++);
  }
}


function mark(imgId) {
  element = document.getElementById(imgId)
  element.setAttribute("class", "imgSelected");
  element.onclick = unmark(imgId);
}

function unmark(imgId) {
  element = document.getElementById(imgId)
  element.setAttribute("class", "img");
  element.onclick = mark(imgId);
}



cashedSession();