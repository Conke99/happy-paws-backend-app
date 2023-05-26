const { sequelize, DataTypes } = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(100),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  password: {
    type: DataTypes.STRING(100),
  },
  image: {
    type: DataTypes.STRING(500),
  },
  google_id: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
