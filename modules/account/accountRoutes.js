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

/*
* EXPORTS
*/
export default Router;
