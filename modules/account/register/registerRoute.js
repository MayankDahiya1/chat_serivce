/*
* IMPORTS
*/
import express from 'express';

/*
* CONTROLLER
*/
import { registerUser } from './registerController.js';

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
export default Router;
