require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const connectToDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = {
  connectToDb,
};
