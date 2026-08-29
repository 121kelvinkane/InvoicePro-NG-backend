const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    const { user, token } = await authService.registerUser(name, email, password);
    res.status(201).json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email } }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You accessed a protected route!',
    user: req.user
  });
};

module.exports = { register, login, getMe };
