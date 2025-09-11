/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import DeleteConversation from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', DeleteConversation);

/*
 * EXPORTS
 */
export default Router;
