const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  vehicleId: { type: String, required: true },
  category: { type: String, enum: ['car', 'truck', 'bike'], required: true },
  orderStatus: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  assignedOrders: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }, // Linked Order
  nic: { type: String, required: true }, // NIC number
  image: { type: String }, // Image URL or path
  email: { type: String, required: true, unique: true }, // Email
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
