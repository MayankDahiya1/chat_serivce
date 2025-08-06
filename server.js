/*
* IMPORTS
*/
import _App from './app.js';
import ENV from './config/env.js';


/*
* Server listen
*/
_App.listen(ENV.PORT, () => {
    console.log('Server running on http://localhost:4000')
})