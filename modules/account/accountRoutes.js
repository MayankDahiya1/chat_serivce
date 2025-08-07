/*
 * IMPORTS
 */
import express from 'express';

/*
 * ROUTES
 */
import registerRoute from './register/registerRoute.js';
import loginRoute from './login/loginRoute.js';
import profileRoute from './profile/profileRoute.js';
import settingRoute from './settings/settingsRoute.js';

/*
 * ROUTER
 */
const Router = express.Router();

/*
 * INITIAL PATHS
 */

Router.use('/register', registerRoute);
Router.use('/login', loginRoute);
Router.use('/profile', profileRoute);
Router.use('/settings', settingRoute);

/*
 * EXPORTS
 */
export default Router;
