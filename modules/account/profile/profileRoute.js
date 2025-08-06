/*
* IMPORTS
*/
const express = require('express')


/*
* CONTROLLER
*/
const { getProfile } = require('./profileController')


/*
* MIDDLEWARE
*/
const _AuthMiddleware = require('../../../middlewares/authMiddleware')


/*
* ROUTER INTIALIZATION
*/
const Router = express.Router()


/*
* ROUTER PATH
*/
Router.get('/', _AuthMiddleware, getProfile)

/*
* EXPORTS
*/
module.exports = Router;

