var bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("@models/User");
const { userExists } = require("@utils");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "some secret";

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/api/auth/google/redirect",
      clientID: process.env.GOOGLE_PLUS_CLIENT_ID,
      clientSecret: process.env.GOOGLE_PLUS_CLIENT_SECRET,
    },
    async (
      _accesToken,
      _refreshToken,
      { id, displayName, photos, emails },
      done
    ) => {
      try {
        const user = await userExists("google_id", id);
        if (user.length > 0) {
          return done(null, user[0]);
        } else {
          const user = await User.create({
            email: emails[0].value,
            username: displayName,
            image: photos[0].value,
            google_id: id,
          });

          return done(null, { id, displayName, photos, emails });
        }
      } catch (err) {
        console.log("ERR", err);
        done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await userExists("id", jwt_payload.id);
      if (user.length > 0) {
        return done(null, user[0].dataValues);
      } else {
        return done(null, false);
      }
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  console.log("DESERIALIZE USER", id);
  try {
    const user = userExists("id", id);
    done(null, id);
  } catch (err) {
    done(err);
  }
});
