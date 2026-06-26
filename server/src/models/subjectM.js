const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true , unique: true},
  description: { type: String, required: true },
}, {
  timestamps: true, 
  versionKey: false
});

module.exports = mongoose.model('Subject', subjectSchema);