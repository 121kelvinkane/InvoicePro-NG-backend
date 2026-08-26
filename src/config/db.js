const mongoose = require("mongoose");
const env = require("./env");

let isConnected = mongoose.connection.readyState === 1;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(env.mongoUri);

    isConnected = true;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;