/*
 * CONST
 */
const SettingController = async (req, res) => {
  return res.status(200).json({
    message: 'Setting accessed successfully!',
    status: 'SUCCESSFULLY_GET_SETTING',
    data: req.user,
  });
};

/*
 * EXPORT
 */
export default SettingController;
