const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      required: false,
    },
    image_public_id: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ['single_choice'],
      default: 'single_choice',
    },

    options: {
      type: [optionSchema],
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: 'Question must have at least 2 options',
      },
    },

    subject_id: {
      type: mongoose.Schema.Types.ObjectId, ref: "Subject",
      required: true,
    },

    chapter_id: {
      type: mongoose.Schema.Types.ObjectId, ref: "Chapter",
      required: true,
    },

    lesson_id: {
      type: mongoose.Schema.Types.ObjectId, ref: "Lesson",
      required: true,
    },

    knowledgeType: {
      type: String,
      //enum: ['concept', 'exercise'],
      required: true,
    },

    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },

    explanation: {
      type: String,
      default: '',
      trim: true,
    },

    tags: [{ type: String, trim: true, },],

    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Question', questionSchema);