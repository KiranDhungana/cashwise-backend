import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe); // ✅ no more overload errors

export default router;
