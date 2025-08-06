/*
* IMPORTS
*/
const express = require('express');


/*
* CONTROLLER
*/
const { registerUser } = require('./registerController');


/*
* ROUTER
*/
const Router = express.Router();


/*
* PATH
*/
Router.post('/', registerUser);


/*
* EXPORTS
*/
module.exports = Router;