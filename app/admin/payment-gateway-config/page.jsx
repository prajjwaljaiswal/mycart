import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';

function PaymentGatewayConfig() {
  return (
    <AdminLayout>
      <h1>Payment Gateway Configurations</h1>
      <form>
        <div>
          <label htmlFor="gateway">Gateway Name:</label>
          <input type="text" id="gateway" name="gateway" placeholder="e.g., Stripe, PayPal" />
        </div>
        <div>
          <label htmlFor="api-key">API Key:</label>
          <input type="text" id="api-key" name="api-key" />
        </div>
        <div>
          <label htmlFor="secret-key">Secret Key:</label>
          <input type="text" id="secret-key" name="secret-key" />
        </div>
        <div>
          <button type="submit">Save Configuration</button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default PaymentGatewayConfig;