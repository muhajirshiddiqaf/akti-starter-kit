import jwt from "jsonwebtoken";
import { env } from "../env.js";

/**
 * Middleware: verifikasi JWT dan set req.user (userId, email).
 * Gunakan untuk route yang butuh login.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token)
    return res.status(401).json({ message: "Token tidak ditemukan. Silakan login." });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  }
  catch {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa. Silakan login lagi." });
  }
}
