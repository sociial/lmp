import mongoose, { Schema } from "mongoose";

const MCQSchema = new Schema({
  question: { type: String, required: true },
  code: { type: String, default: "" },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const CodingSchema = new Schema({
  question: { type: String, required: true },
  constraints: { type: String, default: "" },
  exampleInput: { type: String },
  exampleOutput: { type: String },
});

const TestSchema = new Schema({
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  questions: {
    mcqs: [MCQSchema],
    coding: [CodingSchema],
  },
  language: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "intermediate", "hard"],
    required: true,
  },
  mcqCount: {
    type: Number,
    required: true,
  },
  codingCount: {
    type: Number,
    required: true,
  },
  jobDescription: String,
  extraDescription: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const TestModel = mongoose.model("test", TestSchema);

export default TestModel;
