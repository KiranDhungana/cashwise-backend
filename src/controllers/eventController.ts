import { RequestHandler } from "express";
import { prisma } from "../prismaClient";

export const addEvent: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;
  console.log("User ID: test", userId);

  const { title, description, totalAmount, perPerson, dueDate } = req.body;

  if (!title || !totalAmount || !perPerson || !dueDate) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const groupVault = await prisma.groupEvent.create({
      data: {
        title,
        description,
        totalAmount,
        collectedAmount: 0,
        perPerson,
        dueDate: new Date(dueDate),
        uid: userId,
      },
    });

    res.status(201).json(groupVault);
  } catch (err) {
    console.error("Error creating group vault:", err);
    next(err);
  }
};

export const getEventForUser: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;
  console.log(userId);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const goal = await prisma.groupEvent.findMany({
      where: {
        uid: userId,
      },
    });

    res.status(200).json(goal);
  } catch (err) {
    console.error("Error in response :", err);
    next(err);
  }
};
