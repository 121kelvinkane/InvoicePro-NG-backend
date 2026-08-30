const express = require('express');
const { createProfile, getProfile } = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply the "bouncer" to ALL customer routes below this line
router.use(protect);

router.put('/', createProfile);
router.get('/', getProfile);

module.exports = router;
