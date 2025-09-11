/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import StartConversation from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', StartConversation);

/*
 * EXPORTS
 */
export default Router;
