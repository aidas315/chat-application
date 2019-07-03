// import { User } from "../models";
import jwt from "jsonwebtoken";
import userRouter from "./users";
import passport from "../config/passport";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.use("/users", passport.authenticate("jwt", {session: false}), userRouter);

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running."
    });
});

router.post("/login", (req: Request, res: Response) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) return res.status(400).json({
            message: "Something is not right.",
            user: user
        });

        req.logIn(user, {session: false}, (err) => {
            if (err) return res.send(err);
            const token = jwt.sign(user, process.env.SECRET_KEY || "sup3rs3cr3t");
            return res.status(200).json({ user, token });
        });

    })(req, res);
});


router.post("/register", (req: Request, res: Response) => {
    
});

export default router;