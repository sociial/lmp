import express from "express";
import { Mistral } from "@mistralai/mistralai";

const app = express();
app.use(express.json());

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });
const port = process.env.PORT || 3000;

app.post("/generate", async (req, res) => {
  const {
    mcqs,
    coding,
    language,
    difficulty,
    jobDescription,
    extraDescription,
  } = req.body;

  if (!mcqs || !coding || !language || !difficulty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `You are an expert question paper generator. Generate exactly ${mcqs} multiple choice questions and ${coding} coding questions in JSON format. Follow these strict rules:

    1. All coding questions must be written in ${language} language.
    2. The difficulty level for all questions must be "${difficulty}".
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
      jobDescription
        ? `9. Base the questions on this job description: ${jobDescription}`
        : ""
    }
    ${
      extraDescription
        ? `10. Consider these extra instructions: ${extraDescription}`
        : ""
    }

    ### JSON Format:
    {
      "name": "<Give a suitable name to the ",
      "difficulty": "${difficulty}",
      "language": "${language}",
      "mcqs": [
        {
          "question": "<MCQ Question>",
          "code": "<code if any>", // or empty string if not applicable
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Option 2"
        }
        // total of ${mcqs} objects
      ],
      "coding": [
        {
          "question": "<Coding question>",
          "constraints": "<Constraints if any>",
          "exampleInput": "<Example input>",
          "exampleOutput": "<Example output>",
          "code": "<Starter code if any>"
        }
        // total of ${coding} objects
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

  try {
    const object = JSON.parse(raw);
    return res.json({
      success: true,
      data: object,
      message: "Questions generated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Failed to parse response from Mistral",
      data: raw,
      success: false,
    });
  }
});

app.listen(port, () => console.log("Server is running on port", port));
