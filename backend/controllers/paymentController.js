const crypto = require('crypto');
const Payment = require('../models/payment');
const Member = require('../models/member');
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const apiResponse = require('../utils/apiResponse');

let razorpay = null;

// Initialize Razorpay only if credentials exist
if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return apiResponse.error(res, 400, 'Amount must be a positive number');
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
if (!razorpay) {
  return apiResponse.error(res, 500, "Razorpay is not configured.");
}
    const order = await razorpay.orders.create(options);

    apiResponse.success(res, 201, "Order created successfully", {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to create order');
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memberId, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return apiResponse.error(res, 400, 'Missing payment verification fields');
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return apiResponse.error(res, 400, 'Invalid payment signature');
    }

    let resolvedMemberId = memberId;
    if (!resolvedMemberId) {
      const member = await Member.findOne({ email: req.user.email });
      if (member) resolvedMemberId = member._id;
    }

    const payment = await Payment.create({
      memberId: resolvedMemberId || undefined,
      membershipId: planId || undefined,
      amount: req.body.amount || 0,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      paymentDate: new Date(),
    });

    apiResponse.success(res, 200, 'Payment verified successfully', payment);
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to verify payment');
  }
};

exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.create({
      ...req.body,
      receivedBy: req.user.id,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    apiResponse.success(res, 201, 'Payment created successfully', order);
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to create payment');
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .select("memberId membershipId amount paymentMethod paymentStatus paymentDate transactionId receivedBy")
      .populate('memberId', 'name email phone')
      .populate({ path: 'membershipId', select: 'planName price duration durationType' })
      .populate('receivedBy', 'name role')
      .sort({ createdAt: -1 })
      .lean();

    apiResponse.success(res, 200, 'Payments fetched successfully', payments);
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to fetch payments');
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .select("memberId membershipId amount paymentMethod paymentStatus paymentDate transactionId receivedBy")
      .populate('memberId', 'name email phone')
      .populate({ path: 'membershipId', select: 'planName price duration durationType' })
      .populate('receivedBy', 'name role')
      .lean();

    if (!payment) {
      return apiResponse.error(res, 404, 'Payment not found');
    }

    apiResponse.success(res, 200, 'Payment fetched successfully', payment);
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to fetch payment');
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!payment) {
      return apiResponse.error(res, 404, 'Payment not found');
    }

    apiResponse.success(res, 200, 'Payment updated successfully', payment);
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to update payment');
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return apiResponse.error(res, 404, 'Payment not found');
    }

    apiResponse.success(res, 200, 'Payment deleted successfully');
  } catch (error) {
    apiResponse.error(res, 500, 'Failed to delete payment');
  }
};
