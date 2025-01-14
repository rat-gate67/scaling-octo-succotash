/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from '../components/Header';
import ConnectWallet from '../components/ConnectWallet';
import SetTimestamp from '../components/SetTimestamp';
import GetTimestamp from '../components/GetTimestamp';
import Footer from '../components/Footer';

import abi from "./utils/FileTimestamp.json";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    const contractAddress = "0x021D117574E8e0682CB65B9BE4EB059a30BdE5f9";
    const contractABI = abi.abi;

    const getContract = async () => {
        if (!currentAccount) return;

        try {
            const { ethereum } = window as any;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress, 
                    contractABI, 
                    signer);
                setContract(contract);
            } else {
                console.error("Ethereum object doesn't exist!");
                setContract(null);
            }
        } catch (error) {
            console.error("Error fetching contract:", error);
            setContract(null);
        }
    }; 

    useEffect(() => {
        getContract();
    }, [currentAccount]);

    return (
        <div>
            <Header />
            <ConnectWallet setCurrentAccount={setCurrentAccount} />
            {currentAccount && (
                <div>
                    <p> Current Account: {currentAccount?.toString()}</p>
                </div>
            )}
            <SetTimestamp contract={contract} />
            <GetTimestamp contract={contract} />

            <Footer />
        </div>
    );
};

export default App;