/*
* IMPORTS
*/
import express from 'express';


/*
* CONTROLLER
*/
import { loginUser } from './loginController.js';


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
export default Router;
