import express from "express";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "../controller/auth.controller";
import validate from "../middleware/validate";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post(
  "/api/users/login",
  validate(createSessionSchema),
  createSessionHandler
);

router.post("/api/sessions/refresh", refreshAccessTokenHandler);

export default router;