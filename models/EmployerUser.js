import mongoose from "mongoose";

const EmployerUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  profile_image_url: {
    type: String,
    default: null,
  },
  last_login: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "head", "junior"], // you can customize allowed roles
    default: "junior",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const EmployerUser = mongoose.model("EmployerUser", EmployerUserSchema);

export default EmployerUser;
