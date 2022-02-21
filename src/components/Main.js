import React, { useState, useEffect } from 'react';
import Quotes from '../contracts/Quotes.json';
import {Biconomy} from "@biconomy/mexa";
import { ethers } from "ethers";



import Web3 from 'web3';

let web3;
let ethersProvider;
let biconomy;
let provider;
let contract;
let daiToken;
let ercForwarderClient;
let permitClient;

let daiDomainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];
  
  let daiPermitType = [
    { name: "holder", type: "address" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "expiry", type: "uint256" },
    { name: "allowed", type: "bool" },
  ];

  const config = {
    dai: {
        address: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
        abi: [{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
    }
  };
  
  let daiDomainData = {
    name: "Dai Stablecoin",
    version: "1",
    chainId: 42,
    verifyingContract: config.dai.address,
  };

function Main() {

  const [quote, setQuote] = useState("This is a default quote");
  const [owner, setOwner] = useState("Default Owner Address");
  const [newQuote, setNewQuote] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [metaTxEnabled, setMetaTxEnabled] = useState(true);
  const [transactionHash, setTransactionHash] = useState("");


  useEffect(() => {
    async function init() {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      ) {
        // Ethereum user detected. You can now use the provider.
          provider = window["ethereum"];
          await provider.enable();
          biconomy = new Biconomy(provider,{apiKey: "_OOqEikTt.908d7444-a0a1-4db6-9387-290141395dc0", debug: true});
          web3 = new Web3(biconomy);
          ethersProvider = new ethers.providers.Web3Provider(biconomy);
          
          console.log(web3);

         
          //contract should have been registered on the dashboard as ERC20_FORWARDER
          contract = new web3.eth.Contract(
            Quotes.abi,
            Quotes.networks["42"].address
          );

          daiToken = new web3.eth.Contract(
            config.dai.abi,
            config.dai.address
          );


          biconomy.onEvent(biconomy.READY, () => {
            // Initialize your dapp here like getting user accounts etc
            ercForwarderClient = biconomy.erc20ForwarderClient;
            permitClient = biconomy.permitClient;
            console.log(contract);
            setSelectedAddress(provider.selectedAddress);
            getQuoteFromNetwork();
            provider.on("accountsChanged", function(accounts) {
              setSelectedAddress(accounts[0]);
            });
          }).onEvent(biconomy.ERROR, (error, message) => {
            // Handle error while initializing mexa
            console.log(`Error: ${error}`)
          });


      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    init();
  }, []);

  const onQuoteChange = event => {
    setNewQuote(event.target.value);
  };

  const onPermitAndSubmitEIP712 = async event => {
    if (newQuote != "" && contract) {
      setTransactionHash("");
      if (metaTxEnabled) {
          const daiPermitOptions = {
            spender: "0xCB3F801C91DEcaaE9b08b1eDb915F9677D8fdB4A", //ERC20 Forwarder address on Kovan testnet
            expiry: Math.floor(Date.now() / 1000 + 3600),
            allowed: true
          };

          let userAddress = selectedAddress;
          let functionSignature = contract.methods.setQuote(newQuote).encodeABI();
          console.log(functionSignature);
 
      
        console.log("Sending meta transaction");
        showInfoMessage("Building transaction to forward");
        // txGas should be calculated and passed here or calculate within the method
        let gasLimit = await contract.methods
        .setQuote(newQuote)
        .estimateGas({ from: userAddress });

        const builtTx = await ercForwarderClient.buildTx({
          to: Quotes.networks["42"].address,
          token: biconomy.daiTokenAddress,
          txGas: Number(gasLimit),
          data: functionSignature,
          permitType : "DAI_Permit"
        });

        debugger;

        const tx = builtTx.request;
        const fee = builtTx.cost; // only gets the cost of target method call
        console.log(tx);
        console.log(fee);
        alert(`You will be charged ${fee} amount of DAI ${biconomy.daiTokenAddress} for this transaction`);
        showInfoMessage(`Signing message for meta transaction`);

        const nonce = await daiToken.methods.nonces(userAddress).call();
        console.log(`nonce is : ${nonce}`);

        //Signing typed data, user is able to view the message they are signing
        const permitDataToSign = {
          types: {
            EIP712Domain: daiDomainType,
            Permit: daiPermitType,
          },
          domain: daiDomainData, //Prevent replay attacks
          primaryType: "Permit",
          message: {
            holder: userAddress,
            spender: daiPermitOptions.spender,
            nonce: parseInt(nonce),
            expiry: parseInt(daiPermitOptions.expiry),
            allowed: daiPermitOptions.allowed,
          },
        };

        let result = await ethersProvider.send("eth_signTypedData_v4", [
          userAddress,
          JSON.stringify(permitDataToSign),
        ]);

        console.log(result);
          
        let metaInfo = {};
        let permitOptions = {};

        
        console.log("success:" + result);
        const signature = result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);

        permitOptions.holder = userAddress;
        permitOptions.spender = daiPermitOptions.spender;
        permitOptions.value = 0; //in case of DAI passing dummy value for the sake of struct (similar to token address in EIP2771)
        permitOptions.nonce = parseInt(nonce.toString());
        permitOptions.expiry = parseInt(daiPermitOptions.expiry);
        permitOptions.allowed = daiPermitOptions.allowed;
        permitOptions.v = v;
        permitOptions.r = r;
        permitOptions.s = s;

        metaInfo.permitType = "DAI_Permit";
        metaInfo.permitData = permitOptions;
      
        //signature of this method is sendTxEIP712({req, signature = null, userAddress, metaInfo})
        let transaction = await ercForwarderClient.permitAndSendTxEIP712({req:tx, metaInfo: metaInfo});

        //returns an object containing code, log, message, txHash 
        console.log(transaction);
        if(transaction && transaction.txHash) {
          const receipt = await fetchMinedTransactionReceipt(transaction.txHash);
          if(receipt)
          {
            console.log(receipt);
            setTransactionHash(receipt.transactionHash);
            showSuccessMessage("Transaction confirmed on chain");
            getQuoteFromNetwork();
          }
        } else {
          showErrorMessage(transaction.message);
        }
      }
      else {
        console.log("Sending normal transaction");
        contract.methods
          .setQuote(newQuote)
          .send({ from: selectedAddress })
          .on("transactionHash", function(hash) {
            showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
          })
          .once("confirmation", function(confirmationNumber, receipt) {
            setTransactionHash(receipt.transactionHash);
            showSuccessMessage("Transaction confirmed");
            getQuoteFromNetwork();
          });
      }
    }
      else {
        showErrorMessage("Please enter the quote");
      }
  };

  const fetchMinedTransactionReceipt = (transactionHash) => {
    return new Promise((resolve, reject) => {

      var timer = setInterval(()=> {
        web3.eth.getTransactionReceipt(transactionHash, (err, receipt)=> {
          if(!err && receipt){
            clearInterval(timer);
            resolve(receipt);
          }
        });
      }, 3000)
     
    })
  }

  const showErrorMessage = message => {
    console.error(message, "Error", 5000);
  };

  const showSuccessMessage = message => {
    console.log(message, "Message", 3000);
  };

  const showInfoMessage = message => {
    console.log(message, "Info", 3000);
  };

  const getQuoteFromNetwork = () => {
    if (web3 && contract) {
      contract.methods
        .quote()
        .call()
        .then(function(result) {
          console.log(result);
          if (
            result
          ) {
            if (result == "") {
              showErrorMessage("No quotes set on blockchain yet");
            } else {
              setQuote(result);
            }
          } else {
            showErrorMessage("Not able to get quote information from Network");
          }
        });

      contract.methods
        .owner()
        .call()
        .then(function(result) {
          console.log(result);
          if (
            result
          ) {
            if (result == "") {
              showErrorMessage("No owner set on blockchain yet");
            } else {
              setOwner(result);
            }
          } else {
            showErrorMessage("Not able to owner information from Network");
          }
        });
    }
  };

  return (
    <div className={`pt-10 flex flex-col items-center`}>
        <div>
        {
            selectedAddress ? 
            <p>{selectedAddress.toUpperCase()}</p> :
            <button className={`bg-black text-white p-2 rounded hover:bg-opacity-70`}>Connect Wallet</button>
        }
        </div>
        <p>{quote ? `${quote} is owned by: ${owner}` : ''}</p>
        <div className={`flex flex-col mt-6 border border-black p-4 rounded-md`}>
            <input 
                type='text' 
                placeholder='Enter you quote...' 
                className={`border p-2 rounded`}
                value={newQuote}
                onChange={onQuoteChange} />
            <button 
                className={`bg-black text-white p-2 rounded hover:bg-opacity-70 mt-4`}
                onClick={onPermitAndSubmitEIP712}    
            >Submit Quote</button>
        </div>
    </div>
)

}

export default Main;