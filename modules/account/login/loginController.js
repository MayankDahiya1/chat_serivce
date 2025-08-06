/*
* IMPORTS
*/
const bcrypt = require('bcryptjs');


/*
* PRISMA (DB)
*/
const Prisma = require('../../../config/db');


/*
* UTILS (HELPERS)
*/
const { _GenerateAccessToken, _GenerateRefreshToken } = require('../../../utils/generateTokens');


/*
* EXPORTS
*/
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'All fields required' });
    }

    const _User = await prisma.user.findUnique({ where: { email } });

    if (!_User) {
        return res.status(401).json({ message: 'Invalid email or password', status: 'INVALID_EMAIL_PASSWORD' });
    }

    const _IsMatch = await bcrypt.compare(password, _User.password);
    if (!_IsMatch) {
        return res.status(401).json({ message: 'Invalid email or password', status: 'INVALID_EMAIL_PASSWORD' });
    }

    // Access token
    const _AccessToken = _GenerateAccessToken({ id: _User.id, email: _User.email });

    // Device/IP capture
    const device = req.headers["user-agent"] || "unknown";
    const ip = req.ip;

    // Refresh token
    const _RefreshToken = await _GenerateRefreshToken(
        Prisma,
        _User.id,
        { id: _User.id, email: _User.email },
        device,
        ip
    );

    // Return
    res.json({
        token: _AccessToken,
        refreshToken: _RefreshToken,
        status: 'SUCCESSFULLY_LOGGED_IN',
        message: 'Successfully logged in user.'
    });
};