import mongoose from "mongoose";
const mongoDb =
  "mongodb+srv://interiorvelocity:v3Ml1joe66MRJw8k@velocityworkanalyzer.pv5r7f6.mongodb.net/";
const connectDb = async () => {
  const db = await mongoose.connect(mongoDb);
  console.log("connection establoished", db.connection.host);
  return db;
};

export default connectDb;
