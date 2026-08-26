const express = require("express");
const { signUp } = require("../controllers/auth/signUp");
const { signIn } = require("../controllers/auth/signIn");
const { signOut } = require("../controllers/auth/signOut");
const { regLimiter, loginLimier } = require("../services/rateLimit");

const route = express.Router();

route.post("/sign-up", regLimiter, signUp);
route.post("/sign-in", loginLimier, signIn);
route.post("/sign-out", signOut);

module.exports = route;