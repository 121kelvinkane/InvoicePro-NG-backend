const express = require('express');
const authRoutes = require("./userRouter")

const router = express.Router();


router.use("/auth", authRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime()
    }
  });
});


module.exports = router;
