const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true , unique: true},
  subject_id: { type:  mongoose.Schema.Types.ObjectId, ref: "Subject",required: true },
  description: { type: String, required: true },
  order:{ type: Number, required: true }
}, {
  timestamps: true, 
  versionKey: false
});

module.exports = mongoose.model('Chapter', chapterSchema);