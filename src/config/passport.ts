import passport from "passport";
import { User } from "../models";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, callback) => {
        return User.findOne({ $or: [{ email }, {username: email}] })
            .then(user => {
                if (!user || !User.verifyPasswords(user.password, password)) return callback(null, false);
                delete user.password;
                return callback(null, user);
            }).catch(error => callback(error, false));
}));

export default passport;