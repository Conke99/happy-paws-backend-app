const User = require("@models/User");

const userExists = async (key, value) => {
  try {
    const user = await User.findAll({
      where: {
        [key]: value,
      },
    });
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { userExists };
