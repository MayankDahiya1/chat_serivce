/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import SettingController from './controller.js';

/*
 * ROUTE ASSIGNMENT
 */
const Router = express.Router();

/*
 * PATH
 */
Router.get('/', SettingController);

/*
 * EXPORT
 */
export default Router;
