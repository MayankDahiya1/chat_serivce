/*
* IMPORTS
*/
const express = require("express"); // NPM: Web framework for node.js to simplify hadling http requests
const bcrypt = require("bcryptjs"); // NPM: Crypting values like password & other secretive info
const helmet = require("helmet"); // NPM: 
const rateLimit = require("express-rate-limit"); // NPM: 


/*
* PRISMA DB
*/
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


/*
* IMPORT AUTH FILE
*/
const _AuthMiddleware = require("./middlewares/authMiddleware"); 


/*
* UTILS (Helpers)
*/
const { _GenerateAccessToken, _GenerateRefreshToken } = require("./utils/generateTokens");
const { _RefreshTokenHandler } = require('./utils/refreshTokenHandler')

/*
* LOADING ENVs
*/
require("dotenv").config();


/*
* CONST
*/
const _App = express()
const USER = []
const _Limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10, // max requests per IP
    message: { status: 'TOO_MANY_REQUESTS', message: 'Too many requests, try again later' }
});


// Middleware to parse JSON body
_App.use(express.json())

// Helmet for secured headers
_App.use(helmet());

// Limiting api requests for all the api's
_App.use(_Limiter);

// GET request
_App.get('/health', (req,res) => {
    res.status(200).json({ 'status': 'OK', timestamp: new Date() })
})

// Register Route
_App.post('/register', async (req,res) => {
    // Getting all the required fields from body
    const { name, email, password } = req.body

    // If any of the field not exsisted
    if(!name || !email || !password) {
        return res.status(400).json({ 'message': 'All fields required', 'status': 'FIELDS_SUCCESSFULLY' })
    }

    // Hashing of password
    const _HashedPassword = await bcrypt.hash(password, 10)

    // Pushing new user into in-memory of cpu
    const _CreateUser =  await prisma.user.create({
        data: { name, email, password: _HashedPassword }
    });

    // If error persists
    if(!_CreateUser || _CreateUser instanceof Error){
        return res.status(401).json({ 'message':'Something went wrong', 'status': 'SOMETHIGN_WENT_WRONG' })
    }

    res.status(201).json({ 'message': 'User creates successfully', 'status':'CREATED_SUCCESSFULLY' })
})

// Login route
_App.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'All fields required' });
    }

    const _User = await prisma.user.findUnique({ where: { email } });

    if (!_User) {
        return res.status(401).json({ message: 'Invalid email or password', status: 'INVALID_EMAIL_PASSWORD' });
    }

    const _IsMatch = await bcrypt.compare(password, _User.password);
    if (!_IsMatch) {
        return res.status(401).json({ message: 'Invalid email or password', status: 'INVALID_EMAIL_PASSWORD' });
    }

    // Access token
    const _AccessToken = _GenerateAccessToken({ id: _User.id, email: _User.email });

    // Device/IP capture
    const device = req.headers["user-agent"] || "unknown";
    const ip = req.ip;

    // Refresh token
    const _RefreshToken = await _GenerateRefreshToken(
        prisma,
        _User.id,
        { id: _User.id, email: _User.email },
        device,
        ip
    );

    res.json({
        token: _AccessToken,
        refreshToken: _RefreshToken,
        status: 'SUCCESSFULLY_LOGGED_IN',
        message: 'Successfully logged in user.'
    });
});


// Refresh Token Route
_App.post('/token', _RefreshTokenHandler(prisma));

// Logout
_App.post('/logout', async (req, res) => {
    // Extracting token from body
    const { token } = req.body;

    // If token is not there
    if (!token) return res.status(400).json({ status: 'NO_TOKEN', message: 'Refresh token required' });

    // Deleting token with given user
    const _DelteTokenWithGivenUser = await prisma.refreshToken.deleteMany({ where: { token } });

    // If error persists
    if(!_DelteTokenWithGivenUser || _DelteTokenWithGivenUser instanceof Error) {
        return res.status(401).json({'message':'Something went wrong', 'status': "SOMETHING_WENT_WRONG"})
    }

    // Return logged out
    res.json({ message: 'Logged out successfully', status: 'LOGGED_OUT' });
});

// Getting setting
_App.get('/settings', _AuthMiddleware , (req,res) => {
    res.json({ message: "Setting accessed successfully!", data: req.user, status: 'SETTING_ACCESS' });
})

// Getting profile
_App.get('/profile', _AuthMiddleware , (req,res) => {
    res.json({ message: "Profile accessed successfully!", data: req.user, status: 'PROFILE_ACCESS' });
})

// Server listen
_App.listen(4000, () => {
    console.log('Server running on http://localhost:4000')
})