const Item = require('../Models/inventory.model');

// Create a new Item
module.exports.createItem = async (req, res) => {
  try {
    const { name, quantity, price, image } = req.body;

    // Validate required fields
    if (!name || !quantity || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newItem = new Item({ name, quantity, price, image });
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error });
  }
};

// Get all Items
module.exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

// Get a single Item by ID
module.exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

// Update an Item by ID
module.exports.updateItem = async (req, res) => {
  try {
    const { name, quantity, price, image } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, quantity, price, image },
      { new: true } // Returns the updated document
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
};

// Delete an Item by ID
module.exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

