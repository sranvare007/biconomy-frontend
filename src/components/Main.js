import React, { useState } from 'react';
import Quotes from '../contracts/Quotes.json';

import Web3 from 'web3';

function Main() {

    const [account, setAccount] = useState(null);
    const [currentQuote, setCurrentQuote] = useState('');
    const [currentOwner, setCurrentOwner] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [quoteInput, setQuoteInput] = useState('');

    let contract = '';
    let web3 = '';


    const getQuote = async () => {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(Quotes.abi, Quotes.networks[80001].address);
        const message = await contract.methods.getQuote().call();
        setCurrentQuote(message);
        return message;
    }

    const getQuoteOwner = async () => {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(Quotes.abi, Quotes.networks[80001].address);
        const owner = await contract.methods.owner().call();
        setCurrentOwner(owner);
        return owner;
    }

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            await init();
        }
        else {
            alert('Metamask is not installed. Please install Metamask and try again.')
        }
    }

    const init = async () => {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(Quotes.abi, Quotes.networks[80001].address);
        const message = await getQuote();
        const owner = await getQuoteOwner();
        setCurrentQuote(message);
        setCurrentOwner(owner.toUpperCase());
    }

    const sendTransaction = async () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(Quotes.abi, Quotes.networks[80001].address);

        if(web3 && contract && account) {
            if(quoteInput && quoteInput.trim() !== '') {
                const transactionInfo = await contract.methods.setQuote(quoteInput).send({
                    from: account,
                });
                setTransactionHash(transactionInfo.transactionHash);
                alert(`Transaction submitted with the txHash: ${transactionInfo.transactionHash}`)
                setTimeout(() => {
                    getQuote();
                    getQuoteOwner();
                }, 2000)
                setQuoteInput('');
            }
            else {
                alert('Quote should not be empty');
            }
        }
        else {
            console.log(web3);
            console.log(contract);
            console.log(account);
            alert('Metamask account not found!');
        }
        
    }
    
    return (
        <div className={`pt-10 flex flex-col items-center`}>
            <div>
            {
                account ? 
                <p>{account.toUpperCase()}</p> :
                <button onClick={connectWallet} className={`bg-black text-white p-2 rounded hover:bg-opacity-70`}>Connect Wallet</button>
            }
            </div>
            <p>{currentQuote ? `${currentQuote} is owned by: ${currentOwner}` : ''}</p>
            <div className={`flex flex-col mt-6 border border-black p-4 rounded-md`}>
                <input 
                    type='text' 
                    placeholder='Enter you quote...' 
                    className={`border p-2 rounded`}
                    value={quoteInput}
                    onChange={(e) => {
                        setQuoteInput(e.target.value)
                    }} />
                <button 
                    className={`bg-black text-white p-2 rounded hover:bg-opacity-70 mt-4`}
                    onClick={sendTransaction}    
                >Submit Quote</button>
            </div>
            

        </div>
    )
}

export default Main;