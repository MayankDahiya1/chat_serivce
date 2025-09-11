/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import GetMessages from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/:conversationId/messages', GetMessages);

/*
 * EXPORTS
 */
export default Router;
