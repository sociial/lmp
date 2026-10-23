import mongoose, { Schema, Document, ObjectId } from "mongoose";

const AttemptSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: "test",
    required: true,
  },
  mcqScore: {
    type: Number,
    required: true,
  },
  codingScore: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  answers: {
    type: {
      mcqs: [
        {
          question: { type: String, required: true },
          answer: String,
          correct: { type: Boolean, default: false },
        },
      ],
      coding: [
        {
          question: { type: String, required: true },
          answer: String,
          marks: { type: Number, default: 0, min: 0, max: 10 },
          feedback: { type: String, default: "" },
        },
      ],
    },
    default: {
      mcqs: [],
      coding: [],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AttemptModel = mongoose.model("attempt", AttemptSchema);

export default AttemptModel;
