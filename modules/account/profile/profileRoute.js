/*
* IMPORTS
*/
import express from 'express'


/*
* CONTROLLER
*/
import { getProfile } from './profileController.js'


/*
* MIDDLEWARE
*/
import _AuthMiddleware from '../../../middlewares/authMiddleware.js'


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
export default Router
