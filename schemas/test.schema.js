export const testJsonSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "A suitable name for the test." },
    difficulty: { type: "string" },
    language: { type: "string" },
    mcqs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          code: {
            type: "string",
            description: "Code snippet for the question, or an empty string.",
          },
          options: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 4,
          },
          answer: {
            type: "string",
            description: "Must be exactly one of the options.",
          },
        },
        required: ["question", "code", "options", "answer"],
      },
    },
    coding: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          constraints: { type: "string" },
          exampleInput: { type: "string" },
          exampleOutput: { type: "string" },
        },
        required: ["question"],
      },
    },
  },
  required: ["name", "mcqs", "coding"],
};

export const evaluationJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string", description: "The question text." },
      marks: {
        type: "integer",
        minimum: 0,
        maximum: 10,
        description: "Score for the solution, from 0 to 10.",
      },
      feedback: {
        type: "string",
        description: "Brief constructive feedback on the solution.",
      },
    },
    required: ["question", "marks", "feedback"],
  },
};
