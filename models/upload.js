const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  bytesRead: {
    type: Number,
    default: 0
  }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
