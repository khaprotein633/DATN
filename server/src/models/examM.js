const mongoose = require('mongoose');


const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, },
    isCorrect: { type: Boolean, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const questionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  subject_id: { type: String, required: true },
  lesson_id: { type: String, required: true },
  chapter_id: { type: String, required: true },
  knowledgeType: { type: String, required: true, },
  content: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  options: [optionSchema],
}, { _id: false, versionKey: false });

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject",required: true },
  questions: [questionSchema],
  time: { type: Number, required: true },
  total_question: { type: Number, required: true },
  difficulty_mode: { type: String, enum: ["easy", "medium", "hard"], required: true, },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
  description: { type: String, required: true },
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('exam', examSchema);