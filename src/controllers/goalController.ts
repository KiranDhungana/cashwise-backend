// src/controllers/goalController.ts
import { RequestHandler } from "express";
import { prisma } from "../prismaClient";

export const addGoalForUser: RequestHandler = async (req, res, next) => {
  // const userId = req.user!.id;
  const userId = (req as any).user.id;
  console.log(userId);

  if (Number.isNaN(userId)) {
    res.status(400).json({ error: "Invalid userId param" });
    return;
  }

  const { title, description, amountSaved, goalAmount, daysLeft, frequencyLabel } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const goal = await prisma.userGoal.create({
      data: {
        user: { connect: { id: userId } },
        title,
        description,
        amountSaved: amountSaved ?? 0,
        goalAmount,
        daysLeft,
        frequencyLabel,
      },
    });

    // ← **don’t** return this call, just send it
    res.status(201).json(goal);
    return;
  } catch (err) {
    console.error("Error adding goal:", err);
    // pass to your error middleware
    next(err);
    return;
  }
};
