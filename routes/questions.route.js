import express from "express";
import { Mistral } from "@mistralai/mistralai";
import verifyToken from "../middlewares/auth.middleware.js";
import UserModel from "../models/user.model.js";
import TestModel from "../models/test.model.js";

const router = express.Router();
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

router.post("/:testId/questions", verifyToken, async (req, res) => {
  const { testId } = req.params;

  try {
    if (!("user" in req) || !req.user) {
      return res.status(401).json({
        message: "Not Authenticated",
        success: false,
        data: null,
      });
    }

    const user = await UserModel.findById(req.user?._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Not Authenticated",
      });
    }

    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Test not found",
      });
    }

    if (test.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "You are not authorized to access this test",
      });
    }

    if (test.questions && test.questions?.mcqs.length > 0) {
      return res.status(200).json({
        success: true,
        data: test,
        message: "Test already has questions",
      });
    }

    const prompt = `You are an expert question paper generator. Generate exactly ${
      test.mcqCount
    } multiple choice questions and ${
      test.codingCount
    } coding questions in JSON format. Follow these strict rules:

    1. All coding questions must be written in ${test.language} language.
    2. The difficulty level for all questions must be "${test.difficulty}".
    3. Questions should be solvable within 30 minutes.
    4. Do NOT include any explanation or extra text—only return valid JSON.
    5. Format all code using proper indentation and escape characters where required.
    6. Strict formatting instructions:
        - Use the "code" key to include the code snippet relevant to the question.
          - Format the code exactly as it would appear in a code editor (e.g., properly indented, no escaped \`\\n\`).
          - If the MCQ doesn't involve code, set "code" to an empty string.
        - For Coding Questions:
          - Do not include any code or starter code for coding questions.
    7. Do not inline the code in a single line — maintain multiline formatting for readability.
    8. Escape any double quotes inside code properly using \\"

    ${
      test.jobDescription
        ? `9. Base the questions on this job description: ${test.jobDescription}`
        : ""
    }
    ${
      test.extraDescription
        ? `10. Consider these extra instructions: ${test.extraDescription}`
        : ""
    }

    ### JSON Format:
    {
      "name": "<Give a suitable name to the test",
      "difficulty": "${test.difficulty}",
      "language": "${test.language}",
      "mcqs": [
        {
          "question": "<MCQ Question>",
          "code": "<code if any>", // or empty string if not applicable
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Option 2"
        }
        // total of ${test.mcqCount} objects
      ],
      "coding": [
        {
          "question": "<Coding question>",
          "constraints": "<Constraints if any>",
          "exampleInput": "<Example input>",
          "exampleOutput": "<Example output>",
          "code": "<Starter code if any>"
        }
        // total of ${test.codingCount} objects
      ]
    }

    Return ONLY the JSON. No text before or after.`;

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
    });

    const raw = response.choices[0].message.content;
    const object = JSON.parse(raw);

    if (!object || !object.mcqs) {
      return res.status(400).json({
        success: false,
        message: "Invalid response format from Mistral",
        data: raw,
      });
    }

    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $push: { usage: new Date() },
      },
      { new: true }
    );

    await test.updateOne({
      questions: {
        mcqs: object.mcqs,
        coding: object.coding,
      },
      name: object.name,
    });

    return res.json({
      success: true,
      data: {
        ...test.toObject(),
        questions: {
          mcqs: object.mcqs,
          coding: object.coding,
        },
        name: object.name,
      },
      message: "Test questions generated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Failed to parse response from Mistral",
      data: null,
      success: false,
    });
  }
});

export default router;
