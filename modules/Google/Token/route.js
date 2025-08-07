/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import GoogleToken from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', GoogleToken);

/*
 * EXPORTS
 */
export default Router;
