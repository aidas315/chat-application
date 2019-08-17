import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET_KEY || 'sup3rs3cr3t', (error: any, payload: Object) => {
        if (error) return res.status(403).json({ error: 'Invalid credentials sent!' });
        req.user = payload;
    });
    next();
}