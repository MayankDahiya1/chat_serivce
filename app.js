/*
* IMPORTS
*/
const express = require("express"); // NPM: Web framework for node.js to simplify hadling http requests
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimiter');


/*
* ROUTES
*/
const AccountRoutes = require('./modules/account/accountRoutes');


/*
* CONST
*/
const _App = express();


// Middleware to parse JSON body
_App.use(express.json());

// Helmet for secured headers
_App.use(helmet());

// Limiting api requests for all the api's
_App.use(limiter);


/*
* Health check
*/
_App.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date() }));


/*
* ROUTE PATH
*/
_App.use('/api/account', AccountRoutes)


/*
* EXPORTS
*/
module.exports = _App;