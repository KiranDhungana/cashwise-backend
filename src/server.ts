import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { prisma } from "./prismaClient";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // or your deployed frontend URL
    credentials: true, // if using cookies or sessions
  })
);

// health-check
app.get("/", (_req, res) => {
  res.send("OK");
});
// auth
app.use("/api/auth", authRoutes);

// graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
