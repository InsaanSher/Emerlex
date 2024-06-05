const billsModel = require("../models/billsModel");

const generateInvoiceNumber = async () => {
  const lastBill = await billsModel.findOne().sort({ _id: -1 });
  if (!lastBill || !lastBill.invoiceNumber) {
    return "IN0000001";
  }
  const lastInvoiceNumber = lastBill.invoiceNumber;
  const invoiceNumber = parseInt(lastInvoiceNumber.replace("IN", ""), 10) + 1;
  return "IN" + invoiceNumber.toString().padStart(7, "0");
};

// Add Bills
const addBillsController = async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const newBill = new billsModel({
      ...req.body,
      invoiceNumber,
    });
    await newBill.save();
    res.send("Bill Created Successfully!");
  } catch (error) {
    res.status(500).send("Something went wrong");
    console.log(error);
  }
};

// Get Bills
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addBillsController,
  getBillsController,
};
