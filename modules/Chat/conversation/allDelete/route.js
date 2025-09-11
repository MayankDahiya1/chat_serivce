/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import DeleteAllConversation from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', DeleteAllConversation);

/*
 * EXPORTS
 */
export default Router;
