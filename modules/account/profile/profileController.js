/*
 * CONST
 */
const GetProfile = (req, res) => {
  // req.user ko hum AuthMiddleware se set karte hain
  res.json({
    message: 'Profile accessed successfully!',
    data: req.user,
    status: 'PROFILE_ACCESS',
  });
};

/*
 * EXPORTS
 */
export default GetProfile;
