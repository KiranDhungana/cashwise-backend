import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  id: string;
}

export const protect: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // Cast to any so TS won’t complain
    (req as any).user = user;

    next();
    return;
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
    return;
  }
};
