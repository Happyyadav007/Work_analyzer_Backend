import Item from "../models/Item.js";

// Add Item
export const addItem = async (req, res) => {
  try {
    const {
      name,
      price,
      seller,
      sellerPhone,
      place,
      quality,
      color,
      category,
      curved,
      multifunctional,
      images, // optional
    } = req.body;

    // Check for required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!price) missingFields.push("price");
    if (!seller) missingFields.push("seller");
    if (!sellerPhone) missingFields.push("sellerPhone");
    if (!place) missingFields.push("place");
    if (!quality) missingFields.push("quality");
    if (!category) missingFields.push("category");

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

    const addedBy = req.user.id;

    // Construct item data
    const itemData = {
      name,
      price,
      seller,
      sellerPhone,
      place,
      quality,
      color,
      category,
      curved,
      multifunctional,
      addedBy,
    };

    // If images are provided and it's an array, include them
    if (images && Array.isArray(images)) {
      itemData.images = images;
    }

    const item = new Item(itemData);
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

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.addedBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this item",
      });
    }

    // Define allowed fields for update
    const allowedFields = [
      "name",
      "price",
      "seller",
      "sellerPhone",
      "place",
      "quality",
      "color",
      "category",
      "curved",
      "multifunctional",
      "images",
    ];

    // Apply updates only to allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the item first
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Authorization: only creator or admin can delete
    const userId = req.user.id;
    const userRole = req.user.role?.toLowerCase();

    if (item.addedBy !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this item",
      });
    }

    // Delete the item
    await Item.findByIdAndDelete(itemId);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};
