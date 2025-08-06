/*
* IMPORTS
*/
const express = require('express');


/*
* CONTROLLER
*/
const { loginUser } = require('./loginController');


/*
* ROUTER
*/
const Router = express.Router();


/*
* PATH
*/
Router.post('/', loginUser);


/*
* EXPORTS
*/
module.exports = Router;