import request from 'supertest';
import app from '../../src/app'; // assuming express app is exported from here

describe('Razorpay Service', () => {
  it('should create a payment order', async () => {
    const response = await request(app)
      .post('/payments/order')
      .send({ amount: 100, currency: 'INR' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orderId');
  });

  it('should handle payment response', async () => {
    const response = await request(app)
      .post('/payments/response')
      .send({ razorpay_order_id: 'order_id', razorpay_payment_id: 'payment_id', razorpay_signature: 'signature' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Payment successful');
  });
});