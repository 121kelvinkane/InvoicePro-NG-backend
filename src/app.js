const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const env = require("./config/env");
const routes = require("./routes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      env.clientOrigin === "*"
        ? true
        : env.clientOrigin.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
});

module.exports = app;