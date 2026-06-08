import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: "Token not found!" });
    }
    const [, token] = authToken.split(" ");
    try {
        const { sub } = verify(token!, process.env.JWT_SECRET!) as { sub: string };

        req.user_id = sub;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid token!"
        });
    }
}