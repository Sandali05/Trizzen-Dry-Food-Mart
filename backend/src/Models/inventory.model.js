const mongoose = require('mongoose');

// Define Item Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String, // Store image URL or base64 string
    // required: true
  },
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically

// Create Item Model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
