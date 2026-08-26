const userResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  profileCompleted: user.profileCompleted,
});

module.exports = userResponse;