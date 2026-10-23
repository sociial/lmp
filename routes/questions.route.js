import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  generateQuestion,
  submitTest,
} from "../controllers/question.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/:testId/questions", generateQuestion);

router.post("/:testId/submit", submitTest);

export default router;
