/*
* IMPORTS
*/
import express from "express"; // NPM: Web framework for Node.js to simplify handling HTTP requests
import helmet from "helmet";
import limiter from "./middlewares/rateLimiter.js";


/*
* ROUTES
*/
import AccountRoutes from "./modules/account/accountRoutes.js";


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
* ROUTE PATH
*/
_App.use('/api/account', AccountRoutes)


/*
* EXPORTS
*/
export default _App;