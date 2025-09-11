/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import ConversationGet from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', ConversationGet);

/*
 * EXPORTS
 */
export default Router;
