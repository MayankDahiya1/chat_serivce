/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import RegisterUser from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', RegisterUser);

/*
 * EXPORTS
 */
export default Router;
