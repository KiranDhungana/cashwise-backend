import { Router } from "express";
import { signup, login, getMe, getAllUsers } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { addGoalForUser, getGoalsForUser } from "../controllers/goalController";
import { addEvent, getEventForUser } from "../controllers/eventController";
import { addUserPost, getAllPosts, getUserPost } from "../controllers/postController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/users/add/goals", protect, addGoalForUser);
router.get("/user/goals", protect, getGoalsForUser);
router.post("/user/add/event", protect, addEvent);
router.get("/user/get/event", protect, getEventForUser);
router.get("/get/users", protect, getAllUsers);
router.post("/add/post", protect, addUserPost);
router.get("/get/posts", protect, getAllPosts);
router.get("/get/post", protect, getUserPost);

export default router;
