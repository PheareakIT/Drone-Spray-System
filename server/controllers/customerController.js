const Customer = require('../models/Customer');
const SprayList = require('../models/SprayList');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const customer = new Customer({ name, phone });
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { returnDocument: 'after', runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete customer by ID (with referential integrity check against SprayList)
exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if customer is referenced in any spray records
    const sprayCount = await SprayList.countDocuments({ customer: customerId });
    if (sprayCount > 0) {
      return res.status(400).json({
        message: `Cannot delete customer "${customer.name}" because they have ${sprayCount} associated spray record(s). Please delete or reassign their spray records first.`,
        code: 'CUSTOMER_HAS_SPRAYS',
        sprayCount,
      });
    }

    await Customer.findByIdAndDelete(customerId);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
