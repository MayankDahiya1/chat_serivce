/*
* IMPORTS
*/
const express = require('express');


/*
* ROUTES
*/
const registerRoute = require('./register/registerRoute');
const loginRoute = require('./login/loginRoute');
const profileRoute = require('./profile/profileRoute')


/*
* ROUTER
*/
const Router = express.Router();


/*
* INITIAL PATHS
*/
Router.use('/register', registerRoute);
Router.use('/login', loginRoute);
Router.use('/profile', profileRoute)


module.exports = Router;