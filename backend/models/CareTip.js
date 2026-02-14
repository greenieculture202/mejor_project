const mongoose = require('mongoose');

const CareTipSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CareTip', CareTipSchema);
