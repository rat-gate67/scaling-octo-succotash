/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ethers } from 'ethers';

interface GetTimestampProps {
    contract: ethers.Contract | null;
}

const GetTimestamp: React.FC<GetTimestampProps> = ({ contract }) => {
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

        try {
            const timestamp = await contract.getTimestamp(hash);
            setTimestamp(timestamp.toString());
        } catch (error :any) {
            if (error.reason === "Timestamp not set") {
                console.log("Timestamp not set");
                setTimestamp("Timestamp not set");
                return;
            }

            console.error("Error fetching timestamp:", error);
            setTimestamp(null);
        }
    };

    return (
        <div>
            <h2>Get Timestamp</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Get Timestamp</button>
            </form>
            {timestamp && <p>Timestamp: {timestamp}</p>}
        </div>
    );
};

export default GetTimestamp;