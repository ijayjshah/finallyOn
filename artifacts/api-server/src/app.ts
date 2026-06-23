import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { ZodError } from "zod";
import router from "./routes";
import { logger } from "./lib/logger";
import { HttpError } from "./lib/http-error";
import { attachUser } from "./middleware/auth";
import { getCorsOrigins } from "./lib/cors-origins";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(attachUser);

app.use("/api", router);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors[0]?.message ?? "Invalid request";
    res.status(400).json({ error: message });
    return;
  }

  if (err instanceof Error && err.message.startsWith("Invalid ")) {
    res.status(400).json({ error: err.message });
    return;
  }

  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
