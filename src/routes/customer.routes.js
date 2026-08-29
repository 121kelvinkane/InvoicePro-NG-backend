const express = require('express');
const { createCustomer, getAllCustomers, getCustomerById } = require('../controllers/customer.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

module.exports = router;
