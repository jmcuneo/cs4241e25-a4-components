import dotenv from 'dotenv'; // added so that process.env would work
dotenv.config();
import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

const app = express();

app.use( express.static( 'public' ) )
app.use('/assets', express.static(assetsDir));
app.use( express.json() )

app.use(session({
    name: 'session',
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false,
    loggedIn: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    } 
    
  }));

app.use( passport.initialize() )
app.use( passport.session() )
passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})
passport.deserializeUser(function (id, cb) {
    cb(null, id)
})

// middleware for authenticating users
function authenticate(req, res, next) {
    if (req.session.loggedIn === true) {
        next();
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
}

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=a3-Webware`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

let itemCollection;
let usersCollection;
let gitHubUserCollection;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    itemCollection = await client.db("spendingDatabase").collection("collection0")
    usersCollection = await client.db("spendingDatabase").collection("users")
    gitHubUserCollection = await client.db("spendingDatabase").collection("gitHubUser")
    // Send a ping to confirm a successful connection
    await client.db("spendingDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    console.log("Finished connection attempt.");
  }
}
run()

app.use( (req,res,next) => {
    if( itemCollection !== null && usersCollection !== null && gitHubUserCollection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
});

passport.use(new GitHubStrategy({
    clientID: `${process.env.GITHUB_CLIENT_ID}`,
    clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
    callbackURL: "https://a4-estherkim.onrender.com/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}
));

// GitHub Authentication Login Routes
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login.html' }),
  async function (req, res) {
    // Successful authentication, redirect home.
    req.session.loggedIn = true;
    const userExistsCount = await gitHubUserCollection.countDocuments({ githubId: req.user.id });
    if (userExistsCount === 0) {
        await gitHubUserCollection.insertOne({ githubId: req.user.id, username: req.user.username });
    } 
    const currentuser = await gitHubUserCollection.findOne({ githubId: req.user.id });
    req.session.userID = currentuser._id.toString();
    res.redirect('/');
  });

// adding item to database
app.post( "/add", async (req, res) => {
    let insertingItem = req.body;
    insertingItem.date = getDate();
    insertingItem.moneySaved = calcMoneySaved( parseFloat(insertingItem.price), parseFloat(insertingItem.discount) );
    insertingItem.itemUser = req.session.userID;
    const result = await itemCollection.insertOne( insertingItem );
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json( result );
})

app.get( "/login.html", async (req, res) => {
    if (req.session.loggedIn === true) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
})

app.get("/logout", async (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    req.session.loggedIn = false;
    req.session.userId = null;
    res.redirect('/login.html');
    })
})

app.post( "/login.html", async (req, res) => {
    const userExistsCount = await usersCollection.countDocuments({ username: req.body.username, password: req.body.password });
    if (userExistsCount !== 0) {
        req.session.loggedIn = true;
        const currentuser = await usersCollection.findOne({ username: req.body.username, password: req.body.password });
        req.session.userID = currentuser._id.toString();
        res.status(200);
        res.redirect('/index.html');
    } else {
        res.status(401);
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
})

app.get( "/register.html", async (req, res) => {
    if (req.session.loggedIn === true) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'register.html'));
    }
})

app.post( "/register.html", async (req, res) => {
    const userExistsCount = await usersCollection.countDocuments({ username: req.body.username });
    if (userExistsCount === 0 && req.body.username !== null && req.body.username !== "") {
        let insertingUser = req.body;
        const result = await usersCollection.insertOne( insertingUser );
        res.status(200);
        res.redirect('/login.html');
    } else {
        res.status(422);
        res.sendFile(path.join(__dirname, 'public', 'register.html'));
    }
})

app.get( "/index.html", authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.get( "/", authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.get( "/spendinglist.html", authenticate, (req,res) => {
    //res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, 'dist', 'spendinglist.html'));
})

app.get("/obtainData.json", authenticate, async (req, res) => {
    const query = {itemUser: req.session.userID};
    const allItems = await itemCollection.find(query).toArray();
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(allItems);
})

app.get("/edit.html", authenticate, async (req, res) => {
    req.session.editItemID = req.query.itemID;
    res.sendFile(path.join(__dirname, 'dist', 'edit.html'));
})

app.get("/getItem", authenticate, async (req, res) => {
    const query = {_id:new ObjectId( req.session.editItemID )};
    const itemToEdit = await itemCollection.findOne(query);
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(itemToEdit);
})

app.post("/edit.html", authenticate, async (req, res) => {
    let updatingItem = req.body;
    if (updatingItem != undefined) {
        updatingItem.moneySaved = calcMoneySaved( parseFloat(updatingItem.price), parseFloat(updatingItem.discount) );
        const result = await itemCollection.updateOne( 
            { _id: new ObjectId( req.session.editItemID ) },
            { $set:{ item:updatingItem.item, price:updatingItem.price, discount:updatingItem.discount, category:updatingItem.category, note:updatingItem.note, moneySaved: updatingItem.moneySaved } }
        );
        res.redirect('/spendinglist.html');
    }
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.delete("/deleteItem", authenticate, async (req, res) => {
    const result = await itemCollection.deleteOne({ 
        _id:new ObjectId( req.body._id )
      });
    //res.set('Cache-Control', 'no-cache');
    res.json( result );
})


const getDate = function() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${month}-${day}-${year}`;

    return currentDate;
}

const calcMoneySaved = function(paid, discount) {
    let monCalc = (paid * 100) / (100 - discount);
    return (monCalc - paid).toFixed(2);
}

app.listen( process.env.PORT || 4000 )
