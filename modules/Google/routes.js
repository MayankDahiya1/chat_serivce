/*
 * IMPORTS
 */
import express from 'express';

/*
 * ROUTES
 */
import RegisterRoute from './Register/route.js';
import LoginRoute from './Login/route.js';
import TokenRoute from './Token/route.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * INITIAL PATHS
 */

Router.use('/register', RegisterRoute);
Router.use('/login', LoginRoute);
Router.use('/token', TokenRoute);

/*
 * EXPORTS
 */
export default Router;
