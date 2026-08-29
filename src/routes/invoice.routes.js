const express = require('express');
const { createInvoice, getInvoices, getInvoiceById, updateInvoiceStatus, deleteInvoice } = require('../controllers/invoice.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

module.exports = router;
