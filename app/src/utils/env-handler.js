const path = require("path");

module.exports = envHandler = () =>
  require("dotenv").config({
    path:
      process.env.NODE_ENV !== "production"
        ? `${path.dirname(path.dirname(__dirname))}/.env`
        : "",
  });
