'use client';
import {useEffect} from 'react';

export default function TablesPage() {

    //display data and have save/delete functionality working
    useEffect(() => {
        loadTableData().then();
        window.saveEntry = saveEntry;
        window.deleteEntry = deleteEntry;

        return () => {
            delete window.saveEntry;
            delete window.deleteEntry;
        };
    }, []);

    const loadTableData = async function () {
        const tbody = document.getElementById("customerDataBody");
        if (!tbody) return;
        tbody.innerHTML = ""; //clear table initially

        try {
            const response = await fetch("/waitlist_entries"); //fetch the data
            if (!response.ok) {
                const text = await response.text();
                alert("Server error: " + text);
                return;
            }

            const entries = await response.json();
            //Populating our waitlist entries
            entries.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="p-2" contenteditable="true">${entry.firstName}</td>
                    <td class="p-2" contenteditable="true">${entry.lastName}</td>
                    <td class="p-2" contenteditable="true">${entry.email}</td>
                    <td class="p-2" contenteditable="true">${entry.phoneNumber || ""}</td>
                    <td class="p-2" contenteditable="true">${entry.luckyNumber}</td>
                    <td class="p-2" contenteditable="true">${entry.drinkPersona}</td>
                    <td class="p-2 flex items-center ">
                        <button onclick="saveEntry('${entry._id}', this)">
                            <img src="pencil.png" alt="edit"/> 
                        </button>
                        <button  onclick="deleteEntry('${entry._id}')"> 
                            <img src="trash.png" alt="delete"/> 
                        </button>
                    </td>
    `;
                tbody.appendChild(row); //adding our user data after submitting
            })
        } catch (err) {
            console.error("Could not load entries", err)
        }
    }

    //Deleting a waitlist entry
    async function deleteEntry(id) {
        if (!confirm("Are you sure you want to delete this entry?")) return; //user must confirm whether they want to delete or not

        try {
            const response = await fetch(`/waitlist_entries/${id}`, { //grab id
                method: 'DELETE'
            });

            if (!response.ok) {
                const text = await response.text();
                alert("Failed to remove: " + text);
                return;
            }

            alert("Waitlist Entry removed");
            await loadTableData(); // refresh the table
        } catch (err) {
            console.error("Error removing entry", err);
            alert("could not remove entry.");
        }
    }

    //Saving and updating a waitlist entry
    async function saveEntry(id, btn) {
        const row = btn.closest("tr");
        const tableCells = row.querySelectorAll("td[contenteditable='true']"); //we grab each cell type for editing

        const [firstName, lastName, email, phoneNumber, luckyNumber] = tableCells;

        //our updated data that will go through
        const updatedData = {
            firstName: firstName.textContent.trim(),
            lastName: lastName.textContent.trim(),
            email: email.textContent.trim(),
            phoneNumber: phoneNumber.textContent.trim(),
            luckyNumber: luckyNumber.textContent.trim()
        };

        //Sending it through to database
        try {
            const response = await fetch(`/waitlist_entries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const text = await response.text();
                alert("Failed to save: " + text);
                return;
            }

            alert("Entry updated!");
            await loadTableData(); //updated!!!
        } catch (err) {
            console.error("Error saving entry", err);
            alert("Could not save entry.");
        }
    }

    return (
        <div className="bg-white w-1/2 m-auto pt-10">
            {/* Header */}
            <div className="flex items-center m-auto gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <img id="northstar" src="/northstar.jpg" alt="northstar" className="w-12 h-12"/>
                    <h1 className="font-bold text-2xl">Northstar Cafe</h1>
                </div>
                <a
                    href="/main"
                    className="text-white bg-black p-2 rounded-md hover:bg-offBlack transition"
                >
                    Back to Form
                </a>
            </div>

            <br/>

            {/* Description */}
            <p className="text-[#5E718E]">
                This table displays your entries! <strong>EACH CELL IS EDITABLE</strong>, and to save press
                the pencil icon!
            </p>

            <br/>

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
