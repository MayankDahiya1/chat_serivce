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
import ChatRoutes from './modules/Chat/routes.js';

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
_App.use('/api/chat', ChatRoutes);

/*
 * ERROR HANDLER
 */
_App.use(ErrorHandler);

/*
 * EXPORTS
 */
export default _App;
