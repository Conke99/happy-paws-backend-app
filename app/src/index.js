require("module-alias/register");
require("@utils/env-handler")();
require("@config/passport-setup");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { checkDbConnection, sequelize } = require("./config/db");

const app = express();
const port = process.env.PORT;

// Cors config
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  credentials: true,
};

// Cors and body parser
app.use(cors(corsOptions));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: "some secret",
    name: "pa-cookie",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("@routes/auth-routes"));

checkDbConnection();

// Sequelize db sync
sequelize.sync().then((r) => {
  // shouldPopulate();
  app.listen(port, () => console.log(`App listening on port ${port}`));
});
