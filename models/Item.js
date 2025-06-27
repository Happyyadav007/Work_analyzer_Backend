import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: ["", ""],
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  sellerPhone: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  quality: {
    type: String,
    enum: ["best", "good", "ok"],
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  curved: {
    type: Boolean,
    default: false,
  },
  multifunctional: {
    type: Boolean,
    default: false,
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
