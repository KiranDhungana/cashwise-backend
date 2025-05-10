// src/controllers/goalController.ts
import { RequestHandler } from "express";
import { prisma } from "../prismaClient";

export const addUserPost: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;
  console.log("User ID: test", userId);

  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userPost = await prisma.userPost.create({
      data: {
        title,
        description,

        uid: userId,
      },
    });

    res.status(201).json(userPost);
  } catch (err) {
    console.error("Error creating group vault:", err);
    next(err);
  }
};

export const getUserPost: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userPost = await prisma.userPost.findMany({
      where: {
        uid: userId,
      },
    });

    res.status(201).json(userPost);
  } catch (err) {
    console.error("Error  in getting post", err);
    next(err);
  }
};

export const getAllPosts: RequestHandler = async (req, res, next) => {
  try {
    const userPost = await prisma.userPost.findMany({});

    res.status(200).json(userPost);
  } catch (err) {
    console.error("Error  in getting post", err);
    next(err);
  }
};
