/*
* LOADS ENV
*/
require('dotenv').config();


/*
* EXPORTS
*/
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL
};
