/*
 * IMPORTS
 */
import jwt from 'jsonwebtoken';

/*
 * LOADS ENV
 */
import dotenv from 'dotenv';
dotenv.config();

/*
 * FUNCTION
 */
function _GenerateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
}

// For generating refresh token
async function _GenerateRefreshToken(userId, payload, device, ip) {
  // Generating token
  const token = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

  // Creating refresh tokne
  const _RefreshToken = await DB.refreshToken.create({
    data: {
      token,
      device,
      ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId,
    },
  });

  // Error handlings
  if (!_RefreshToken || _RefreshToken instanceof Error) {
    return;
  }

  return token;
}

function _RefreshTokenHandler(prisma) {
  return async function (req, res) {
    // Extracting all the nedeed fields
    const { token } = req.body;
    const device = req.headers['user-agent'] || 'unknown';
    const ip = req.ip;

    // If token is not there return error
    if (!token)
      return res.status(401).json({ status: 'NO_TOKEN', message: 'Refresh token required' });

    // Try
    try {
      // Find token in DB
      const storedToken = await prisma.refreshToken.findUnique({ where: { token } });

      // If token not found
      if (!storedToken) {
        return res.status(403).json({ status: 'INVALID_TOKEN', message: 'Invalid refresh token' });
      }

      // Check device/IP match
      if (storedToken.device !== device || storedToken.ip !== ip) {
        return res
          .status(403)
          .json({ status: 'DEVICE_MISMATCH', message: 'Token used from different device/IP' });
      }

      // Verify token
      jwt.verify(token, process.env.REFRESH_SECRET, async (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ status: 'TOKEN_EXPIRED', message: 'Refresh token expired' });

        // Delete old token (rotation)
        const _DeleteToken = await prisma.refreshToken.delete({ where: { token } });

        // If error persists
        if (!_DeleteToken || _DeleteToken instanceof Error) {
          return res
            .status(401)
            .json({ message: 'Something went wrong', status: 'SOMETHING_WENT_WRONG' });
        }

        // Generate new tokens
        const _AccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: '5m',
        });

        // New refresh token
        const _NewRefreshToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.REFRESH_SECRET,
          { expiresIn: '7d' }
        );

        // Pushing new refresh token in db
        const _CreateRefreshToken = await prisma.refreshToken.create({
          data: {
            token: _NewRefreshToken,
            device,
            ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userId: user.id,
          },
        });

        // If error persists
        if (!_CreateRefreshToken || _CreateRefreshToken instanceof Error) {
          return res
            .status(401)
            .json({ message: 'Something went wrong', status: 'SOMETHING_WENT_WRONG' });
        }

        // If success return
        res.json({
          accessToken: _AccessToken,
          refreshToken: _NewRefreshToken,
          status: 'ROTATED_SUCCESSFULLY',
        });
      });
    } catch (err) {
      res.status(500).json({ status: 'SERVER_ERROR', message: err.message });
    }
  };
}

/*
 * EXPORTS
 */
export { _RefreshTokenHandler, _GenerateAccessToken, _GenerateRefreshToken };
