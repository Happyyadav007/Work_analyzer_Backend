import Item from "../models/Item.js";

// Add Item
export const addItem = async (req, res) => {
  try {
    const { name, price, seller, color } = req.body;

    // Check for required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!price) missingFields.push("price");
    if (!seller) missingFields.push("seller");
    if (!color) missingFields.push("color");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    // Check for duplicate
    const existingItem = await Item.findOne({ name, price, seller, color });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        error:
          "Item with the same name, price, seller, and color already exists",
      });
    }

    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
};

// Get All Items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ addedDate: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit Item
export const editItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Item
export const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
