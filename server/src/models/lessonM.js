const mongoose = require('mongoose');
const chapterM = require('./chapterM');

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
    code: { type: String, required: true },
  chapter_id: {  type:  mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  description: { type: String, required: true },
  order:{ type: Number, required: true }
}, {
  timestamps: true, 
  versionKey: false
});

module.exports = mongoose.model('Lesson', lessonSchema);