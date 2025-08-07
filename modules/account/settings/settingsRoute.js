/*
 * IMPORTS
 */
import express from 'express';

/*
 * CONTROLLER
 */
import SettingController from './settingsController.js';

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
