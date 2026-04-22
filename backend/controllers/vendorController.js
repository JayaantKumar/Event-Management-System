const Product = require('../models/Product');


exports.addItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await Product.create({
      vendorId: req.user.id, // Automatically pulled from JWT token
      name,
      price
    });
    res.status(201).json({ message: 'Item added successfully', product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getItems = async (req, res) => {
  try {
    // Only fetch products that belong to the logged-in vendor
    const products = await Product.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id }, 
      { status }, 
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Status updated', product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};