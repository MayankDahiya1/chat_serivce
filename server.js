/*
* IMPORTS
*/
const _App = require('./app');
const { PORT } = require('./config/env');


// Server listen
_App.listen(PORT, () => {
    console.log('Server running on http://localhost:4000')
})