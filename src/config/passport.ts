import passport from "passport";
import { User } from "../models";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY || "sup3rs3cr3t"
}, (jwtPayload, callback) => {
    return User.findById(jwtPayload.id)
        .select("-password")
        .then(user => {
            if(!user) return callback("Something went wrong.", false);
            return callback(null, user);
        }).catch(error => callback(error, false));
}));

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, callback) => {
        return User.findOne({ $or: [{ email }, {username: email}] })
            .then(user => {
                if (!user || !User.verifyPasswords(user.password, password)) return callback("Something went wrong.", false, {message: "Invalid Credentials."});
                delete user.password;
                return callback(null, user, {message: "Success."});
            }).catch(error => callback(error, false));
}));

export default passport;