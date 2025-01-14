/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ethers } from 'ethers';

interface SetTimestampProps {
    contract: ethers.Contract | null;
}

const SetTimestamp: React.FC<SetTimestampProps> = ({ contract }) => {
    const [file, setFile] = useState<File | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const fileBuffer = await file.arrayBuffer();
        const hash = ethers.keccak256(new Uint8Array(fileBuffer));

        const ts = Date.now();

        try {
            const timestamp = await contract.setTimestamp(hash, ts);
            console.log("Mining transaction...", timestamp);
            await timestamp.wait();
            console.log("Transaction mined!");
            setTimestamp(timestamp.toString());
        } catch (error: any) {
            if (error.reason === "Timestamp already set") {
                console.log("Timestamp already set");
                setTimestamp("Timestamp already set");
                return;
            }

            console.log("Error fetching timestamp:", error);
            setTimestamp(null);
        }
    };

    return (
        <div>
            <h2>Set Timestamp</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Set Timestamp</button>
            </form>
            {timestamp && <p>Timestamp: {timestamp.toString()}</p>}
        </div>
    );
};

export default SetTimestamp;