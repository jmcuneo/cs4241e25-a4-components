const next = require('next');
const express = require("express");
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();

//Next.js runs a little differently, but it is easier. All we had to do was wrap everything around the framework and boom
nextApp.prepare().then(() => {
    const {MongoClient, ServerApiVersion} = require('mongodb');
    const express = require("express");
    const {ObjectId} = require('mongodb');
    const cookie = require('cookie-session')
    const app = express();
    require('dotenv').config();

    //Start using the cookies
    app.use(cookie({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    //MIDDLEWARE for our account access situation
    app.use(function (req, res, next) {
        //based on the structure of the middleware, css will not go thru bc express.static('public') is after. we need to whitelist some files
        if (req.session.login === true || req.path.startsWith('/css') || req.path.startsWith('/'))
            next()
        else
            res.redirect('/')
    })

    // serve up static files in the directory public,
    app.use(express.static('public'))
    app.use(express.json());
    app.use(express.urlencoded({extended: true})) //this to get data from default form action



    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const uri = process.env.MONGODB_API_KEY;
    console.log("Connecting", uri);
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    //Initialize tables
    let collection = null;
    let usersCollection = null;

    //Run MongoDB
    async function run() {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ping: 1});
            collection = client.db("a3-ChrisLam").collection("waitlist_entries");
            usersCollection = client.db('a3-ChrisLam').collection("user");

            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            app.listen(process.env.PORT || 3000)
        } catch (err) {
            console.log("MongoDB has an connection error:", err);
        }
    }

    run().catch(console.dir);

    //taken from using.cookies.md from Joshua Cuneo
    app.post('/login', async (req, res) => {
        try {
            const {username, password} = req.body;
            if (!usersCollection) {
                console.log("User Collection not found")
                return res.status(500).json({error: "No user collection found"});
            }

            //Find the user in db that the person entered in the input fields
            const user = await usersCollection.findOne({username});
            console.log("User found:", user)

            //If the user does not exist, create a new account based on the field they entered for user
            if (!user) {
                const newUser = {username, password};
                const insertUser = await usersCollection.insertOne(newUser);
                console.log("Created new user:", newUser);

                //Tell the new user they got a new account and go to main.html
                req.session.login = true;
                req.session.userId = result.insertedId.toString();
                req.session.username = username;

                //it technically doesn't get here, but the logic is already in catch
                return res.status(201).json({success: true, message: "Account created!", redirect: "/main"});
            }

            //Password and Username Check
            if (user && user.password === password) {
                console.log("Logged in Successfully");
                req.session.login = true;
                req.session.userId = user._id.toString();
                console.log("Session:", req.session)

                return res.status(200).json({success: true, message: "Login successful", redirect: "/main"
                });
            } else { //failed password check
                return res.status(401).json({success: false, message: "Wrong username or password"
                });
            }
        }
            //The username is not found, this is redirect
        catch (err) {
            return res.status(500).json({success: false,
                message: "Account not found. Created a new one for you!"
            });        }
    })

    //Log out
    app.get('/logout', (req, res) => {
        req.session = {};
        res.redirect('/');
    });

    //Get Request
    app.get('/waitlist_entries', async (req, res) => {
        try {
            if (!collection) {
                return res.status(500).json({error: "No collection found"});
            }

            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({error: "Not logged in"});
            }

            const entries = await collection.find({userId}).toArray();
            res.status(200).json(entries);
        } catch (err) {
            console.error("Error getting waitlist entries");
            res.status(500).json({err: "Error getting entries"});
        }
    })


    //Post Request
    app.post('/waitlist_entries', async (req, res) => {
        console.log("POST /waitlist_entries received:", req.body);
        try {
            if (!collection) {
                return res.status(500).json({error: "No collection found"});
            }

            collection = client.db("a3-ChrisLam").collection("waitlist_entries"); //grab our collection of entries
            const userId = req.session.userId;
            const newEntry = req.body;
            newEntry.userId = userId
            newEntry.drinkPersona = assignDrinkPersona(newEntry.firstName); //assign the drink persona

            console.log(newEntry);
            const result = await collection.insertOne(newEntry); //add to waitlist_entries
            console.log("new entry went thru");
            res.status(201).json({status: "success", insertedId: result.insertedId});
        } catch (err) {
            console.error("Error inserting entry");
            res.status(500).json({error: "Error inserting entry"});
        }

    });

    //Delete a waitlist entry by its entry id
    app.delete('/waitlist_entries/:id', async (req, res) => {
        const {id} = req.params;

        try {
            const entryId = new ObjectId(id);
            const entry = await collection.deleteOne({_id: entryId});
            if (entry.deletedCount === 1) {
                res.status(200).json({status: 'success', id}); //successful removal
            } else {
                res.status(404).json({error: 'Entry not found'});
            }
        } catch (err) {
            console.error("Error removing entry", err.message);
            res.status(500).json({error: 'Error removing entry'});
        }
    })

    //Save or update new waitlist entry
    app.put('/waitlist_entries/:id', async (req, res) => {
        const {id} = req.params;
        const updatedData = req.body;

        try {
            updatedData.drinkPersona = assignDrinkPersona(updatedData.firstName); //update

            //update whole entry in the DB
            const result = await collection.updateOne(
                {_id: new ObjectId(id)},
                {$set: updatedData}
            );

            if (result.matchedCount === 0) {//not found
                return res.status(404).json({error: 'Entry not found'});
            }

            res.status(200).json({status: 'success'});
        } catch (err) {
            console.error("Error updating entry:", err.message);
            res.status(500).json({error: 'Error updating entry'});
        }
    });


    /*
      assignDrinkPersona divides up the alphabet in 4 quadrants. Based on the form entry's first name, it gets assigned a quadrant, and it then becomes their persona.
     */
    function assignDrinkPersona(firstName) {
        const firstChar = firstName?.[0].toUpperCase();
        let persona = "";

        if (firstChar >= 'A' && firstChar <= 'F') persona = "Strawberry Matcha";
        else if (firstChar >= 'G' && firstChar <= 'L') persona = "Brown Sugar Cold Brew";
        else if (firstChar >= 'M' && firstChar <= 'R') persona = "Blueberry Matcha";
        else persona = "Chai Latte";
        return persona;
    }

    //These 2 bits allow the Next.js to render everything we need, similar to our previous html req's, but the frameworks work differently
    app.get('/', (req, res) => {
        return handle(req, res);
    });

    app.all('/{*any}', (req, res) => {
        return handle(req, res);
    });
})






