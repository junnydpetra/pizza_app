import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma/index";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const user_id = req.user_id;

    if (!user_id) {
        res.status(401).json({
            error: "Unauthorized user!",
        });
    }

    const user = await prismaClient.user.findFirst({
        where: {
            id: user_id
        },
    });

    if (!user) {
        res.status(401).json({
            error: "Unauthorized user!",
        });
        return;
    }

    if (user.role !== "ADMIN") {
        res.status(401).json({
            error: "Unauthorized user!",
        });
        return;
    }

    next();
}