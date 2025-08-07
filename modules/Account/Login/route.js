/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import AccountLogin from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', AccountLogin);

/*
 * EXPORTS
 */
export default Router;
