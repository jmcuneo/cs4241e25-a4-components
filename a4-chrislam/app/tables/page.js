'use client';
import "@/app/globals.css"

import { useEffect } from 'react';

export default function TablesPage() {
    useEffect(() => {
        // Optional: Load table data from a source or initialize client-side logic
        // You can copy your original main.js logic here if needed
    }, []);

    return (
        <div className="bg-white w-1/2 m-auto pt-10">
            {/* Header */}
            <div className="flex items-center m-auto gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <img id="northstar" src="/northstar.jpg" alt="northstar" className="w-12 h-12" />
                    <h1 className="font-bold text-2xl">Northstar Cafe</h1>
                </div>
                <a
                    href="/main"
                    className="text-white bg-black p-2 rounded-md hover:bg-offBlack transition"
                >
                    Back to Form
                </a>
            </div>

            <br />

            {/* Description */}
            <p className="text-[#5E718E]">
                This table displays your entries! <strong>EACH CELL IS EDITABLE</strong>, and to save press
                the pencil icon!
            </p>

            <br />

            {/* Data Table */}
            <table className="bg-[#FCFCFC] border border-[#ECEBEB] rounded-xl p-1 w-full">
                <thead>
                <tr>
                    <th className="text-left text-[0.9rem] p-2">First Name</th>
                    <th className="text-left text-[0.9rem] p-2">Last Name</th>
                    <th className="text-left text-[0.9rem] p-2">Email</th>
                    <th className="text-left text-[0.9rem] p-2">Phone #</th>
                    <th className="text-left text-[0.9rem] p-2">Lucky #</th>
                    <th className="text-left text-[0.9rem] p-2">They are a...</th>
                    <th className="text-left text-[0.9rem] p-2 px-6">Modify</th>
                </tr>
                </thead>
                <tbody id="customerDataBody"></tbody>
            </table>
        </div>
    );
}
