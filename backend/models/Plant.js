const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  discountPrice: Number,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plant', PlantSchema);
