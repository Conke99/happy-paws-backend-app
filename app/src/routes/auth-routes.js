const bcrypt = require("bcryptjs");
const router = require("express").Router();
const passport = require("passport");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const User = require("@models/User");
const { userExists } = require("@utils");

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await userExists("email", email);
    if (user.length > 0) {
      res.status(400).send("User already exists");
    } else {
      const image = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) throw err;
          const user = await User.create({
            email,
            username,
            image,
            password: hash,
          });
          res.status(200).json(user);
        });
      });
    }
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  const user = await userExists("email", email);
  if (user.length < 1) {
    return res.status(404).send("User not found");
  } else {
    const { dataValues } = user[0];
    const { password: existingUserId, ...rest } = dataValues;
    const isMatch = await bcrypt.compare(password, existingUserId);
    if (isMatch) {
      jwt.sign(
        {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          image: user[0].image,
        },
        "some secret",
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            success: true,
            user: { ...rest, token: `Bearer ${token}` },
          });
        }
      );
    } else {
      return res.status(400).send("Password incorrect");
    }
  }
});

router.post("/logout", async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Succesfully logged out.");
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    console.log(req.user);
    res.redirect(`http://localhost:3000/${req.user.id}`);
  }
);

module.exports = router;
