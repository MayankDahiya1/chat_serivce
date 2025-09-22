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
Router.get('/:conversationId', GetMessages);

/*
 * EXPORTS
 */
export default Router;
