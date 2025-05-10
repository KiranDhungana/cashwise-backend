// src/controllers/goalController.ts
import { RequestHandler } from "express";
import { prisma } from "../prismaClient";

import { differenceInDays, parseISO } from "date-fns";

export const addGoalForUser: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;
  console.log(userId);

  if (Number.isNaN(userId)) {
    res.status(400).json({ error: "Invalid userId param" });
    return;
  }

  const { title, description, amount, targetdate, frequency, amountSaved } = req.body;

  // Parse and validate target date
  const parsedTargetDate = parseISO(targetdate);
  if (isNaN(parsedTargetDate.getTime())) {
    res.status(400).json({ error: "Invalid target date format" });
    return;
  }

  const today = new Date();
  const daysLeft = Math.max(0, differenceInDays(parsedTargetDate, today)); // No negative days

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
        goalAmount: amount,
        daysLeft,
        frequencyLabel: frequency,
      },
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error("Error adding goal:", err);
    next(err);
  }
};

export const getGoalsForUser: RequestHandler = async (req, res, next) => {
  const userId = (req as any).user.id;
  console.log(userId);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const goal = await prisma.userGoal.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json(goal);
  } catch (err) {
    console.error("Error in response :", err);
    next(err);
  }
};
