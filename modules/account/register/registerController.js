/*
* IMPORTS
*/
const bcrypt = require('bcryptjs');


/*
* PRISMA (DB)
*/
const Prisma = require('../../../config/db');


/*
 * EXPORTS
 */
exports.registerUser = async (req,res) => {
    // Getting all the required fields from body
    const { name, email, password } = req.body

    // If any of the field not exsisted
    if(!name || !email || !password) {
        return res.status(400).json({ 'message': 'All fields required', 'status': 'FIELDS_SUCCESSFULLY' })
    }

    // Hashing of password
    const _HashedPassword = await bcrypt.hash(password, 10)

    // Pushing new user into in-memory of cpu
    const _CreateUser =  await Prisma.user.create({
        data: { name, email, password: _HashedPassword }
    });

    // If error persists
    if(!_CreateUser || _CreateUser instanceof Error){
        return res.status(401).json({ 'message':'Something went wrong', 'status': 'SOMETHIGN_WENT_WRONG' })
    }

    // Return success
    res.status(201).json({ 'message': 'User creates successfully', 'status':'CREATED_SUCCESSFULLY' })
}