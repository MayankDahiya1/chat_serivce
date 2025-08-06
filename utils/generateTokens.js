/*
* IMPORTS
*/
const jwt = require("jsonwebtoken");

/*
* LOADS ENV
*/
require("dotenv").config();


/*
* FUNCTION
*/
function _GenerateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
}

// For generating refresh token
async function _GenerateRefreshToken(prisma, userId, payload, device, ip) {
    // Generating token
    const token = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    // Creating refresh tokne
    const _RefreshToken = await prisma.refreshToken.create({
        data: {
            token,
            device,
            ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userId
        }
    });

    // Error handlings
    if(!_RefreshToken || _RefreshToken instanceof Error ){
        return;
    }

    return token;
}

module.exports = { _GenerateAccessToken, _GenerateRefreshToken };
