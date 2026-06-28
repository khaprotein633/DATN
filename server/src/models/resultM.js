const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  subject_id: { type: String, required: true },
  chapter_id: { type: String, required: true },
  lesson_id: { type: String, required: true },
  knowledgeType: { type: String, required: true, },
  difficulty: { type: String, required: true },
  question_id: { type: String, required: true },
  selected: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { versionKey: false, _id: false });

const resultSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  exam_id: { type: String, required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  answers: [answerSchema],
  score: { type: Number, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Result', resultSchema);