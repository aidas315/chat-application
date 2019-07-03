// import { User } from "../models";
import { Router, Request, Response, NextFunction } from "express";

const userRouter = Router();

userRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running."
    });
});

export default userRouter;