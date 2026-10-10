const SprayList = require('../models/SprayList');

// Helper to calculate payment status based on total and paid amount
const determinePaymentStatus = (quantity, unitPrice, paidAmount, explicitStatus) => {
  const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);
  const paid = Number(paidAmount) || 0;

  if (paid >= total && total > 0) {
    return 'paid';
  } else if (paid > 0 && paid < total) {
    return 'partial';
  } else if (paid === 0) {
    return explicitStatus === 'unpaid' ? 'unpaid' : 'pending';
  }
  return explicitStatus || 'pending';
};

// Create a new spray entry
exports.createSpray = async (req, res) => {
  try {
    let { date, customer, spray, quantity, unitPrice, paidAmount, paymentStatus } =
      req.body;

    quantity = Number(quantity);
    unitPrice = Number(unitPrice);
    paidAmount = Number(paidAmount) || 0;

    // If marked paid, default paidAmount to full total if 0
    if (paymentStatus === 'paid' && paidAmount === 0) {
      paidAmount = quantity * unitPrice;
    }

    const maxTotal = quantity * unitPrice;
    if (paidAmount > maxTotal) {
      paidAmount = maxTotal;
    }

    const calculatedStatus = determinePaymentStatus(
      quantity,
      unitPrice,
      paidAmount,
      paymentStatus
    );

    const newSpray = new SprayList({
      date,
      customer,
      spray,
      quantity,
      unitPrice,
      paidAmount,
      paymentStatus: calculatedStatus,
    });

    const savedSpray = await newSpray.save();
    const populatedSpray = await savedSpray.populate('customer', 'name phone');
    res.status(201).json(populatedSpray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all spray entries (supports filters ?customer=ID & ?paymentStatus=paid/partial/pending/unpaid)
exports.getAllSprays = async (req, res) => {
  try {
    const filter = {};
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }
    const sprays = await SprayList.find(filter)
      .populate('customer', 'name phone')
      .sort({ date: -1 });
    res.status(200).json(sprays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single spray entry by ID
exports.getSprayById = async (req, res) => {
  try {
    const spray = await SprayList.findById(req.params.id).populate(
      'customer',
      'name phone'
    );
    if (!spray) {
      return res.status(404).json({ message: 'Spray entry not found' });
    }
    res.status(200).json(spray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update spray entry by ID
exports.updateSpray = async (req, res) => {
  try {
    const existing = await SprayList.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Spray entry not found' });
    }

    const { date, customer, spray, quantity, unitPrice, paidAmount, paymentStatus } =
      req.body;

    const newQty = quantity !== undefined ? Number(quantity) : existing.quantity;
    const newUnitPrice =
      unitPrice !== undefined ? Number(unitPrice) : existing.unitPrice;
    let newPaid =
      paidAmount !== undefined ? Number(paidAmount) : existing.paidAmount || 0;

    // If manually clicked 'paid' and paid amount is still less, auto-set paidAmount to full
    if (paymentStatus === 'paid' && newPaid < newQty * newUnitPrice) {
      newPaid = newQty * newUnitPrice;
    }

    const maxTotal = newQty * newUnitPrice;
    if (newPaid > maxTotal) {
      newPaid = maxTotal;
    }

    const calculatedStatus = determinePaymentStatus(
      newQty,
      newUnitPrice,
      newPaid,
      paymentStatus || existing.paymentStatus
    );

    const updateData = {
      date: date || existing.date,
      customer: customer || existing.customer,
      spray: spray || existing.spray,
      quantity: newQty,
      unitPrice: newUnitPrice,
      paidAmount: newPaid,
      paymentStatus: calculatedStatus,
    };

    const updatedSpray = await SprayList.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).populate('customer', 'name phone');

    res.status(200).json(updatedSpray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete spray entry by ID
exports.deleteSpray = async (req, res) => {
  try {
    const deletedSpray = await SprayList.findByIdAndDelete(req.params.id);
    if (!deletedSpray) {
      return res.status(404).json({ message: 'Spray entry not found' });
    }
    res.status(200).json({ message: 'Spray entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
