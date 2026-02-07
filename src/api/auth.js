import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import db from "../db/index.js";
import { env } from "../env.js";

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(1, "Nama wajib diisi").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// POST /api/v1/auth/register
router.post("/register", (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return res.status(400).json({ message: msg });
    }
    const { email, password, name } = parsed.data;

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing)
      return res.status(409).json({ message: "Email sudah terdaftar" });

    const password_hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    ).run(email, password_hash, name ?? null);

    const user = db.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.status(201).json({
      message: "Registrasi berhasil",
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
      token,
    });
  }
  catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/login
router.post("/login", (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      return res.status(400).json({ message: msg });
    }
    const { email, password } = parsed.data;

    const user = db.prepare("SELECT id, email, name, password_hash, created_at FROM users WHERE email = ?").get(email);
    if (!user)
      return res.status(401).json({ message: "Email atau password salah" });

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: "Email atau password salah" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.json({
      message: "Login berhasil",
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
      token,
    });
  }
  catch (err) {
    next(err);
  }
});

export default router;
