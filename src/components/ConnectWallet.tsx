/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const ConnectWallet = ({ setCurrentAccount }) => {



    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Please install MetaMask!');
                return;
            } 

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts' 
            }) as string[];
            console.log("Connected: "+ accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button onClick={connectWallet}>Connect Wallet</button>
    );
};

export default ConnectWallet;