// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    console.log("submit handler called");
    event.preventDefault()
    console.log("event pd called")

    //each data entry goes through this object
    const data = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        email: document.querySelector("#email").value,
        luckyNumber: document.querySelector("#luckyNumber").value,
        phoneNumber: document.querySelector("#phoneNumber").value
    };

    const body = JSON.stringify(data)
    console.log("data collected");

    //Fetch for submitting button
    //this is needed; IDE says no, but we need
    const response = await fetch( "/waitlist_entries", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    //Alert to the user and for us on debugging
    alert(`Thank you! You've been added to the waitlist. As part of our personas for a free drink, you are a ${assignDrinkPersona(data.firstName)}!!! Please keep a lookout for our messages! `);
    document.getElementById("ourForm").reset();
}

//This is similar to the server one, just a little different based on the needs
function assignDrinkPersona(firstName) {
    const firstChar = firstName[0].toUpperCase();
    if (firstChar >= 'A' && firstChar <= 'F') return "Strawberry Matcha";
    else if (firstChar >= 'G' && firstChar <= 'L') return "Brown Sugar Cold Brew";
    else if (firstChar >= 'M' && firstChar <= 'R') return "Blueberry Matcha";
    else return "Chai Latte";
}

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
    }
    catch (err) {
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

//needed listeners
window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#ourForm");
    if (form) {
        form.addEventListener("submit", submit);
    }
    loadTableData().then();
});

