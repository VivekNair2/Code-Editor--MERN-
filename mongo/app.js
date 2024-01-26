const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/sloginnew', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    userid: String,
    pwd: String
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve main page with signup and login buttons
app.get('/', function (req, res) {
    res.sendFile("C:/Users/vivek/Desktop/web dev/realtime-code-editor-main/mongo/index.html");
});

// Serve signup page
app.get('/signup', function (req, res) {
    res.sendFile("C:/Users/vivek/Desktop/web dev/realtime-code-editor-main/mongo/signup.html");
});

// Handle signup form submission
app.post('/signup', function (req, res) {
    const { userid, pwd } = req.body;

    if (!userid || !pwd) {
        return res.status(400).send("Both username and password are required.");
    }

    // Check if the user already exists in the database
    User.findOne({ userid: userid })
        .then(existingUser => {
            if (existingUser) {
                res.status(409).send("Username already exists. Please choose a different one.");
            } else {
                // Create a new user
                const newUser = new User({ userid, pwd });
                return newUser.save();
            }
        })
        .then(() => {
            res.send(`User ${userid} successfully created.`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error during signup.");
        });
});

// Serve login page
app.get('/login', function (req, res) {
    res.sendFile( "C:/Users/vivek/Desktop/web dev/realtime-code-editor-main/mongo/login.html");
});

// Handle login form submission
app.post('/login', function (req, res) {
    const { userid, pwd } = req.body;

    if (!userid || !pwd) {
        return res.status(400).send("Both username and password are required.");
    }

    // Check if the user exists in the database
    User.findOne({ userid: userid, pwd: pwd })
        .then(user => {
            if (user) {
                res.send(`Login successful for user: ${userid}`);
            } else {
                res.status(401).send("Invalid username or password.");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error during login.");
        });
});

// Add this route for the root path
app.get('/', function (req, res) {
    res.send('Welcome to the application!');
});

// Rest of your existing code...

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
