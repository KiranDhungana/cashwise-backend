import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prismaClient";
import { generateToken } from "../utils/generateToken";

export const signup: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body, "data");
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    // no `return` here—just call res.json and exit
    res.json((req as any).user);
    // explicitly return void
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export const getAllUsers: RequestHandler = async (req: any, res: any) => {
  console.log("testing new ");
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
    });
    res.json({ users });
  } catch (err) {
    res.json(err);
  }
};
