/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import GoogleLogin from './controller.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * PATH
 */
Router.post('/', GoogleLogin);

/*
 * EXPORTS
 */
export default Router;
