const invoiceService = require('../services/invoice.service');

const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoice = await invoiceService.createInvoice(userId, req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices(req.user.id);
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await invoiceService.updateInvoiceStatus(req.user.id, req.params.id, req.body.status);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const result = await invoiceService.deleteInvoice(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoiceStatus, deleteInvoice };
