const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const sendEmail = require("../services/email.service");
const welcomeEmail = require("../emailTemplates/welcomeTemplate");

// MOCK DATABASE (We will replace this with Prisma later)
const users = [];

const registerUser = async (name, email, password) => {
  const userExists = users.find(
    (user) => user.email === email
  );

  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash( password, salt );

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Welcome email should not prevent registration
  sendEmail({
    to: newUser.email,
    subject: "Welcome to Invoice Pro",
    html: welcomeEmail({
      name: newUser.name,
    }),
  }).catch((error) => {
    console.error(
      "Welcome email could not be sent:",
      error.message
    );
  });

  const token = generateToken(newUser.id);

  return {
    user: newUser,
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
