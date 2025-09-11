/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import SendMessage from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', SendMessage);

/*
 * EXPORTS
 */
export default Router;
