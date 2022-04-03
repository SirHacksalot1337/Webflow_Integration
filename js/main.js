// main.js

const serverUrl = "https://ilfapq8h4jyq.usemoralis.com:2053/server";
const appId = "C2fy4GQRDTtKZpuTPEElzLXFObQMotGnvt7uFMT2";
const contract = "0xD83AcAe575515B12488d82244cbC59DefcFc2F8c"
const chain = "avalanche testnet"


var amount = 1;
const fee = 2;


Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      await Moralis.enableWeb3();
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
      console.log();
      returnUserNFTData()
   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

async function mint() {
  let options = {
    contractAddress: contract,
    functionName: "mintSurvivor",
    abi:[{
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mintSurvivor",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }],
    params:{
      _amount: amount
    },
    msgValue: Moralis.Units.ETH(fee*amount)
  }
  await Moralis.executeFunction(options);
}


async function returnUserNFTData() {
  const userEthNFTs = await Moralis.Web3API.account.getNFTsForContract({chain:chain, token_address:contract});
  //console.log(userEthNFTs);

  const linkArr = [];


  userEthNFTs.result.forEach(function(nft){
    let url = fixURL(nft.token_uri);
    fetch(url)
    .then(response => response.json())
    .then(data => {
      $("#content").html($("#content").html()+"<h2>"+data.name+"</h2>");
      $("#content").html($("#content").html()+"<h3>"+data.description+"</h3>");
      $("#content").html($("#content").html()+"<img width=100 height=100 src='"+fixURL(data.image)+"'/>");
      linkArr.push(data.image);
    })
  })
  console.log(linkArr);
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

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("btn-mint").onclick = mint;
var slider = document.getElementById("slider-mint");

//amount = slider.value; // Display the default slider value
amount = fee; // Display the default slider value


slider.oninput = function() {
  amount = this.value * fee;
}
