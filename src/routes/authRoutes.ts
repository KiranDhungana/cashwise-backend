import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { addGoalForUser } from "../controllers/goalController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/users/add/goals", protect, addGoalForUser);

export default router;
