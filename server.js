import express from 'express'
import ViteExpress from 'vite-express'
import cookieSession from 'cookie-session'
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express();

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// enable cookies
const cookie = cookieSession({
    name: 'session',
    keys: ['tempKey1', 'tempKey2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
})

app.use(cookie);

// app.use(express.static('public'))
// app.use(express.static('src'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath))

// for connecting to MongoDB database
const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@${process.env.MDB_HOST}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("a3").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        // Ensures that the client will close when you finish/error
        // await client.close();
        console.log("Error: Could not connect to MongoDB!");
    }
}
run().catch(console.dir);

// variables to store info for tracking user sessions
let currUser = "";
let newUser = false;

// how to handle user's attempt to login
app.post ('/api/login', async (req, res) => {
    let dataString = ""

    // parse data
    req.on( "data", function( data ) {
        dataString += data
    })

    req.on( "end", async function() {
        const data = JSON.parse(dataString);
        // console.log(data)

        // get user collection and pull all entries with the username the user entered
        const users = await client.db("a3").collection("users"),
            user = await users.find({username: data.username}).toArray();
        //console.log(user)

        // handle various cases
        if (user.length === 0) { // if the array is empty then there is not an existing user with that username
            currUser = data.username;
            newUser = true;
            req.session.login = true;

            // create new user account with the username and password entered by adding it to database and then redirect to main app page
            client.db("a3").collection("users").insertOne({username: data.username, password: data.password})
            .then(result => {
                console.log(result);
                res.json("success")
            }) .catch(error => {
                console.error(error);
                res.json("Creation Failure")
            })
        } else if (user.length === 1) { // if there is one object in array, then user exists in database
            if (user[0].password === data.password) { // if the password matches the entered password, then successfully log user in and redirect to main page
                currUser = data.username;
                req.session.login = true;
                res.json("success")
            } else { // if password doesn't match, send error to login page and be ready for user to try again
                req.session.login = false;
                res.json("Incorrect password")
            }
        } else { // if there are more than 1 user with the same username return error and allow user to try logging in again (this should not happen and would likely be the result of a glitch)
            console.error('Error: Multiple users with the same username');
            res.json("Login Failed")
        }
    })
})

// variables for data manipulation
let collection
let comps
let nextID = 4; // track what the next entry ID will be

// when user submits form that manipulates data handle it here
app.post ('/api/submit', (req, res) => {
    let dataString = ""

    req.on( "data", function( data ) {
        dataString += data
    })

    req.on( "end", async function() {
        const data = JSON.parse( dataString )
        //console.log( data )

        // ... do something with the data here!!!
        if ( data.compInfo && data.level && data.vaultScore && data.barScore && data.beamScore && data.floorScore ) {
            // add new entry or update entry
            const totalScore = Number(data.vaultScore) + Number(data.barScore) + Number(data.beamScore) + Number(data.floorScore)
            data.totalScore = `${Math.round(totalScore * 1000) / 1000}`

            if ( data.id ) { // if there is an ID, update the corresponding information
                //console.log(data)
                const result = await collection.updateOne({user:currUser, id: data.id}, {$set:{compInfo:data.compInfo, level:data.level, vaultScore:data.vaultScore, barScore:data.barScore, beamScore:data.beamScore, floorScore:data.floorScore, totalScore:data.totalScore}})
                console.log(result)
            } else { // if no existing ID, add new data entry
                let finalData = {"user": currUser, "id": `${nextID}`, ...data}
                await collection.insertOne(finalData)

                nextID += 1;
            }

            comps = await collection.find({user: currUser}).toArray()
            res.json(comps)
        } else if ( Number(data) < nextID) {
            // if there is only an ID number, and it is less than the next ID number, delete corresponding data entry
            const delRes = await collection.deleteOne({id: data})
            console.log(delRes)

            nextID -= 1;

            // renumber other entries so that the display does not have missing data entry numbers
            for (let i = Number(data); i < nextID; i++) {
                let updateRes = await collection.updateOne({user:currUser, id:`${i+1}`}, {$set:{id:`${i}`}})
                console.log(updateRes)
            }

            comps = await collection.find({user: currUser}).toArray()
            res.json(comps)
        } else {
            // if none of the three known actions, throw error
            res.writeHead( 400, "Bad Request", {"Content-Type": "text/plain"} )
            res.end( "400 Error: Bad Request" )
        }
    })
})

// when main page is first loaded, send data attached to the logged-in user or tell front-end java that there is no data because the user is new
app.get('/api/loadData', async (req, res) => {
    if (newUser === true) {
        res.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        res.end(JSON.stringify("new"))
    } else {
        collection = await client.db("a3").collection("competitions")
        comps = await collection.find({user: currUser}).toArray()
        nextID = comps.length + 1;
        res.json(comps)
    }
})

// check login status (for front-end redirects)
app.get('/api/checkLogin', (req, res) => {
    const loggedIn = (req.session.login === true)
    res.json({loggedIn})
})

app.get('/', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})

// // when user tries to go to website, send logged-in users to main page and non-logged in users to login page
// app.get('/', (req, res) => {
//     if(req.session.login === true) {
//         res.redirect('/app.html');
//     } else {
//         res.redirect('/login.html');
//     }
// })
//
// // another catch to ensure user is logged in before accessing main page with data
// app.use(function(req, res, next) {
//     if( req.session.login === true )
//         next()
//     else
//         res.redirect('/login.html')
// })
//
// // path to main page
// app.get('/app.html', (req, res) => {
//     res.sendFile(__dirname + 'src/app.html')
// })


app.listen(3000, () => {
    console.log('Sever listening on port 3000')
})
//ViteExpress.listen( app, 3000 )