import passport from "passport";
import { Strategy } from "passport-local";
import { user } from "../schema/user.js";
import { comparepassword } from "../utils/helper.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const finduser = await user.findById(id);
    if (!finduser) return done(new Error("User not found"), null);
    done(null, finduser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const findemail = await user.findOne({ email });
      if (!findemail) {
        return done(null, false, { message: "User not found" }); // Use 'done' with message
      }

      if (!comparepassword(password, findemail.password)) {
        return done(null, false, { message: "Invalid credentials" }); // Use 'done' with message
      }

      done(null, findemail);
    } catch (err) {
      done(err);
    }
  })
);
