/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import GetProfile from './controller.js';

/*
 * MIDDLEWARE
 */
import _AuthMiddleware from '../../../middlewares/authMiddleware.js';

/*
 * ROUTER INTIALIZATION
 */
const Router = express.Router();

/*
 * ROUTER PATH
 */
Router.get('/', _AuthMiddleware, GetProfile);

/*
 * EXPORTS
 */
export default Router;
