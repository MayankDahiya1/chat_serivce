/*
 * IMPORTS
 */
import express from 'express';

/*
 * ROUTES
 */
import RegisterRoute from './Register/route.js';
import LoginRoute from './Login/route.js';
import ProfileRoute from './Profile/route.js';
import SettingRoute from './Settings/route.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * INITIAL PATHS
 */

Router.use('/register', RegisterRoute);
Router.use('/login', LoginRoute);
Router.use('/profile', ProfileRoute);
Router.use('/settings', SettingRoute);

/*
 * EXPORTS
 */
export default Router;
