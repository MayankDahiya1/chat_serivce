/*
 * GLOBAL
 */
import './globals.js';

/*
 * IMPORTS
 */
import express from 'express';
import helmet from 'helmet';
import limiter from './middlewares/rateLimiter.js';

/*
 * ROUTES
 */
import AccountRoutes from './modules/Account/routes.js';
import GoogleRoutes from './modules/Google/routes.js';

/*
 * MIDDLEWARES
 */
import ErrorHandler from './middlewares/errorHandler.js';

/*
 * CONST
 */
const _App = express();

// Middleware to parse JSON body
_App.use(express.json());

// Helmet for secured headers
_App.use(helmet());

// Limiting api requests for all the api's
_App.use(limiter);

/*
 * Health check
 */
_App.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date() }));

/*
 * ROUTE PATH (ACCOUNT)
 */
_App.use('/api/account', AccountRoutes);

/*
 * ROUTE PATH (GOOGLE)
 */
_App.use('/api/google', GoogleRoutes);

/*
 * ERROR HANDLER
 */
_App.use(ErrorHandler);

/*
 * EXPORTS
 */
export default _App;
