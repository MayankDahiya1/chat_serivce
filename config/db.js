/*
* IMPORTS
*/
const { PrismaClient } = require('@prisma/client');


/*
* CONST
*/
const prisma = new PrismaClient();


/*
* EXPORTS
*/
module.exports = prisma;
