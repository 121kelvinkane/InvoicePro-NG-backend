const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const sendEmail = require("../services/email.service");
const welcomeEmail = require("../emailTemplates/welcomeTemplate");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (fullName, email, password) => {
  //Check if user already exists in the database
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create the user in the database using Prisma
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  //Send welcome email (non-blocking)
  sendEmail({
    to: newUser.email,
    subject: "Welcome to Billionz",
    html: welcomeEmail({
      name: newUser.fullName,
    }),
  }).catch((error) => {
    console.error(
      "Welcome email could not be sent:",
      error.message
    );
  });

  //Generate JWT token
  const token = generateToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
    },
    token,
    message: "Account created successfully.",
  };
};

const loginUser = async (email, password) => {
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);
  return { user, token };
};

module.exports = { registerUser, loginUser };
