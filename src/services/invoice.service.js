const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// TASK 3: CREATE INVOICE (With secure math and 14-day default due date)
const createInvoice = async (userId, data) => {
  const { customerId, items, discount = 0, tax = 0, status = 'draft', dueDate, notes, terms } = data;

  // 1. Verify the customer belongs to this user (Security)
  const customer = await prisma.customer.findFirst({ where: { id: customerId, userId } });
  if (!customer) throw new Error('Customer not found or does not belong to you');

  // 2. SECURE MATH: Calculate totals on the backend
  let subtotal = 0;
  const processedItems = items.map(item => {
    const amount = Number(item.quantity) * Number(item.unitPrice);
    subtotal += amount;
    return { ...item, amount };
  });

  const taxAmount = (subtotal * Number(tax)) / 100;
  const total = subtotal + taxAmount - Number(discount);

  // 3. Generate Invoice Number & Dates
  const invoiceNumber = `INVPRO-${Date.now()}`;
  const issueDate = new Date();
  // Default due date is 14 days from now if not provided
  const finalDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  // 4. Save to DB using a Prisma Transaction
  const invoice = await prisma.$transaction(async (tx) => {
    const newInvoice = await tx.invoice.create({
      data: {
        invoiceNumber, userId, customerId, subtotal, discount: Number(discount),
        tax: Number(tax), total, issueDate, dueDate: finalDueDate, status, notes, terms
      }
    });

    if (processedItems.length > 0) {
      await tx.invoiceItem.createMany({
        data: processedItems.map(item => ({
          invoiceId: newInvoice.id,
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          amount: item.amount
        }))
      });
    }
    return tx.invoice.findUnique({ where: { id: newInvoice.id }, include: { items: true, customer: true } });
  });

  return invoice;
};

// TASK 4: GET ALL INVOICES (Strict User Isolation)
const getInvoices = async (userId) => {
  return prisma.invoice.findMany({
    where: { userId },
    include: { customer: true, items: true },
    orderBy: { createdAt: 'desc' }
  });
};

// TASK 4: GET SINGLE INVOICE (Strict User Isolation)
const getInvoiceById = async (userId, invoiceId) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId }, // Security: MUST match userId
    include: { customer: true, items: true }
  });
  if (!invoice) throw new Error('Invoice not found');
  return invoice;
};

// TASK 4: UPDATE INVOICE STATUS (e.g., Draft -> Sent -> Paid)
const updateInvoiceStatus = async (userId, invoiceId, status) => {
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoice) throw new Error('Invoice not found or unauthorized');
  
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { status }
  });
};

// TASK 4: DELETE INVOICE (Strict User Isolation)
const deleteInvoice = async (userId, invoiceId) => {
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoice) throw new Error('Invoice not found or unauthorized');
  
  await prisma.invoice.delete({ where: { id: invoiceId } });
  return { message: 'Invoice deleted successfully' };
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoiceStatus, deleteInvoice };
