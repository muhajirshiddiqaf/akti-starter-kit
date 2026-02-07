import express from "express";

import auth from "./auth.js";
import emojis from "./emojis.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/emojis", emojis);

// Contoh route yang butuh login (opsional)
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
