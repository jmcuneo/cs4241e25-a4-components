/*
* Name: login
* Input: onClick event
* Output: N/A
* Purpose: Collect data for user login, send it to server, switch window if login successful or display corresponding error on login page
*/
const login = async function (event) {
    event.preventDefault();

    // get username and password from form and prepare it to be sent to server
    const form = document.getElementById('login'),
        username = document.getElementById('username').value,
        password = document.getElementById('password').value,
        json = {username: username, password: password},
        body = JSON.stringify(json)

    // send data to server
    const response = await fetch("/login", {
        method: 'POST',
        body
    })

    // wait for response and parse it when it comes in
    const result = await response.text()

    const message = JSON.parse(result);
    console.log(message)

    if (message === "success") { // if message says success, redirect user to main page
        window.location.href="/app.html"
    } else if (message === "Creation Failure") { // if message says creation failure, inform user new account not created and encourage them to try again
        const parent = document.getElementById('message');
        const note = document.createElement('p');
        note.textContent = "Account creation failed! Please try again."
        parent.appendChild(note)
    } else if (message === "Incorrect password") { // if message says incorrect password, inform user that password is incorrect and encourage them to try again
        const parent = document.getElementById('message');
        const note = document.createElement('p');
        note.textContent = "Incorrect Password! Login Failed. Please try again."
        parent.appendChild(note)
    } else if (message === "Login Failed") { // if message is general failure, inform user and encourage them to try again
        const parent = document.getElementById('message');
        const note = document.createElement('p');
        note.textContent = "Login failed! Please try again."
        parent.appendChild(note)
    }

    // clear form to prepare for next attempt
    form.reset()
}

window.onload = function () {
    // listen for submit on login form and call login when clicked
    const loginSubmit = document.querySelector('#loginSubmit');
    loginSubmit.onclick = login;
}