const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user'); // Updated import statement
const jwt = require('jsonwebtoken');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const ws = require('ws');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10)
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,

}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect('mongodb+srv://rmzrimshad1:vN9OO4tI4M5ibNtO@cluster0.aedky1j.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.get('/test', (req, res) => {
            res.json('test ok');
        });

        app.post('/register', async (req, res) => {
            const { username, password } = req.body;
            try {
                // Check if the username already exists in the database
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    // Handle the case where the username is already taken
                    return res.status(409).json({ message: 'Username already taken' });
                }

                const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
                const createdUser = await User.create({
                    username: username,
                    password: hashedPassword,
                });

                await jwt.sign({ userId: createdUser._id, username }, JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                        id: createdUser._id,
                    });
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const founduser = await User.findOne({ username });

            if (!founduser) {
                // If the user is not found, return an error response
                return res.status(401).json({ message: 'Wrong username or password' });
            }

            const passOk = await bcrypt.compare(password, founduser.password);
            if (!passOk) {
                // If the password is incorrect, return an error response
                return res.status(401).json({ message: 'Wrong username or password' });
            }

            jwt.sign({ userId: founduser._id, username }, JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({
                    id: founduser._id,
                    message: 'Logged in',
                });
            });
        });
        app.get('/profile', (req, res) => {
            const token = req.cookies?.token;
            if (token) {
                jwt.verify(token, JWT_SECRET, {}, (err, data) => {
                    if (err) throw err
                    res.json(data)
                })
            } else {
                res.status(401).json('no token')
            }

        })

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });



const server = app.listen(4040);
const wss = new ws.WebSocketServer({ server })
wss.on('connection', (connection) => {
    console.log('someone connected!');
});