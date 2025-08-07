/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import GoogleRegister from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', GoogleRegister);

/*
 * EXPORTS
 */
export default Router;
