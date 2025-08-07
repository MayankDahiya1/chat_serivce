/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import LoginUser from './loginController.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', LoginUser);

/*
 * EXPORTS
 */
export default Router;
