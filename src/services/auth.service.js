const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (name, email, password) => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      fullName: name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(newUser.id);
  return { 
    user: { id: newUser.id, name: newUser.fullName, email: newUser.email }, 
    token 
  };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user.id);
  return { 
    user: { id: user.id, name: user.fullName, email: user.email }, 
    token 
  };
};

module.exports = { registerUser, loginUser };
