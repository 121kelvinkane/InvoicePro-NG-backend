require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  mongoUri: process.env.MONGO_URI,
  accesstoken: process.env.ACCESS_TOKEN,
};

if (!env.mongoUri) {
  throw new Error("MONGO_URI is missing from .env");
}

module.exports = env;