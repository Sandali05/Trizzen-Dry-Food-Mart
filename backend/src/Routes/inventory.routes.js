const express = require('express');
const router = express.Router();
const itemController = require('../Controllers/inventory.controller');
const Item = require('../Models/inventory.model')

// Create a new Item
router.post('/items', itemController.createItem);

// Get all Items
router.get('/items', itemController.getItems);

// Get an Item by ID
router.get('/items/:id', itemController.getItemById);

// Update an Item by ID
router.put('/items/:id', itemController.updateItem);

// Delete an Item by ID
router.delete('/items/:id', itemController.deleteItem);

// Update item quantity
router.patch('/update-inventory/:id', async (req, res) => {
    const { quantity } = req.body; // Expected to be a negative number for reduction
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: quantity } }, // Reduce quantity
            { new: true } // Return the updated document
        );
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating inventory", error });
    }
});

module.exports = router;
