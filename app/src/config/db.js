const { Sequelize, DataTypes } = require("sequelize");
const database = process.env.POSTGRES_DB,
  username = process.env.POSTGRES_USER,
  password = process.env.POSTGRES_PASSWORD,
  host = process.env.POSTGRES_HOST;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: "postgres",
});

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Connection has been established successfully with the ${database} database`
    );
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

module.exports = { sequelize, DataTypes, checkDbConnection };
