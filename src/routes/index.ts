import jwt from "jsonwebtoken";
import userRouter from "./users";
import { User } from "../models";
import passport from "../config/passport";
import { isAuthorized } from "../config/middlewares";
import { body, validationResult } from "express-validator";
import { Router, Request, Response } from "express";

const router = Router();

router.use(passport.initialize());
router.use("/users", isAuthorized, userRouter);

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running."
    });
});

router.post("/login",[
    body("email").exists().withMessage("Email must be provided."),
    body("password").exists().withMessage("Password must be provided.")
], 
(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
        return res.status(422).json({
            message: "Validation errors occured.",
            error: errors 
        })
    }
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if (err) return res.status(500).json({
            message: "Something is not right.",
            error: err
        });
        if (user) {
            req.logIn(user, { session: false }, (err) => {
                if (err)
                    return res.status(500).json({
                        message: "Something is not right.",
                        error: err
                    });
                let obj = user.toObject();
                const token = jwt.sign(obj, process.env.SECRET_KEY || "sup3rs3cr3t");
                delete obj.password;
                return res.status(200).json({ user: obj, token });
            });
        } else {
            return res.status(400).json({
                message: "Something is not right.",
                error: "No user found with provided credentials."
            });
        }
    })(req, res);
});

router.post("/register", [
    body("name")
        .isLength({ min: 5, max: 25 })
        .withMessage("Name must between 5 and 25 characters."),
    body("email")
        .isEmail()
        .withMessage("Email is not valid.")
        .custom(email => {
            return User.findOne({ email })
                .exec()
                .then(user => {
                    if (user) throw new Error("User already exsist.");
                })
                .catch(error => {
                    if (error) throw error;
                });
        }),
    body("username")
        .isLength({ min: 5, max: 12 })
        .withMessage("Username must between 5 and 12 characters.")
        .custom(username => {
            return User.findOne({ username })
                .exec()
                .then(user => {
                    if (user) throw new Error("Username is not available.");
                })
                .catch(error => {
                    if (error) throw error;
                });
        }),
    body("password")
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must between 8 and 25 characters."),
    body("confirm_password")
        .custom((password, { req }) => {
            if (password != req.body.password)
                throw new Error("Passwords don't match.");
            return true;
        })
], 
(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors occured.",
            errors: errors
        });
    }
    new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })
    .save()
    .then(user => {
        let obj = user.toObject();
        delete obj.password;
        return res.status(201).json({
            message: "Success! User got registered.",
            user: obj
        });
    })
    .catch(error => {
        return res.status(500).json({
            message: "Something is not right.",
            error: error
        });
    });
});

export default router;