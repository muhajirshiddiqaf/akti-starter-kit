import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendPath = join(__dirname, "../frontend/build");

const app = express();

app.use(morgan("dev"));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'",
          "'unsafe-eval'",
        ],
        styleSrc: ["'self'", "https://cdn.tailwindcss.com", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
      },
    },
  }),
);
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"], credentials: true }));
app.use(express.json());

app.use("/api/v1", api);

app.use(express.static(frontendPath));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
