import Razorpay from 'razorpay';
import { Request, Response } from 'express';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function createPaymentOrder(req: Request, res: Response) {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // convert to smallest currency unit
      currency,
      receipt: `receipt_order_${Math.random()}`
    };
    const order = await razorpayInstance.orders.create(options);
    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}

export async function handlePaymentResponse(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // Verification logic here
    res.json({ status: 'Payment successful' });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
}